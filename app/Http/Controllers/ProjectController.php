<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Projects/Index', [
            'projects' => config('projects.projects'),
            'statuses' => config('projects.statuses'),
        ]);
    }

    public function show(string $slug): Response|RedirectResponse
    {
        $projects = collect(config('projects.projects'));
        $project = $projects->firstWhere('slug', $slug);

        if ($project === null) {
            return to_route('home')->withFragment('projects');
        }

        $index = $projects->keys()->search(fn (int $key): bool => $projects->get($key)['slug'] === $slug);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'statuses' => config('projects.statuses'),
            'navigation' => [
                'previous' => $index > 0 ? $this->summarize($projects->get($index - 1)) : null,
                'next' => $index < $projects->count() - 1 ? $this->summarize($projects->get($index + 1)) : null,
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>  $project
     * @return array{slug: string, title: string, tagline: string}
     */
    private function summarize(array $project): array
    {
        return [
            'slug' => $project['slug'],
            'title' => $project['title'],
            'tagline' => $project['tagline'],
        ];
    }
}
