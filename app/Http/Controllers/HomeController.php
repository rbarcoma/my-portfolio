<?php

namespace App\Http\Controllers;

use App\Services\GitHubService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(GitHubService $github): Response
    {
        return Inertia::render('Home', [
            'hero' => config('portfolio.hero'),
            'stats' => config('portfolio.stats'),
            'about' => config('portfolio.about'),
            'contact' => config('portfolio.contact'),
            'cv' => config('portfolio.cv'),
            'featuredProjects' => array_values(array_filter(
                config('projects.projects'),
                fn (array $project): bool => $project['featured'],
            )),
            'statuses' => config('projects.statuses'),
            'github' => $github->stats(),
        ]);
    }
}
