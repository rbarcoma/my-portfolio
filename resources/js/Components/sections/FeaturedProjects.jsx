import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealGroup, RevealItem } from '../common/Reveal';
import { ProjectCard } from './ProjectCard';
import { useRoute } from '../../lib/route';

export function FeaturedProjects({ projects, statuses }) {
    const route = useRoute();

    return (
        <section className="section-pad">
            <Container>
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SectionHeading
                        index={1}
                        label="Selected work"
                        title="Three projects, end to end."
                        lead="Data tooling, a booking engine, and an interactive simulator — each shipped from database design to interface."
                    />

                    <Link
                        href={route('projects.index')}
                        data-cursor="hover"
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                        View all projects
                        <ArrowRight
                            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                </div>

                <RevealGroup className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <RevealItem key={project.slug} className="h-full">
                            <ProjectCard project={project} statuses={statuses} />
                        </RevealItem>
                    ))}
                </RevealGroup>
            </Container>
        </section>
    );
}

export default FeaturedProjects;
