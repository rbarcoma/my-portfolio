import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { SpotlightCard } from '../reactbits/SpotlightCard';

export function AboutTeaser({ about, cv }) {
    const route = useRoute();

    return (
        <section className="section-pad">
            <Container>
                <div className="grid gap-14 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <div className="relative aspect-4/5 overflow-hidden rounded-card border border-hairline bg-elevated">
                                <img
                                    src={about.photo}
                                    alt={`${about.headline} — portrait`}
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
                        <SectionHeading index={2} label="About" title={about.headline} lead={about.lead} />

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {about.values.map((value) => (
                                <SpotlightCard key={value.title} className="p-6">
                                    <h3 className="font-display text-base text-foreground">{value.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {value.description}
                                    </p>
                                </SpotlightCard>
                            ))}
                        </div>

                        <Reveal delay={0.1}>
                            <div className="mt-10 flex flex-wrap items-center gap-4">
                                <Link
                                    href={route('about')}
                                    data-cursor="hover"
                                    className="group inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
                                >
                                    More about me
                                    <ArrowRight
                                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <a
                                    href="/cv"
                                    download={cv?.filename}
                                    data-cursor="hover"
                                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-accent hover:underline"
                                >
                                    {cv?.label ?? 'Download CV'}
                                </a>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default AboutTeaser;
