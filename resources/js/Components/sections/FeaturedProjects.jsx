import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { RevealGroup, RevealItem } from '../common/Reveal';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects({ projects, statuses, id = 'projects' }) {
    return (
        <section id={id} className="scroll-mt-24 section-pad">
            <Container>
                <SectionHeading
                    label="Selected Work"
                    title="Three projects, end to end."
                    lead="Data tooling, a booking engine, and an interactive simulator — each shipped from database design to interface."
                />

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
