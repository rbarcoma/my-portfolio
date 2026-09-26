<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title inertia>{{ config('app.name') }}</title>

        <meta name="description" content="{{ config('portfolio.meta_description') }}" />
        <meta name="author" content="{{ config('portfolio.name') }}" />
        <meta name="theme-color" content="#0A0A0F" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        <x-inertia::head />
    </head>
    <body class="bg-base text-foreground antialiased">
        <x-inertia::app />
    </body>
</html>
