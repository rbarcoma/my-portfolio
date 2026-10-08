import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() =>
        typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
    );

    const toggleTheme = () => {
        const nextIsDark = !isDark;

        document.documentElement.classList.toggle('dark', nextIsDark);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextIsDark ? '#121212' : '#FAFAF8');
        setIsDark(nextIsDark);

        try {
            window.localStorage.setItem('portfolio-theme', nextIsDark ? 'dark' : 'light');
        } catch {
            // The toggle still works when browser storage is unavailable.
        }
    };

    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    const Icon = isDark ? Sun : Moon;

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 [&_svg]:size-4"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
        >
            <Icon aria-hidden="true" />
        </Button>
    );
}
