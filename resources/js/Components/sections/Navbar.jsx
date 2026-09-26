import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { useRoute } from '../../lib/route';
import { cn } from '../../lib/utils';
import { Sheet, SheetClose, SheetTitle } from '../ui/sheet';

const LINKS = [
    { label: 'Home', route: 'home' },
    { label: 'About', route: 'about' },
    { label: 'Skills', route: 'skills' },
    { label: 'Projects', route: 'projects.index' },
    { label: 'Experience', route: 'experience' },
    { label: 'Contact', route: 'contact' },
];

function isCurrent(url, pathname) {
    if (url === '/') {
        return pathname === '/';
    }

    return pathname === url || pathname.startsWith(`${url}/`);
}

export function Navbar() {
    const route = useRoute();
    const { url, props } = usePage();
    const pathname = url.split('?')[0];
    const { direction, offset } = useScrollDirection();
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(false);

    const condensed = offset > 40;
    const hidden = direction === 'down' && offset > 160 && !open;

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
                    <Link
                        href={route('home')}
                        className="group flex items-baseline gap-2 font-display text-sm tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                        <span className="text-lg font-bold">RB</span>
                        <span className="hidden font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase sm:inline">
                            {props.portfolio?.name ?? 'Portfolio'}
                        </span>
                    </Link>

                    {isDesktop && (
                        <ul className="flex items-center gap-1">
                            {LINKS.map((link) => {
                                const href = route(link.route);
                                const current = isCurrent(pathname, href);

                                return (
                                    <li key={link.route}>
                                        <Link
                                            href={href}
                                            aria-current={current ? 'page' : undefined}
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
                                                    className="absolute inset-0 -z-10 rounded-full border border-hairline bg-white/5"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="flex items-center gap-3">
                        <a
                            href={route('contact')}
                            data-cursor="hover"
                            className={cn(
                                'hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-base transition-shadow duration-300 hover:shadow-[0_0_28px_-8px_rgba(198,255,62,0.8)] sm:inline-flex lg:hidden xl:inline-flex',
                            )}
                        >
                            Hire me
                        </a>

                        {!isDesktop && (
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                aria-label="Open menu"
                                aria-expanded={open}
                                className="inline-flex size-10 items-center justify-center rounded-full border border-hairline text-foreground transition-colors hover:bg-white/5"
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
                                        key={link.route}
                                        initial={{ opacity: 0, x: 24 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.06 * index, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <SheetClose asChild>
                                            <Link
                                                href={route(link.route)}
                                                className="flex items-baseline gap-4 border-b border-hairline py-4 font-display text-2xl transition-colors hover:text-accent"
                                            >
                                                <span className="font-mono text-xs text-subtle">
                                                    0{index + 1}
                                                </span>
                                                {link.label}
                                            </Link>
                                        </SheetClose>
                                    </motion.li>
                                ))}
                            </ul>

                            <a
                                href={route('contact')}
                                className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-base"
                            >
                                Hire me
                            </a>
                        </div>
                    </Sheet>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

export default Navbar;
