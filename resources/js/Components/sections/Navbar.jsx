import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Menu, Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { useRoute } from '../../lib/route';
import { cn } from '../../lib/utils';
import { CvButton } from '../common/CvButton';
import { Sheet, SheetClose, SheetTitle } from '../ui/sheet';

const LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

function ThemeToggle({ isDark, onToggle }) {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={label}
            aria-pressed={isDark}
            title={label}
            className="inline-flex size-9 items-center justify-center rounded-full border border-hairline text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
        </button>
    );
}

export function Navbar() {
    const route = useRoute();
    const { url, props } = usePage();
    const pathname = url.split(/[?#]/)[0];
    const { direction, offset } = useScrollDirection();
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [activeSection, setActiveSection] = useState('home');

    const sectionHref = (id) => route('home') + '#' + id;
    const condensed = offset > 40;
    const hidden = direction === 'down' && offset > 160 && !open;

    useEffect(() => {
        const storedTheme = window.localStorage.getItem('portfolio-theme');
        const nextTheme = storedTheme !== 'light';

        applyTheme(nextTheme);
        setIsDark(nextTheme);
    }, []);

    useEffect(() => {
        const close = () => setOpen(false);

        window.addEventListener('resize', close);

        return () => window.removeEventListener('resize', close);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    useEffect(() => {
        if (pathname !== '/') {
            setActiveSection(null);

            return undefined;
        }

        const syncHash = () => {
            const sectionId = window.location.hash.replace('#', '');

            if (LINKS.some((link) => link.id === sectionId)) {
                setActiveSection(sectionId);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSection = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (first, second) =>
                            Math.abs(first.boundingClientRect.top) - Math.abs(second.boundingClientRect.top),
                    )[0];

                if (visibleSection) {
                    setActiveSection(visibleSection.target.id);
                }
            },
            { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
        );

        LINKS.forEach((link) => {
            const section = document.getElementById(link.id);

            if (section) {
                observer.observe(section);
            }
        });

        syncHash();
        window.addEventListener('hashchange', syncHash);

        return () => {
            observer.disconnect();
            window.removeEventListener('hashchange', syncHash);
        };
    }, [pathname]);

    const toggleTheme = () => {
        setIsDark((currentTheme) => {
            const nextTheme = !currentTheme;

            applyTheme(nextTheme);
            window.localStorage.setItem('portfolio-theme', nextTheme ? 'dark' : 'light');

            return nextTheme;
        });
    };

    return (
        <motion.header
            initial={false}
            animate={{ y: hidden ? '-110%' : '0%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-40"
        >
            <div
                className={cn(
                    'transition-all duration-300 ease-[var(--ease-out-expo)]',
                    condensed && 'border-b border-hairline bg-base/80 backdrop-blur-xl',
                )}
            >
                <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-6 sm:h-18">
                    <a
                        href={sectionHref('home')}
                        className="group flex items-baseline gap-2 font-display text-sm tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <span className="text-lg font-bold">RB</span>
                        <span className="hidden font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase sm:inline">
                            {props.portfolio?.name ?? 'Portfolio'}
                        </span>
                    </a>

                    {isDesktop && (
                        <ul className="flex items-center gap-1">
                            {LINKS.map((link) => {
                                const current = pathname === '/' && activeSection === link.id;

                                return (
                                    <li key={link.id}>
                                        <a
                                            href={sectionHref(link.id)}
                                            aria-current={current ? 'location' : undefined}
                                            data-cursor="hover"
                                            className={cn(
                                                'relative block rounded-full px-4 py-2 text-sm transition-colors duration-200',
                                                current
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {current && (
                                                <motion.span
                                                    layoutId="nav-active"
                                                    className="absolute inset-0 -z-10 rounded-full border border-hairline bg-surface"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                            {link.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="flex shrink-0 items-center gap-2">
                        <div className="hidden sm:block">
                            <CvButton cv={props.cv} size="sm" label="Download CV" />
                        </div>

                        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

                        {!isDesktop && (
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                aria-label="Open menu"
                                aria-expanded={open}
                                className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-foreground transition-colors hover:bg-surface-2"
                            >
                                <Menu className="size-5" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </nav>
            </div>

            <AnimatePresence>
                {open && (
                    <Sheet open={open} onOpenChange={setOpen} side="right" label="Site navigation">
                        <div className="flex h-full flex-col justify-between p-8">
                            <SheetTitle className="sr-only">Site navigation</SheetTitle>

                            <ul className="mt-20 flex flex-col gap-1">
                                {LINKS.map((link, index) => (
                                    <motion.li
                                        key={link.id}
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.06 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <SheetClose asChild>
                                            <a
                                                href={sectionHref(link.id)}
                                                className="block border-b border-hairline py-4 font-display text-2xl transition-colors hover:text-accent"
                                            >
                                                {link.label}
                                            </a>
                                        </SheetClose>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="flex items-center gap-3">
                                <CvButton
                                    cv={props.cv}
                                    size="md"
                                    label="Download CV"
                                    className="flex-1 justify-center"
                                />
                                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                            </div>
                        </div>
                    </Sheet>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

export default Navbar;
