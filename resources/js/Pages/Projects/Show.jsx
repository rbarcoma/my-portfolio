import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, ExternalLink, Play } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Container } from '../../Components/common/Container';
import { GitHubIcon } from '../../Components/common/BrandIcons';
import { SectionHeading } from '../../Components/common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../../Components/common/Reveal';
import { TechBadge } from '../../Components/common/TechBadge';
import { StatusPill } from '../../Components/common/StatusPill';
import { PrivateProjectNotice } from '../../Components/common/CvButton';
import { Button } from '../../Components/ui/button';
import { CtaBand } from '../../Components/sections/CtaBand';

const META_LABELS = { role: 'Role', year: 'Year' };

export default function ProjectShow({ project, statuses, navigation, portfolio }) {
    const route = useRoute();

    return (
        <>
            <Head title={project.title} />

            <article>
                <header className="relative overflow-hidden pt-32 pb-12 sm:pt-40">
                    <div aria-hidden="true" className="absolute inset-0 texture-grid opacity-40" />

                    <Container className="relative">
                        <a
                            href={route('home') + '#projects'}
                            data-cursor="hover"
                            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-accent"
                        >
                            <ArrowLeft className="size-3.5" aria-hidden="true" />
                            All projects
                        </a>

                        <div className="mt-8 grid gap-10 lg:grid-cols-12">
                            <div className="lg:col-span-8">
                                <StatusPill status={project.status} statuses={statuses} />

                                <h1 className="mt-5 text-[clamp(2.25rem,6.5vw,5rem)] leading-[0.98] font-bold tracking-tight text-balance">
                                    {project.title}
                                </h1>

                                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                                    {project.tagline}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-2">
                                    {project.stack.map((tech) => (
                                        <TechBadge key={tech}>{tech}</TechBadge>
                                    ))}
                                </div>
                            </div>

                            <aside className="lg:col-span-4">
                                <Reveal>
                                    <dl className="flex flex-col gap-5 rounded-card border border-hairline bg-surface/40 p-6">
                                        {Object.entries(META_LABELS).map(([key, label]) => (
                                            <div key={key} className="flex flex-col gap-1">
                                                <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                                                    {label}
                                                </dt>
                                                <dd className="text-sm">{project[key]}</dd>
                                            </div>
                                        ))}

                                        <div className="flex flex-col gap-1">
                                            <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                                                Stack
                                            </dt>
                                            <dd className="text-sm">{project.stack.join(', ')}</dd>
                                        </div>
                                    </dl>
                                </Reveal>
                            </aside>
                        </div>
                    </Container>
                </header>

                <Container>
                    <Reveal>
                        <div className="relative aspect-16/9 overflow-hidden rounded-card border border-hairline bg-elevated">
                            <img
                                src={project.cover}
                                alt={`${project.title} cover`}
                                loading="eager"
                                fetchPriority="high"
                                decoding="async"
                                width={1600}
                                height={900}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Reveal>
                </Container>

                <section className="section-pad">
                    <Container>
                        <div className="grid gap-14 lg:grid-cols-12">
                            <div className="lg:col-span-8">
                                <SectionHeading label="Overview" />
                                <Reveal delay={0.05}>
                                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                                        {project.overview}
                                    </p>
                                </Reveal>

                                <SectionHeading label="What it does" className="mt-20" />
                                <RevealGroup className="mt-8 flex flex-col gap-4">
                                    {project.features.map((feature) => (
                                        <RevealItem
                                            key={feature}
                                            className="flex gap-4 border-b border-hairline pb-4"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                                            />
                                            <p className="leading-relaxed text-muted-foreground">{feature}</p>
                                        </RevealItem>
                                    ))}
                                </RevealGroup>

                                <SectionHeading label="Challenges" className="mt-20" />
                                <div className="mt-8 flex flex-col gap-5">
                                    {project.challenges.map((challenge) => (
                                        <Reveal
                                            key={challenge.problem}
                                            className="rounded-card border border-hairline bg-surface/40 p-6"
                                        >
                                            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-red-300/80 uppercase">
                                                Problem
                                            </p>
                                            <p className="mt-2 leading-relaxed">{challenge.problem}</p>

                                            <p className="mt-5 font-mono text-[0.65rem] tracking-[0.2em] text-accent uppercase">
                                                Solution
                                            </p>
                                            <p className="mt-2 leading-relaxed text-muted-foreground">
                                                {challenge.solution}
                                            </p>
                                        </Reveal>
                                    ))}
                                </div>

                                <SectionHeading label="Outcomes" className="mt-20" />
                                <RevealGroup className="mt-8 flex flex-col gap-3">
                                    {project.outcomes.map((outcome) => (
                                        <RevealItem
                                            key={outcome}
                                            className="flex gap-4 text-muted-foreground"
                                        >
                                            <span aria-hidden="true" className="text-accent">
                                                →
                                            </span>
                                            <p className="leading-relaxed">{outcome}</p>
                                        </RevealItem>
                                    ))}
                                </RevealGroup>
                            </div>

                            <aside className="lg:col-span-4">
                                <Reveal className="lg:sticky lg:top-28">
                                    <div className="flex flex-col gap-4 rounded-card border border-hairline bg-surface/40 p-6">
                                        {project.links.live && (
                                            <Button asChild>
                                                <a
                                                    href={project.links.live}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    data-cursor="hover"
                                                >
                                                    Visit live site
                                                    <ExternalLink aria-hidden="true" />
                                                </a>
                                            </Button>
                                        )}

                                        {project.links.repo && (
                                            <Button asChild variant="outline">
                                                <a
                                                    href={project.links.repo}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    data-cursor="hover"
                                                >
                                                    <GitHubIcon />
                                                    Source code
                                                </a>
                                            </Button>
                                        )}

                                        {project.links.video && (
                                            <Button asChild variant="outline">
                                                <a
                                                    href={project.links.video}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    data-cursor="hover"
                                                >
                                                    <Play aria-hidden="true" />
                                                    Watch demo
                                                </a>
                                            </Button>
                                        )}

                                        {!project.links.live && !project.links.repo && !project.links.video && (
                                            <PrivateProjectNotice email={portfolio?.email} />
                                        )}

                                        {project.status === 'private' && (
                                            <PrivateProjectNotice email={portfolio?.email} />
                                        )}
                                    </div>
                                </Reveal>
                            </aside>
                        </div>
                    </Container>
                </section>

                <nav aria-label="Project navigation" className="border-t border-hairline py-16">
                    <Container>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            {navigation.previous ? (
                                <Link
                                    href={route('projects.show', { slug: navigation.previous.slug })}
                                    data-cursor="hover"
                                    className="group flex flex-col gap-1"
                                >
                                    <span className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                                        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                                        Previous
                                    </span>
                                    <span className="font-display text-lg transition-colors group-hover:text-accent">
                                        {navigation.previous.title}
                                    </span>
                                </Link>
                            ) : (
                                <span />
                            )}

                            {navigation.next && (
                                <Link
                                    href={route('projects.show', { slug: navigation.next.slug })}
                                    data-cursor="hover"
                                    className="group flex flex-col gap-1 text-right"
                                >
                                    <span className="flex items-center justify-end gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                                        Next
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span className="font-display text-lg transition-colors group-hover:text-accent">
                                        {navigation.next.title}
                                    </span>
                                </Link>
                            )}
                        </div>
                    </Container>
                </nav>
            </article>

            <CtaBand
                title="Curious about the build?"
                lead="I am happy to walk through the architecture, the trade-offs, or the parts I would rebuild differently."
            />
        </>
    );
}
