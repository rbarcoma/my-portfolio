import { Link } from '@inertiajs/react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { cn } from '../../lib/utils';
import { TiltedCard } from '../reactbits/TiltedCard';
import { TechBadge } from '../common/TechBadge';
import { StatusPill } from '../common/StatusPill';

export function ProjectCard({ project, statuses, className, size = 'default' }) {
    const route = useRoute();
    const href = route('projects.show', { slug: project.slug });

    return (
        <TiltedCard
            className={cn(
                'h-full rounded-card border border-hairline bg-surface/50 transition-colors duration-300 hover:border-hairline-strong',
                className,
            )}
            cursorLabel="View"
        >
            <Link href={href} className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <div className="relative aspect-16/10 overflow-hidden rounded-t-card border-b border-hairline bg-elevated">
                    <img
                        src={project.cover}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                        style={{ '--accent': project.accent }}
                    />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
                                {project.year} · {project.role}
                            </p>
                            <h3
                                className={cn(
                                    'mt-2 font-display leading-tight',
                                    size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl',
                                )}
                            >
                                {project.title}
                            </h3>
                        </div>

                        <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent">
                            {project.status === 'private' ? (
                                <Lock className="size-4" aria-hidden="true" />
                            ) : (
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            )}
                        </span>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                        <StatusPill status={project.status} statuses={statuses} />
                        {project.stack.slice(0, 4).map((tech) => (
                            <TechBadge key={tech}>{tech}</TechBadge>
                        ))}
                    </div>
                </div>
            </Link>
        </TiltedCard>
    );
}

export default ProjectCard;
