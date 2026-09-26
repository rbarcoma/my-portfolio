<?php

namespace Tests\Feature;

use App\Services\GitHubService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubStatsTest extends TestCase
{
    /**
     * The live endpoint returns days newest-first; keep the fixtures honest.
     *
     * @param  array<string, int>  $counts  Date => contribution count.
     * @return array{total: array<string, int>, contributions: list<array{count: int, date: string}>}
     */
    private function contributionPayload(array $counts): array
    {
        $days = [];

        foreach ($counts as $date => $count) {
            $days[] = ['count' => $count, 'date' => $date];
        }

        return [
            'total' => [],
            'contributions' => array_reverse($days),
        ];
    }

    public function test_endpoint_returns_json_with_the_configured_username(): void
    {
        Http::preventStrayRequests();
        Http::fake(['*' => Http::response(null, 503)]);

        config(['portfolio.github_username' => 'octocat']);

        $this->get(route('github.stats'))
            ->assertOk()
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
        config(['portfolio.github_username' => 'octocat']);

        $this->getJson(route('github.stats'))
            ->assertJsonPath('available', true)
            ->assertJsonPath('profile.login', 'octocat')
            ->assertJsonPath('profile.public_repos', 8)
            ->assertJsonPath('profile.followers', 12);

        $requestsAfterFirstVisit = Http::recorded()->count();

        $this->assertSame(8, $this->app->make(GitHubService::class)->profile('octocat')['public_repos']);

        Http::assertSentCount($requestsAfterFirstVisit);
    }

    public function test_contributions_are_totalled_per_year(): void
    {
        $this->travelTo(now()->startOfYear()->addMonths(2)->startOfDay());

        Http::preventStrayRequests();
        Http::fake([
            'github-contributions-api.jogruber.de/*' => Http::response($this->contributionPayload([
                now()->subDay()->toDateString() => 1,
                now()->toDateString() => 2,
                now()->subYear()->toDateString() => 5,
            ])),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(8, $contributions['total']);
        $this->assertSame(3, $contributions['this_year']);

        foreach ($contributions['weeks'] as $week) {
            $this->assertCount(7, $week);
        }
    }

    public function test_contribution_days_are_grouped_into_sunday_first_columns(): void
    {
        $wednesday = now()->subWeeks(2)->startOfWeek(Carbon::SUNDAY)->addDays(3);

        Http::preventStrayRequests();
        Http::fake([
            'github-contributions-api.jogruber.de/*' => Http::response($this->contributionPayload([
                $wednesday->toDateString() => 3,
                $wednesday->copy()->addDay()->toDateString() => 1,
                $wednesday->copy()->addDays(2)->toDateString() => 2,
                $wednesday->copy()->addDays(3)->toDateString() => 0,
                $wednesday->copy()->addDays(4)->toDateString() => 4,
            ])),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(10, $contributions['total']);
        $this->assertSame([[0, 0, 0, 3, 1, 2, 0], [4, 0, 0, 0, 0, 0, 0]], $contributions['weeks']);
    }

    public function test_days_after_today_are_dropped_so_the_graph_ends_on_the_current_week(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'github-contributions-api.jogruber.de/*' => Http::response($this->contributionPayload([
                now()->toDateString() => 2,
                now()->addDay()->toDateString() => 9,
                now()->addWeek()->toDateString() => 9,
            ])),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(2, $contributions['total']);
        $this->assertCount(1, $contributions['weeks']);
    }

    public function test_contributions_understand_the_legacy_week_payload(): void
    {
        $wednesday = now()->subWeeks(2)->startOfWeek(Carbon::SUNDAY)->addDays(3);

        Http::preventStrayRequests();
        Http::fake([
            'github-contributions-api.jogruber.de/*' => Http::response([
                [
                    'days' => [
                        ['count' => 3, 'date' => $wednesday->toDateString()],
                        ['count' => 1, 'date' => $wednesday->copy()->addDay()->toDateString()],
                        ['count' => 0, 'date' => $wednesday->copy()->addDays(2)->toDateString()],
                        ['count' => 0, 'date' => $wednesday->copy()->addDays(3)->toDateString()],
                        ['count' => 4, 'date' => $wednesday->copy()->addDays(4)->toDateString()],
                    ],
                ],
            ]),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(8, $contributions['total']);
        $this->assertSame([[0, 0, 0, 3, 1, 0, 0], [4, 0, 0, 0, 0, 0, 0]], $contributions['weeks']);
    }

    public function test_upstream_failures_degrade_to_an_unavailable_payload(): void
    {
        Http::preventStrayRequests();
        Http::fake(['*' => Http::response('boom', 500)]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $stats = $this->app->make(GitHubService::class)->stats();

        $this->assertFalse($stats['available']);
        $this->assertNull($stats['profile']);
        $this->assertSame([], $stats['repos']);
    }
}
