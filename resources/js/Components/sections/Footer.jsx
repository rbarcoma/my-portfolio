import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { ArrowUp, Mail, MapPin } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Container } from '../common/Container';
import { BRAND_ICONS } from '../common/BrandIcons';

const LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

const ICONS = {
    ...BRAND_ICONS,
    mail: Mail,
};

export function Footer({ socials = [], portfolio = {} }) {
    const route = useRoute();
    const { url } = usePage();
    const year = new Date().getFullYear();
    const previousUrl = useRef(url);

    // Move focus to <main> on client-side navigations so screen readers and
    // keyboard users start at the new content. Skipped on first paint.
    useEffect(() => {
        if (previousUrl.current === url) {
            return;
        }

        previousUrl.current = url;
        document.getElementById('main-content')?.focus({ preventScroll: true });
    }, [url]);

    return (
        <footer className="border-t border-hairline bg-surface">
            <Container className="py-12 sm:py-14">
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <p className="font-display text-xl font-semibold tracking-tight text-foreground">{portfolio.name}</p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {portfolio.availability}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-subtle">
                            {portfolio.location && (
                                <span className="flex items-center gap-2">
                                    <MapPin className="size-3.5" aria-hidden="true" />
                                    {portfolio.location}
                                </span>
                            )}
                            {portfolio.timezone && <span>{portfolio.timezone}</span>}
                        </div>
                    </div>

                    <nav aria-label="Footer" className="lg:col-span-4">
                        <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Sitemap</p>
                        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                            {LINKS.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={route('home') + '#' + link.id}
                                        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-3">
                        <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">Elsewhere</p>
                        <ul className="mt-4 flex flex-col gap-3">
                            {socials.map((social) => {
                                const Icon = ICONS[social.icon] ?? Mail;
                                const external = social.url.startsWith('http');

                                return (
                                    <li key={social.url}>
                                        <a
                                            href={social.url}
                                            target={external ? '_blank' : undefined}
                                            rel={external ? 'noopener noreferrer' : undefined}
                                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
                                        >
                                            <Icon className="size-4" aria-hidden="true" />
                                            {social.label}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-subtle">
                        © {year} {portfolio.name} — built with Laravel, Inertia & React
                    </p>

                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                        className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground"
                    >
                        Top
                        <ArrowUp className="size-3.5" aria-hidden="true" />
                    </button>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
