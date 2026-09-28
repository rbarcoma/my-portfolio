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
            'groups' => config('portfolio.skill_groups'),
            'projects' => config('projects.projects'),
            'timeline' => config('portfolio.timeline'),
            'contact' => config('portfolio.contact'),
            'statuses' => config('projects.statuses'),
            'github' => $github->stats(),
        ]);
    }
}
