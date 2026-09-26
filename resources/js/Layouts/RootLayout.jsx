import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TooltipProvider } from '../Components/ui/tooltip';
import { Navbar } from '../Components/sections/Navbar';
import { Footer } from '../Components/sections/Footer';
import { CustomCursor } from '../Components/sections/CustomCursor';
import { ScrollProgress } from '../Components/sections/ScrollProgress';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Persistent application shell: navbar, footer, cursor, scroll progress.
 * Inertia keeps this mounted across navigations, so only <main> swaps.
 */
export function RootLayout({ children }) {
    const { url, component, props } = usePage();
    const reduced = useReducedMotion();

    useEffect(() => {
        document.title = `${props.appName ?? 'Portfolio'} — ${props.portfolio?.role ?? ''}`.trim();
    }, [props.appName, props.portfolio?.role]);

    return (
        <TooltipProvider>
            <div className="relative flex min-h-dvh flex-col">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-base"
                >
                    Skip to content
                </a>

                <ScrollProgress />
                <Navbar />
                <CustomCursor />

                <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={component ?? url}
                            initial={reduced ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduced ? undefined : { opacity: 0, y: -8 }}
                            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <Footer socials={props.socials ?? []} portfolio={props.portfolio ?? {}} />
            </div>
        </TooltipProvider>
    );
}

export default RootLayout;
