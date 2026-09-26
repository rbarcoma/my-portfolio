<?php

namespace App\Http\Controllers;

use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;

class GithubController extends Controller
{
    public function stats(GitHubService $github): JsonResponse
    {
        return response()->json($github->stats());
    }
}
