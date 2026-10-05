import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealGroup, RevealItem } from '../common/Reveal';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects({ projects, statuses, id = 'projects' }) {
    return (
        <section id={id} className="scroll-mt-24 section-pad-compact">
            <Container>
                <SectionHeading
                    label="What I build"
                    title="Work with a clear purpose."
                    lead="Data tooling, booking flows, and interactive learning tools — designed from the first schema through the final interface."
                />

                <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
