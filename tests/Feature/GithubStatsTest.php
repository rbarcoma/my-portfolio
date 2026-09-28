<?php

namespace Tests\Feature;

use App\Services\GitHubService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubStatsTest extends TestCase
{
    /**
     * @param  list<array<string, mixed>>  $weeks
     * @return array<string, mixed>
     */
    private function contributionCalendarPayload(int $total, array $weeks): array
    {
        return [
            'data' => [
                'user' => [
                    'contributionsCollection' => [
                        'contributionCalendar' => [
                            'totalContributions' => $total,
                            'weeks' => $weeks,
                        ],
                    ],
                ],
            ],
        ];
    }

    private function configureGithub(?string $token = null, ?string $webhookSecret = null): void
    {
        config([
            'portfolio.github_username' => 'octocat',
            'services.github.token' => $token,
            'services.github.webhook_secret' => $webhookSecret,
        ]);
    }

    private function webhookPayload(): string
    {
        return '{"repository":{"full_name":"octocat/portfolio"}}';
    }

    private function webhookSignature(string $payload, string $secret = 'webhook-secret'): string
    {
        return 'sha256='.hash_hmac('sha256', $payload, $secret);
    }

    public function test_endpoint_returns_json_with_the_configured_username(): void
    {
        Http::preventStrayRequests();
        Http::fake(['*' => Http::response(null, 503)]);

        Cache::flush();
        $this->configureGithub();

        $this->get(route('github.stats'))
            ->assertOk()
            ->assertHeaderContains('Cache-Control', 'no-store')
            ->assertJsonPath('username', 'octocat')
            ->assertJsonPath('available', false)
            ->assertJsonPath('repos', [])
            ->assertJsonPath('languages', [])
            ->assertJsonPath('contributions', null);
    }

    public function test_profile_is_mapped_and_cached(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/users/octocat' => Http::response([
                'name' => 'The Octocat',
                'login' => 'octocat',
                'html_url' => 'https://github.com/octocat',
                'avatar_url' => 'https://avatars.githubusercontent.com/u/1',
                'bio' => 'Hubot',
                'location' => 'San Francisco',
                'public_repos' => 8,
                'followers' => 12,
                'following' => 3,
            ]),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        $this->configureGithub();

        $this->getJson(route('github.stats'))
            ->assertJsonPath('available', true)
            ->assertJsonPath('profile.login', 'octocat')
            ->assertJsonPath('profile.public_repos', 8)
            ->assertJsonPath('profile.followers', 12);

        $requestsAfterFirstVisit = Http::recorded()->count();

        $this->assertSame(8, $this->app->make(GitHubService::class)->profile('octocat')['public_repos']);

        Http::assertSentCount($requestsAfterFirstVisit);
    }

    public function test_blade_language_uses_the_blade_red_color(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/users/octocat/repos*' => Http::response([
                ['language' => 'Blade'],
                ['language' => 'PHP'],
            ]),
        ]);

        Cache::flush();

        $languages = $this->app->make(GitHubService::class)->languages('octocat');
        $blade = collect($languages)->firstWhere('name', 'Blade');

        $this->assertNotNull($blade);
        $this->assertSame('#F7523F', $blade['color']);
    }

    public function test_contributions_are_mapped_from_the_official_github_calendar(): void
    {
        $year = now()->year;

        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/graphql' => Http::response($this->contributionCalendarPayload(10, [
                [
                    'contributionDays' => [
                        ['contributionCount' => 4, 'date' => ($year - 1).'-12-31', 'weekday' => 0],
                        ['contributionCount' => 2, 'date' => $year.'-01-01', 'weekday' => 4],
                    ],
                ],
                [
                    'contributionDays' => [
                        ['contributionCount' => 1, 'date' => $year.'-01-04', 'weekday' => 0],
                        ['contributionCount' => 3, 'date' => $year.'-01-06', 'weekday' => 2],
                    ],
                ],
            ])),
        ]);

        Cache::flush();
        $this->configureGithub(token: 'github-token');

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(10, $contributions['total']);
        $this->assertSame(6, $contributions['this_year']);
        $this->assertSame([
            [4, 0, 0, 0, 2, 0, 0],
            [1, 0, 3, 0, 0, 0, 0],
        ], $contributions['weeks']);

        Http::assertSent(function (Request $request): bool {
            return $request->method() === 'POST'
                && $request->url() === 'https://api.github.com/graphql'
                && $request->hasHeader('Authorization', 'Bearer github-token')
                && $request->data()['variables']['login'] === 'octocat';
        });
    }

    public function test_stats_remain_available_when_the_official_calendar_is_available(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/graphql' => Http::response($this->contributionCalendarPayload(3, [
                [
                    'contributionDays' => [
                        ['contributionCount' => 3, 'date' => now()->toDateString(), 'weekday' => now()->dayOfWeek],
                    ],
                ],
            ])),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        $this->configureGithub(token: 'github-token');

        $stats = $this->app->make(GitHubService::class)->stats();

        $this->assertTrue($stats['available']);
        $this->assertNull($stats['profile']);
        $this->assertSame(3, $stats['contributions']['total']);
    }

    public function test_contributions_are_unavailable_without_a_github_token(): void
    {
        Http::preventStrayRequests();
        Cache::flush();
        $this->configureGithub();

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNull($contributions);
        Http::assertNothingSent();
    }

    public function test_graphql_errors_degrade_to_unavailable_contributions(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'api.github.com/graphql' => Http::response([
                'errors' => [['message' => 'Bad credentials']],
            ]),
        ]);

        Cache::flush();
        $this->configureGithub(token: 'github-token');

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNull($contributions);
    }

    public function test_push_webhook_invalidates_the_contribution_cache(): void
    {
        Cache::flush();
        $this->configureGithub(webhookSecret: 'webhook-secret');
        Cache::put('github.contributions.octocat', ['total' => 10], 30);

        $payload = $this->webhookPayload();

        $this->call('POST', route('github.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_GITHUB_EVENT' => 'push',
            'HTTP_X_HUB_SIGNATURE_256' => $this->webhookSignature($payload),
        ], $payload)->assertNoContent();

        $this->assertFalse(Cache::has('github.contributions.octocat'));
    }

    public function test_webhook_rejects_an_invalid_signature_without_invalidating_the_cache(): void
    {
        Cache::flush();
        $this->configureGithub(webhookSecret: 'webhook-secret');
        Cache::put('github.contributions.octocat', ['total' => 10], 30);

        $payload = $this->webhookPayload();

        $this->call('POST', route('github.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_GITHUB_EVENT' => 'push',
            'HTTP_X_HUB_SIGNATURE_256' => 'sha256=invalid',
        ], $payload)->assertForbidden();

        $this->assertTrue(Cache::has('github.contributions.octocat'));
    }

    public function test_non_push_webhooks_leave_the_contribution_cache_intact(): void
    {
        Cache::flush();
        $this->configureGithub(webhookSecret: 'webhook-secret');
        Cache::put('github.contributions.octocat', ['total' => 10], 30);

        $payload = $this->webhookPayload();

        $this->call('POST', route('github.webhook'), [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_GITHUB_EVENT' => 'ping',
            'HTTP_X_HUB_SIGNATURE_256' => $this->webhookSignature($payload),
        ], $payload)->assertNoContent();

        $this->assertTrue(Cache::has('github.contributions.octocat'));
    }

    public function test_upstream_failures_degrade_to_an_unavailable_payload(): void
    {
        Http::preventStrayRequests();
        Http::fake(['*' => Http::response('boom', 500)]);

        Cache::flush();
        $this->configureGithub(token: 'github-token');

        $stats = $this->app->make(GitHubService::class)->stats();

        $this->assertFalse($stats['available']);
        $this->assertNull($stats['profile']);
        $this->assertSame([], $stats['repos']);
        $this->assertNull($stats['contributions']);
    }
}
