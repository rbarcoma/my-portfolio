import {
    SiInertia,
    SiLaravel,
    SiMysql,
    SiPhp,
    SiPython,
    SiReact,
    SiTailwindcss,
} from 'react-icons/si';
import { Container } from '../common/Container';
import LogoLoop from '../reactbits/LogoLoop';

const TECHNOLOGY_LOGOS = {
    Laravel: {
        node: <SiLaravel />,
        title: 'Laravel',
        href: 'https://laravel.com',
    },
    React: {
        node: <SiReact />,
        title: 'React',
        href: 'https://react.dev',
    },
    'Inertia.js': {
        node: <SiInertia />,
        title: 'Inertia.js',
        href: 'https://inertiajs.com',
    },
    'Tailwind CSS': {
        node: <SiTailwindcss />,
        title: 'Tailwind CSS',
        href: 'https://tailwindcss.com',
    },
    PHP: {
        node: <SiPhp />,
        title: 'PHP',
        href: 'https://www.php.net',
    },
    MySQL: {
        node: <SiMysql />,
        title: 'MySQL',
        href: 'https://www.mysql.com',
    },
    Python: {
        node: <SiPython />,
        title: 'Python',
        href: 'https://www.python.org',
    },
};

export function Marquee({ items = [] }) {
    const logos = (items.length > 0 ? items.map((item) => TECHNOLOGY_LOGOS[item]) : Object.values(TECHNOLOGY_LOGOS)).filter(
        Boolean,
    );

    if (logos.length === 0) {
        return null;
    }

    return (
        <section aria-label="Technology logos" className="border-y border-hairline bg-surface">
            <Container className="overflow-hidden py-5 text-foreground sm:py-6">
                <LogoLoop
                    logos={logos}
                    speed={60}
                    direction="left"
                    logoHeight={35}
                    gap={40}
                    hoverSpeed={50}
                    scaleOnHover
                    fadeOut
                    fadeOutColor="var(--color-surface)"
                    ariaLabel="Technologies I work with"
                />
            </Container>
        </section>
    );
}

export default Marquee;
