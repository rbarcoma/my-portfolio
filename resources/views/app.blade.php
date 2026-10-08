<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title inertia>{{ config('portfolio.name') }} | {{ config('portfolio.role') }}</title>

        <meta name="description" content="{{ config('portfolio.meta_description') }}" />
        <meta name="author" content="{{ config('portfolio.name') }}" />
        <meta name="theme-color" content="#FAFAF8" />

        <script>
            (() => {
                let theme;

                try {
                    theme = localStorage.getItem('portfolio-theme');
                } catch {
                    // Fall back to the system preference when storage is unavailable.
                }

                const isDark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.toggle('dark', isDark);
                document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#121212' : '#FAFAF8');
            })();
        </script>

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        <x-inertia::head />
    </head>
    <body class="bg-base text-foreground antialiased">
        <x-inertia::app />
    </body>
</html>
