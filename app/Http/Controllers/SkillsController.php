<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class SkillsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Skills', [
            'groups' => config('portfolio.skill_groups'),
        ]);
    }
}
