import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';

export function Timeline({ items, id, label = 'Experience' }) {
    return (
        <section id={id} className="scroll-mt-24 section-pad-compact">
            <Container>
                <SectionHeading
                    label={label}
                    title="Education and hands-on work."
                    lead="Where the fundamentals came from, and what I have been building with them."
                />

                <ol className="mt-12 overflow-hidden rounded-card border border-hairline bg-surface">
                    {items.map((item, index) => (
                        <li
                            key={item.period + item.title}
                            className={index > 0 ? 'border-t border-hairline' : undefined}
                        >
                            <Reveal>
                                <article className="grid gap-5 p-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 sm:p-8">
                                    <p className="text-sm font-medium text-muted-foreground">{item.period}</p>
                                    <div>
                                        <h3 className="text-xl font-semibold sm:text-2xl">{item.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {item.org}
                                            {item.location ? ' · ' + item.location : ''}
                                        </p>
                                        <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{item.description}</p>
                                        {item.points?.length > 0 && (
                                            <ul className="mt-5 grid gap-2.5">
                                                {item.points.map((point) => (
                                                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                                                        <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </article>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

export default Timeline;
