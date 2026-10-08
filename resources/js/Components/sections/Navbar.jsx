import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { cn } from '../../lib/utils';
import { CvButton } from '../common/CvButton';
import { ThemeToggle } from '../common/ThemeToggle';

const LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

export function Navbar() {
    const route = useRoute();
    const { url, props } = usePage();
    const pathname = url.split(/[?#]/)[0];
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const sectionHref = (id) => route('home') + '#' + id;

    useEffect(() => {
        const close = () => setOpen(false);

        window.addEventListener('resize', close);

        return () => window.removeEventListener('resize', close);
    }, []);

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

    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-surface/85 backdrop-blur-md">
                <nav aria-label="Primary" className="container-page flex h-16 items-center gap-6">
                    <a
                        href={sectionHref('home')}
                        aria-label="Renante Barcoma home"
                        className="font-display text-base font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                        RB
                    </a>

                    <div className="ml-auto flex items-center gap-3">
                        <ul className="hidden items-center gap-1 lg:flex">
                            {LINKS.map((link) => {
                                const current = pathname === '/' && activeSection === link.id;

                                return (
                                    <li key={link.id}>
                                        <a
                                            href={sectionHref(link.id)}
                                            aria-current={current ? 'location' : undefined}
                                            className={cn(
                                                'relative block px-2.5 py-2 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground',
                                                current ? 'font-medium text-foreground' : 'text-subtle hover:text-foreground',
                                            )}
                                        >
                                            {link.label}
                                            {current && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute right-2.5 bottom-0 left-2.5 border-b border-foreground"
                                                />
                                            )}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="hidden sm:block">
                            <CvButton
                                cv={props.cv}
                                size="sm"
                                label="Download CV"
                                className="shadow-none hover:shadow-none"
                            />
                        </div>

                        <ThemeToggle />

                        <DialogPrimitive.Trigger asChild>
                            <button
                                type="button"
                                aria-label="Open menu"
                                className="inline-flex size-9 items-center justify-center rounded-md border border-hairline-strong text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground lg:hidden"
                            >
                                <Menu className="size-4" aria-hidden="true" />
                            </button>
                        </DialogPrimitive.Trigger>
                    </div>
                </nav>
            </header>

            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-hairline bg-surface p-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right sm:p-8">
                    <DialogPrimitive.Title className="font-display text-lg font-semibold text-foreground">
                        Navigation
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Choose a section of the site or download the CV.
                    </DialogPrimitive.Description>
                    <DialogPrimitive.Close
                        className="absolute top-5 right-5 inline-flex size-9 items-center justify-center rounded-md text-subtle transition-colors duration-200 hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
                        aria-label="Close menu"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </DialogPrimitive.Close>

                    <ul className="mt-12 flex flex-col border-t border-hairline">
                        {LINKS.map((link) => {
                            const current = pathname === '/' && activeSection === link.id;

                            return (
                                <li key={link.id} className="border-b border-hairline">
                                    <DialogPrimitive.Close asChild>
                                        <a
                                            href={sectionHref(link.id)}
                                            aria-current={current ? 'location' : undefined}
                                            className={cn(
                                                'block py-4 font-display text-xl tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
                                                current ? 'font-semibold text-foreground' : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {link.label}
                                        </a>
                                    </DialogPrimitive.Close>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-auto border-t border-hairline pt-6">
                        <CvButton
                            cv={props.cv}
                            size="md"
                            label="Download CV"
                            className="w-full justify-center shadow-none hover:shadow-none"
                        />
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export default Navbar;
