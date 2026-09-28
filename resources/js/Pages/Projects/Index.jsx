import { Head } from '@inertiajs/react';
import { PageHeader } from '../../Components/common/PageHeader';
import { Container } from '../../Components/common/Container';
import { RevealGroup, RevealItem } from '../../Components/common/Reveal';
import { ProjectCard } from '../../Components/sections/ProjectCard';
import { CtaBand } from '../../Components/sections/CtaBand';

export default function ProjectsIndex({ projects, statuses }) {
    return (
        <>
            <Head title="Projects" />

            <PageHeader
                eyebrow="Projects"
                title="Work that shipped."
                lead="Three case studies: what the problem was, what I built, and the decisions that mattered."
            />

            <section className="pb-24 sm:pb-32">
                <Container>
                    <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <RevealItem key={project.slug} className="h-full">
                                <ProjectCard project={project} statuses={statuses} />
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </Container>
            </section>

            <CtaBand
                title="Want the code or a walkthrough?"
                lead="Two of these projects are open to a deeper conversation, including the private client work."
            />
        </>
    );
}
