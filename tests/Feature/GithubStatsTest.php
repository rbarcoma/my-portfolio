<?php

namespace Tests\Feature;

use App\Services\GitHubService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubStatsTest extends TestCase
{
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
        Http::preventStrayRequests();
        Http::fake([
            'github-contributions-api.jogruber.de/*' => Http::response([
                [
                    'days' => [
                        ['count' => 3, 'date' => now()->subYear()->format('Y-m-d')],
                        ['count' => 4, 'date' => now()->format('Y-m-d')],
                    ],
                ],
            ]),
            '*' => Http::response(null, 503),
        ]);

        Cache::flush();
        config(['portfolio.github_username' => 'octocat']);

        $contributions = $this->app->make(GitHubService::class)->contributions('octocat');

        $this->assertNotNull($contributions);
        $this->assertSame(7, $contributions['total']);
        $this->assertSame(4, $contributions['this_year']);
        $this->assertSame([[3, 4]], $contributions['weeks']);
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
