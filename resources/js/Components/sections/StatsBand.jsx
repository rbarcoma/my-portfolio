import { CountUp } from '../reactbits/CountUp';
import { Container } from '../common/Container';
import { RevealGroup, RevealItem } from '../common/Reveal';

/**
 * Stats band. A stat with `source: 'github'` uses the live commit count.
 */
export function StatsBand({ stats, github }) {
    const resolved = (stat) => {
        if (stat.source === 'github') {
            return {
                value: github?.contributions?.total ?? null,
                label: 'Contributions on GitHub',
            };
        }

        return { value: stat.value, label: stat.label };
    };

    return (
        <section className="border-y border-hairline bg-surface/30">
            <Container className="py-14">
                <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const { value, label } = resolved(stat);

                        return (
                            <RevealItem key={stat.label} className="flex flex-col gap-2">
                                <span className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-bold text-accent tabular-nums">
                                    <CountUp value={value} suffix={stat.suffix ?? ''} />
                                </span>
                                <span className="font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                                    {label}
                                </span>
                            </RevealItem>
                        );
                    })}
                </RevealGroup>
            </Container>
        </section>
    );
}

export default StatsBand;
