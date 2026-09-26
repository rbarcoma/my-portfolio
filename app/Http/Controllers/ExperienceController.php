<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ExperienceController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Experience', [
            'timeline' => config('portfolio.timeline'),
        ]);
    }
}
