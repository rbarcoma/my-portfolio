import { usePage } from '@inertiajs/react';
import { TooltipProvider } from '../Components/ui/tooltip';
import { Navbar } from '../Components/sections/Navbar';
import { Footer } from '../Components/sections/Footer';

/**
 * Persistent application shell: a quiet navigation frame and footer.
 * Inertia keeps this mounted across navigations, so only <main> swaps.
 */
export function RootLayout({ children }) {
    const { props } = usePage();

    return (
        <TooltipProvider>
            <div className="relative flex min-h-dvh flex-col bg-white text-zinc-950">
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-zinc-950"
                >
                    Skip to content
                </a>

                <Navbar />

                <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
                    {children}
                </main>

                <Footer socials={props.socials ?? []} portfolio={props.portfolio ?? {}} />
            </div>
        </TooltipProvider>
    );
}

export default RootLayout;
