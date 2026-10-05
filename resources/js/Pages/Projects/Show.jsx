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
    const hasProjectLinks = Boolean(project.links.live || project.links.repo || project.links.video);
    const shouldShowPrivateProjectNotice = project.status === 'private' || !hasProjectLinks;

    return (
        <>
            <Head title={project.title} />

            <article className="bg-base">
                <header className="border-b border-hairline pt-28 pb-12 sm:pt-36 sm:pb-16">
                    <Container>
                        <a
                            href={route('home') + '#projects'}
                            data-cursor="hover"
                            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-3.5" aria-hidden="true" />
                            All projects
                        </a>

                        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                            <div className="lg:col-span-8">
                                <StatusPill status={project.status} statuses={statuses} />

                                <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.98] font-bold tracking-tight text-balance">
                                    {project.title}
                                </h1>

                                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                    {project.tagline}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-2.5">
                                    {project.stack.map((tech) => (
                                        <TechBadge key={tech}>{tech}</TechBadge>
                                    ))}
                                </div>
                            </div>

                            <aside className="lg:col-span-4">
                                <Reveal>
                                    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-hairline pt-6 lg:grid-cols-1">
                                        {Object.entries(META_LABELS).map(([key, label]) => (
                                            <div key={key} className="flex flex-col gap-1">
                                                <dt className="text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                                    {label}
                                                </dt>
                                                <dd className="text-sm text-foreground">{project[key]}</dd>
                                            </div>
                                        ))}

                                        <div className="flex flex-col gap-1">
                                            <dt className="text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                                Stack
                                            </dt>
                                            <dd className="text-sm leading-relaxed text-foreground">{project.stack.join(', ')}</dd>
                                        </div>
                                    </dl>
                                </Reveal>
                            </aside>
                        </div>
                    </Container>
                </header>

                <Container className="py-10 sm:py-14">
                    <Reveal>
                        <div className="relative aspect-16/9 overflow-hidden rounded-card border border-hairline bg-surface-2">
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
                                    <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                        {project.overview}
                                    </p>
                                </Reveal>

                                <SectionHeading label="What it does" className="mt-18 sm:mt-20" />
                                <RevealGroup className="mt-8 border-t border-hairline">
                                    {project.features.map((feature, index) => (
                                        <RevealItem
                                            key={feature}
                                            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-hairline py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                                        >
                                            <span aria-hidden="true" className="text-sm font-medium text-subtle tabular-nums">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <p className="leading-relaxed text-muted-foreground">{feature}</p>
                                        </RevealItem>
                                    ))}
                                </RevealGroup>

                                <SectionHeading label="Challenges" className="mt-18 sm:mt-20" />
                                <div className="mt-8 grid gap-4">
                                    {project.challenges.map((challenge) => (
                                        <Reveal
                                            key={challenge.problem}
                                            className="rounded-card border border-hairline bg-surface p-5 sm:p-6"
                                        >
                                            <p className="text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                                Challenge
                                            </p>
                                            <p className="mt-2 leading-relaxed text-foreground">{challenge.problem}</p>

                                            <p className="mt-6 text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                                Approach
                                            </p>
                                            <p className="mt-2 leading-relaxed text-muted-foreground">
                                                {challenge.solution}
                                            </p>
                                        </Reveal>
                                    ))}
                                </div>

                                <SectionHeading label="Outcomes" className="mt-18 sm:mt-20" />
                                <RevealGroup className="mt-8 grid gap-3">
                                    {project.outcomes.map((outcome) => (
                                        <RevealItem
                                            key={outcome}
                                            className="flex gap-4 rounded-card border border-hairline bg-surface px-5 py-4 text-muted-foreground"
                                        >
                                            <span aria-hidden="true" className="font-medium text-foreground">
                                                —
                                            </span>
                                            <p className="leading-relaxed">{outcome}</p>
                                        </RevealItem>
                                    ))}
                                </RevealGroup>
                            </div>

                            <aside className="lg:col-span-4">
                                <Reveal className="lg:sticky lg:top-28">
                                    <div className="flex flex-col gap-3 rounded-card border border-hairline bg-surface p-5 sm:p-6">
                                        {project.links.live && (
                                            <Button asChild className="w-full justify-center">
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
                                            <Button asChild variant="outline" className="w-full justify-center">
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
                                            <Button asChild variant="outline" className="w-full justify-center">
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

                                        {shouldShowPrivateProjectNotice && (
                                            <PrivateProjectNotice email={portfolio?.email} />
                                        )}
                                    </div>
                                </Reveal>
                            </aside>
                        </div>
                    </Container>
                </section>

                <nav aria-label="Project navigation" className="border-t border-hairline py-12 sm:py-16">
                    <Container>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {navigation.previous ? (
                                <Link
                                    href={route('projects.show', { slug: navigation.previous.slug })}
                                    data-cursor="hover"
                                    className="group flex min-h-28 flex-col justify-between rounded-card border border-hairline p-5 transition-colors hover:border-hairline-strong hover:bg-surface-2"
                                >
                                    <span className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                                        Previous
                                    </span>
                                    <span className="font-display text-lg text-foreground">
                                        {navigation.previous.title}
                                    </span>
                                </Link>
                            ) : (
                                <span className="hidden sm:block" />
                            )}

                            {navigation.next && (
                                <Link
                                    href={route('projects.show', { slug: navigation.next.slug })}
                                    data-cursor="hover"
                                    className="group flex min-h-28 flex-col justify-between rounded-card border border-hairline p-5 text-right transition-colors hover:border-hairline-strong hover:bg-surface-2"
                                >
                                    <span className="flex items-center justify-end gap-2 text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">
                                        Next
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    <span className="font-display text-lg text-foreground">
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
