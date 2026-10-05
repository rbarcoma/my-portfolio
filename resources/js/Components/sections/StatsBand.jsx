import { CountUp } from '../reactbits/CountUp';
import { Container } from '../common/Container';
import { RevealGroup, RevealItem } from '../common/Reveal';

/**
 * A quiet summary of the experience, with live GitHub figures when available.
 */
export function StatsBand({ stats, github }) {
    const resolved = (stat) => {
        if (stat.source === 'github') {
            return {
                value: github?.contributions?.total ?? null,
                label: 'GitHub contributions',
            };
        }

        return { value: stat.value, label: stat.label };
    };

    return (
        <section className="border-y border-hairline bg-surface">
            <Container>
                <RevealGroup className="grid divide-y divide-hairline sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const { value, label } = resolved(stat);

                        return (
                            <RevealItem key={stat.label} className="flex flex-col gap-2 py-7 sm:px-7 sm:first:pl-0 lg:py-9">
                                <span className="font-display text-[clamp(2.25rem,4vw,3.4rem)] leading-none font-semibold tabular-nums">
                                    <CountUp value={value} suffix={stat.suffix ?? ''} />
                                </span>
                                <span className="text-sm text-muted-foreground">{label}</span>
                            </RevealItem>
                        );
                    })}
                </RevealGroup>
            </Container>
        </section>
    );
}

export default StatsBand;
