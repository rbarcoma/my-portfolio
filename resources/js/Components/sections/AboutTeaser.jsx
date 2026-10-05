import { MapPin } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

export function AboutTeaser({ about, id = 'about' }) {
    const location = about.quick_facts.find((fact) => fact.label === 'Location')?.value;

    return (
        <section id={id} className="scroll-mt-24 section-pad">
            <Container>
                <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <div className="overflow-hidden rounded-card border border-hairline bg-surface p-2">
                                <div className="relative aspect-4/5 overflow-hidden rounded-[0.7rem] bg-surface-2">
                                    <img
                                        src={about.photo}
                                        alt="Portrait of Renante Barcoma"
                                        loading="lazy"
                                        decoding="async"
                                        width={800}
                                        height={1000}
                                        className="h-full w-full object-cover grayscale-[15%]"
                                    />
                                    {location && (
                                        <p className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-surface/92 px-3 py-2 text-xs text-muted-foreground shadow-sm">
                                            <MapPin className="size-3.5" aria-hidden="true" />
                                            {location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <div className="lg:col-span-7">
                        <SectionHeading label="About" title={about.headline} lead={about.lead} />

                        <RevealGroup className="mt-8 flex flex-col gap-5">
                            {about.bio.map((paragraph) => (
                                <RevealItem key={paragraph.slice(0, 32)}>
                                    <p className="max-w-2xl leading-relaxed text-muted-foreground">{paragraph}</p>
                                </RevealItem>
                            ))}
                        </RevealGroup>

                        <Reveal delay={0.1}>
                            <dl className="mt-10 grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-2">
                                {about.quick_facts.map((fact) => (
                                    <div key={fact.label} className="bg-surface px-5 py-4 sm:px-6">
                                        <dt className="text-xs font-medium tracking-[0.12em] text-subtle uppercase">
                                            {fact.label}
                                        </dt>
                                        <dd className="mt-2 text-sm text-foreground">{fact.value}</dd>
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
