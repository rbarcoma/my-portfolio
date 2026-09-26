import { ScrollVelocity } from '../reactbits/ScrollVelocity';
import { Container } from '../common/Container';

const DEFAULT_ITEMS = [
    'Laravel',
    'React',
    'Inertia.js',
    'Tailwind CSS',
    'PHP',
    'MySQL',
    'Python',
    'REST APIs',
];

export function Marquee({ items = DEFAULT_ITEMS }) {
    return (
        <div className="border-y border-hairline bg-surface/40 py-5">
            <Container>
                <ScrollVelocity>
                    {items.map((item) => (
                        <span
                            key={item}
                            className="flex items-center gap-8 px-8 font-mono text-sm tracking-[0.25em] text-muted-foreground uppercase"
                        >
                            {item}
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent/70" />
                        </span>
                    ))}
                </ScrollVelocity>
            </Container>
        </div>
    );
}

export default Marquee;
