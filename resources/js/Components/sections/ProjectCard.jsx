import { Link } from '@inertiajs/react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { cn } from '../../lib/utils';
import { TechBadge } from '../common/TechBadge';
import { StatusPill } from '../common/StatusPill';

export function ProjectCard({ project, statuses, className, size = 'default' }) {
    const route = useRoute();
    const href = route('projects.show', { slug: project.slug });

    return (
        <article
            className={cn(
                'group h-full overflow-hidden rounded-card border border-hairline bg-surface transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-hairline-strong',
                className,
            )}
        >
            <Link
                href={href}
                className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
                <div className="relative aspect-16/10 overflow-hidden border-b border-hairline bg-surface-2">
                    <img
                        src={project.cover}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-[1.015]"
                    />
                </div>

                <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium tracking-[0.14em] text-subtle uppercase">
                                {project.year} · {project.role}
                            </p>
                            <h3
                                className={cn(
                                    'mt-3 font-display leading-tight text-foreground',
                                    size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl',
                                )}
                            >
                                {project.title}
                            </h3>
                        </div>

                        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors duration-200 group-hover:border-hairline-strong group-hover:text-foreground">
                            {project.status === 'private' ? (
                                <Lock className="size-4" aria-hidden="true" />
                            ) : (
                                <ArrowUpRight className="size-4" aria-hidden="true" />
                            )}
                        </span>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">{project.tagline}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
                        <StatusPill status={project.status} statuses={statuses} />
                        {project.stack.slice(0, 4).map((tech) => (
                            <TechBadge key={tech}>{tech}</TechBadge>
                        ))}
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default ProjectCard;
