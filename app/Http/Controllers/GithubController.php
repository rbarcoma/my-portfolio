<?php

namespace App\Http\Controllers;

use App\Services\GitHubService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GithubController extends Controller
{
    public function stats(GitHubService $github): JsonResponse
    {
        return response()->json($github->stats())
            ->header('Cache-Control', 'no-store, max-age=0');
    }

    public function webhook(Request $request, GitHubService $github): Response
    {
        $signature = $request->header('X-Hub-Signature-256');

        if (! $github->hasValidWebhookSignature(
            $request->getContent(),
            is_string($signature) ? $signature : null,
        )) {
            return response()->json(['message' => 'Invalid GitHub webhook signature.'], Response::HTTP_FORBIDDEN);
        }

        if ($request->header('X-GitHub-Event') === 'push') {
            $username = (string) config('portfolio.github_username');

            if ($username !== '') {
                $github->forgetContributions($username);
            }
        }

        return response()->noContent();
    }
}
