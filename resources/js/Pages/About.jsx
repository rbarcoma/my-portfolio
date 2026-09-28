import { Head } from '@inertiajs/react';
import { PageHeader } from '../Components/common/PageHeader';
import { Container } from '../Components/common/Container';
import { Reveal, RevealGroup, RevealItem } from '../Components/common/Reveal';
import { CvButton } from '../Components/common/CvButton';
import { Timeline } from '../Components/sections/Timeline';
import { CtaBand } from '../Components/sections/CtaBand';

export default function About({ about, timeline, cv }) {
    return (
        <>
            <Head title="About" />

            <PageHeader
                eyebrow="About"
                title={about.headline}
                lead={about.lead}
            />

            <section className="pb-8">
                <Container>
                    <div className="grid gap-14 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <Reveal>
                                <div className="relative aspect-4/5 overflow-hidden rounded-card border border-hairline bg-elevated">
                                    <img
                                        src={about.photo}
                                        alt="Portrait"
                                        loading="lazy"
                                        decoding="async"
                                        width={800}
                                        height={1000}
                                        className="h-full w-full object-cover"
                                    />
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent"
                                    />
                                </div>

                                <div className="mt-6">
                                    <CvButton cv={cv} />
                                </div>
                            </Reveal>
                        </div>

                        <div className="lg:col-span-7">
                            <RevealGroup className="flex flex-col gap-6">
                                {about.bio.map((paragraph) => (
                                    <RevealItem key={paragraph.slice(0, 32)}>
                                        <p className="text-lg leading-relaxed text-muted-foreground">
                                            {paragraph}
                                        </p>
                                    </RevealItem>
                                ))}
                            </RevealGroup>

                            <Reveal delay={0.1} className="mt-12">
                                <dl className="grid gap-x-8 gap-y-5 border-t border-hairline pt-8 sm:grid-cols-2">
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

            <Timeline items={timeline} label="Journey" />

            <CtaBand title="Want the short version?" lead="The CV has the details, the timeline above has the story." />
        </>
    );
}
