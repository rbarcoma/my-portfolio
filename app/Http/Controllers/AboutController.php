<?php

namespace App\Http\Controllers;

use App\Services\GitHubService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(GitHubService $github): Response
    {
        return Inertia::render('About', [
            'about' => config('portfolio.about'),
            'timeline' => config('portfolio.timeline'),
            'cv' => config('portfolio.cv'),
            'github' => $github->stats(),
        ]);
    }
}
