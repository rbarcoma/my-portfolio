import { useEffect, useRef, useState } from 'react';
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

/**
 * Local clock for the configured timezone — a small "alive" detail.
 */
function LocalTime({ timezone }) {
    const [time, setTime] = useState(null);

    useEffect(() => {
        if (!timezone) {
            return undefined;
        }

        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const tick = () => setTime(formatter.format(new Date()));

        tick();
        const timer = window.setInterval(tick, 1000);

        return () => window.clearInterval(timer);
    }, [timezone]);

    if (!time) {
        return null;
    }

    return (
        <span className="font-mono text-xs tracking-wider text-muted-foreground tabular-nums">
            {timezone} · {time}
        </span>
    );
}

export function Footer({ socials = [], portfolio = {} }) {
    const route = useRoute();
    const { url } = usePage();
    const year = new Date().getFullYear();
    const [showTop, setShowTop] = useState(false);
    const previousUrl = useRef(url);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > window.innerHeight);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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
        <footer className="relative mt-0 overflow-hidden border-t border-hairline">
            <p
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 font-display text-[clamp(4rem,18vw,14rem)] leading-none font-bold whitespace-nowrap text-foreground/3 select-none"
            >
                {portfolio.name ?? 'Renante Barcoma'}
            </p>

            <Container className="relative py-12 sm:py-14">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <p className="font-display text-2xl">{portfolio.name}</p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {portfolio.availability}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            {portfolio.location && (
                                <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground">
                                    <MapPin className="size-3.5" aria-hidden="true" />
                                    {portfolio.location}
                                </span>
                            )}
                            <LocalTime timezone={portfolio.timezone} />
                        </div>
                    </div>

                    <nav aria-label="Footer" className="lg:col-span-4">
                        <p className="font-mono text-xs tracking-[0.25em] text-subtle uppercase">Sitemap</p>
                        <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                            {LINKS.map((link) => (
                                <li key={link.id}>
                                    <a
                                        href={route('home') + '#' + link.id}
                                        className="text-sm text-muted-foreground transition-colors hover:text-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-3">
                        <p className="font-mono text-xs tracking-[0.25em] text-subtle uppercase">Elsewhere</p>
                        <ul className="mt-5 flex flex-col gap-3">
                            {socials.map((social) => {
                                const Icon = ICONS[social.icon] ?? Mail;

                                return (
                                    <li key={social.url}>
                                        <a
                                            href={social.url}
                                            target={social.url.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            data-cursor="hover"
                                            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
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
                    <p className="font-mono text-xs tracking-wider text-subtle">
                        © {year} {portfolio.name} — built with Laravel, Inertia & React
                    </p>

                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                        className={`inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-300 hover:border-accent/50 hover:text-accent ${
                            showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                        }`}
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
