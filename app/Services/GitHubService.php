<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GitHubService
{
    /**
     * Contribution heatmaps are expensive to build server-side, so the cache
     * window is intentionally longer than the profile/repo windows.
     */
    private const PROFILE_TTL = 21600;

    private const REPOS_TTL = 21600;

    private const CONTRIBUTIONS_TTL = 43200;

    /**
     * @return array{
     *     username: string,
     *     available: bool,
     *     profile: array<string, mixed>|null,
     *     repos: list<array<string, mixed>>,
     *     languages: list<array{name: string, color: string, percentage: float}>,
     *     contributions: array{weeks: list<array<int, int>>, total: int, this_year: int}|null
     * }
     */
    public function stats(): array
    {
        $username = (string) config('portfolio.github_username');

        if ($username === '') {
            return $this->emptyStats('');
        }

        $profile = $this->profile($username);

        return [
            'username' => $username,
            'available' => $profile !== null,
            'profile' => $profile,
            'repos' => $this->repos($username),
            'languages' => $this->languages($username),
            'contributions' => $this->contributions($username),
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
        return Cache::remember("github.languages.{$username}", self::PROFILE_TTL, function () use ($username): array {
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
                'Blade' => '#0A0A0F',
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
     * Contribution weeks come from a community endpoint; failures are expected
     * and simply produce the static fallback in the UI.
     *
     * @return array{weeks: list<array<int, int>>, total: int, this_year: int}|null
     */
    public function contributions(string $username): ?array
    {
        return Cache::remember("github.contributions.{$username}", self::CONTRIBUTIONS_TTL, function () use ($username): ?array {
            $weeks = $this->getJson("https://github-contributions-api.jogruber.de/v4/{$username}");

            if (! is_array($weeks)) {
                return null;
            }

            $year = (int) now()->format('Y');
            $total = 0;
            $thisYear = 0;

            $normalized = [];

            foreach ($weeks as $week) {
                if (! is_array($week) || ! isset($week['days'])) {
                    continue;
                }

                $counts = [];

                foreach ($week['days'] as $day) {
                    $count = (int) ($day['count'] ?? 0);
                    $counts[] = $count;
                    $total += $count;

                    if ((int) substr((string) ($day['date'] ?? ''), 0, 4) === $year) {
                        $thisYear += $count;
                    }
                }

                $normalized[] = $counts;
            }

            return [
                'weeks' => $normalized,
                'total' => $total,
                'this_year' => $thisYear,
            ];
        });
    }

    /**
     * @param  array<string, mixed>  $query
     * @return array<array-key, mixed>|null
     */
    private function getJson(string $url, array $query = []): ?array
    {
        try {
            $response = Http::acceptJson()
                ->withHeaders(['User-Agent' => config('app.name').' portfolio'])
                ->timeout(5)
                ->get($url, $query);

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
     *     contributions: array{weeks: list<array<int, int>>, total: int, this_year: int}|null
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
