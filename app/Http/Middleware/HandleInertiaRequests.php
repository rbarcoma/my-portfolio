<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'appName' => config('app.name'),

            'portfolio' => [
                'name' => config('portfolio.name'),
                'role' => config('portfolio.role'),
                'location' => config('portfolio.location'),
                'timezone' => config('portfolio.timezone'),
                'email' => config('portfolio.email'),
                'availability' => config('portfolio.availability'),
            ],

            'socials' => config('portfolio.socials'),

            'cv' => config('portfolio.cv'),

            'ziggy' => fn (): array => [
                'location' => $request->url(),
                'config' => (new Ziggy)->toArray(),
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
        ];
    }
}
