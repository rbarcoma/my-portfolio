<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    private const PROFILE_TTL = 21600;

    private const REPOS_TTL = 21600;

    private const CONTRIBUTIONS_TTL = 30;

    private const CONTRIBUTION_RANGE_DAYS = 365;

    /**
     * @return array{
     *     username: string,
     *     available: bool,
     *     profile: array<string, mixed>|null,
     *     repos: list<array<string, mixed>>,
     *     languages: list<array{name: string, color: string, percentage: float}>,
     *     contributions: array{weeks: list<list<int>>, total: int, this_year: int}|null
     * }
     */
    public function stats(): array
    {
        $username = (string) config('portfolio.github_username');

        if ($username === '') {
            return $this->emptyStats('');
        }

        $profile = $this->profile($username);
        $contributions = $this->contributions($username);

        return [
            'username' => $username,
            'available' => $profile !== null || $contributions !== null,
            'profile' => $profile,
            'repos' => $this->repos($username),
            'languages' => $this->languages($username),
            'contributions' => $contributions,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function profile(string $username): ?array
    {
        return Cache::remember("github.profile.{$username}", self::PROFILE_TTL, function () use ($username): ?array {
            $data = $this->getJson("https://api.github.com/users/{$username}");

            if ($data === null) {
                return null;
            }

            return [
                'name' => $data['name'] ?? $username,
                'login' => $data['login'] ?? $username,
                'url' => $data['html_url'] ?? "https://github.com/{$username}",
                'avatar_url' => $data['avatar_url'] ?? null,
                'bio' => $data['bio'] ?? null,
                'location' => $data['location'] ?? null,
                'public_repos' => (int) ($data['public_repos'] ?? 0),
                'followers' => (int) ($data['followers'] ?? 0),
                'following' => (int) ($data['following'] ?? 0),
            ];
        });
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function repos(string $username): array
    {
        return Cache::remember("github.repos.{$username}", self::REPOS_TTL, function () use ($username): array {
            $repos = $this->getJson("https://api.github.com/users/{$username}/repos", [
                'sort' => 'updated',
                'per_page' => 100,
            ]);

            if ($repos === null) {
                return [];
            }

            return collect($repos)
                ->reject(fn (array $repo): bool => $repo['fork'] ?? false)
                ->sortByDesc(fn (array $repo): int => (int) ($repo['stargazers_count'] ?? 0))
                ->take(6)
                ->map(fn (array $repo): array => [
                    'name' => $repo['name'],
                    'description' => $repo['description'],
                    'url' => $repo['html_url'],
                    'stars' => (int) ($repo['stargazers_count'] ?? 0),
                    'forks' => (int) ($repo['forks_count'] ?? 0),
                    'language' => $repo['language'],
                    'updated_at' => $repo['updated_at'],
                ])
                ->values()
                ->all();
        });
    }

    /**
     * @return list<array{name: string, color: string, percentage: float}>
     */
    public function languages(string $username): array
    {
        return Cache::remember("github.languages.v2.{$username}", self::PROFILE_TTL, function () use ($username): array {
            $repos = $this->getJson("https://api.github.com/users/{$username}/repos", ['per_page' => 100]);

            if ($repos === null) {
                return [];
            }

            $colors = [
                'PHP' => '#7A7FE5',
                'JavaScript' => '#C6FF3E',
                'TypeScript' => '#22D3EE',
                'Python' => '#F5C542',
                'HTML' => '#E34F26',
                'CSS' => '#A78BFA',
                'Blade' => '#F7523F',
                'Vue' => '#41B883',
                'Java' => '#F89820',
            ];

            $bytes = collect($repos)
                ->pluck('language')
                ->filter()
                ->countBy()
                ->map(fn (int $count, string $language): array => [
                    'name' => $language,
                    'color' => $colors[$language] ?? '#6F6F7D',
                    'count' => $count,
                ])
                ->sortByDesc('count')
                ->values();

            $total = max($bytes->sum('count'), 1);

            return $bytes
                ->map(fn (array $language): array => [
                    'name' => $language['name'],
                    'color' => $language['color'],
                    'percentage' => round(($language['count'] / $total) * 100, 1),
                ])
                ->all();
        });
    }

    /**
     * @return array{weeks: list<list<int>>, total: int, this_year: int}|null
     */
    public function contributions(string $username): ?array
    {
        return Cache::remember($this->contributionCacheKey($username), self::CONTRIBUTIONS_TTL, function () use ($username): ?array {
            $calendar = $this->contributionCalendar($username);

            if ($calendar === null) {
                return null;
            }

            $year = (int) now()->format('Y');
            $thisYear = 0;
            $weeks = [];

            foreach ($calendar['weeks'] ?? [] as $week) {
                if (! is_array($week)) {
                    continue;
                }

                $counts = array_fill(0, 7, 0);

                foreach ($week['contributionDays'] ?? [] as $day) {
                    if (! is_array($day)) {
                        continue;
                    }

                    $weekday = (int) ($day['weekday'] ?? -1);
                    $count = (int) ($day['contributionCount'] ?? 0);
                    $date = $day['date'] ?? null;

                    if ($weekday >= 0 && $weekday < 7) {
                        $counts[$weekday] = $count;
                    }

                    if (is_string($date) && (int) substr($date, 0, 4) === $year) {
                        $thisYear += $count;
                    }
                }

                $weeks[] = $counts;
            }

            if ($weeks === []) {
                return null;
            }

            return [
                'weeks' => $weeks,
                'total' => (int) ($calendar['totalContributions'] ?? 0),
                'this_year' => $thisYear,
            ];
        });
    }

    /**
     * Forget the official contribution calendar after a verified push webhook.
     */
    public function forgetContributions(string $username): void
    {
        Cache::forget($this->contributionCacheKey($username));
    }

    /**
     * Verify GitHub's HMAC-SHA256 signature against the unmodified body.
     */
    public function hasValidWebhookSignature(string $payload, ?string $signature): bool
    {
        $secret = config('services.github.webhook_secret');

        if (! is_string($secret) || $secret === '' || ! is_string($signature)) {
            return false;
        }

        $expected = 'sha256='.hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function contributionCalendar(string $username): ?array
    {
        $token = config('services.github.token');

        if (! is_string($token) || $token === '') {
            return null;
        }

        $to = now()->endOfDay();
        $from = $to->copy()->subDays(self::CONTRIBUTION_RANGE_DAYS - 1)->startOfDay();

        try {
            $response = Http::acceptJson()
                ->withToken($token)
                ->withHeaders(['User-Agent' => config('app.name').' portfolio'])
                ->connectTimeout(3)
                ->timeout(5)
                ->post('https://api.github.com/graphql', [
                    'query' => <<<'GRAPHQL'
                        query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
                          user(login: $login) {
                            contributionsCollection(from: $from, to: $to) {
                              contributionCalendar {
                                totalContributions
                                weeks {
                                  contributionDays {
                                    contributionCount
                                    date
                                    weekday
                                  }
                                }
                              }
                            }
                          }
                        }
                        GRAPHQL,
                    'variables' => [
                        'login' => $username,
                        'from' => $from->toIso8601String(),
                        'to' => $to->toIso8601String(),
                    ],
                ]);

            if (! $response->successful() || ! empty($response->json('errors'))) {
                Log::info('GitHub GraphQL request failed.', [
                    'status' => $response->status(),
                    'has_errors' => ! empty($response->json('errors')),
                ]);

                return null;
            }

            $calendar = $response->json('data.user.contributionsCollection.contributionCalendar');

            return is_array($calendar) ? $calendar : null;
        } catch (\Throwable $exception) {
            Log::info('GitHub GraphQL request errored.', ['exception' => $exception->getMessage()]);

            return null;
        }
    }

    private function contributionCacheKey(string $username): string
    {
        return "github.contributions.{$username}";
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<array-key, mixed>|null
     */
    private function getJson(string $url, array $query = []): ?array
    {
        $token = config('services.github.token');

        try {
            $request = Http::acceptJson()
                ->withHeaders(['User-Agent' => config('app.name').' portfolio'])
                ->connectTimeout(3)
                ->timeout(5);

            if (is_string($token) && $token !== '') {
                $request = $request->withToken($token);
            }

            $response = $request->get($url, $query);

            if (! $response->successful()) {
                Log::info('GitHub request failed.', ['url' => $url, 'status' => $response->status()]);

                return null;
            }

            return $response->json();
        } catch (\Throwable $exception) {
            Log::info('GitHub request errored.', ['url' => $url, 'exception' => $exception->getMessage()]);

            return null;
        }
    }

    /**
     * @return array{
     *     username: string,
     *     available: bool,
     *     profile: array<string, mixed>|null,
     *     repos: list<array<string, mixed>>,
     *     languages: list<array{name: string, color: string, percentage: float}>,
     *     contributions: array{weeks: list<list<int>>, total: int, this_year: int}|null
     * }
     */
    private function emptyStats(string $username): array
    {
        return [
            'username' => $username,
            'available' => false,
            'profile' => null,
            'repos' => [],
            'languages' => [],
            'contributions' => null,
        ];
    }
}
