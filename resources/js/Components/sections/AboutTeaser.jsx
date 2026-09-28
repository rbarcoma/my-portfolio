import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

export function AboutTeaser({ about, id = 'about' }) {
    return (
        <section id={id} className="scroll-mt-24 section-pad">
            <Container>
                <div className="grid gap-14 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <div className="relative aspect-4/5 overflow-hidden rounded-card border border-hairline bg-elevated">
                                <img
                                    src={about.photo}
                                    alt="Portrait of Renante Barcoma"
                                    loading="lazy"
                                    decoding="async"
                                    width={800}
                                    height={1000}
                                    className="h-full w-full object-cover"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent"
                                />
                                <p className="absolute bottom-5 left-5 font-mono text-[0.65rem] tracking-[0.25em] text-accent uppercase">
                                    {about.quick_facts.find((fact) => fact.label === 'Location')?.value}
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-7">
                        <SectionHeading label="About" title={about.headline} lead={about.lead} />

                        <RevealGroup className="mt-8 flex flex-col gap-5">
                            {about.bio.map((paragraph) => (
                                <RevealItem key={paragraph.slice(0, 32)}>
                                    <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
                                </RevealItem>
                            ))}
                        </RevealGroup>

                        <Reveal delay={0.1}>
                            <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-hairline pt-8 sm:grid-cols-2">
                                {about.quick_facts.map((fact) => (
                                    <div key={fact.label} className="flex flex-col gap-1">
                                        <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                                            {fact.label}
                                        </dt>
                                        <dd className="text-sm text-foreground">{fact.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default AboutTeaser;
