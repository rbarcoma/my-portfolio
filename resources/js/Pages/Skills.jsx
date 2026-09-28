import { Head } from '@inertiajs/react';
import { PageHeader } from '../Components/common/PageHeader';
import { Container } from '../Components/common/Container';
import { SkillsGrid } from '../Components/sections/SkillsGrid';
import { CtaBand } from '../Components/sections/CtaBand';

export default function Skills({ groups }) {
    return (
        <>
            <Head title="Skills" />

            <PageHeader
                eyebrow="Capabilities"
                title="Skills"
                lead="Hover or select a discipline to explore the technologies behind the work."
            />

            <section className="pb-24 sm:pb-32">
                <Container>
                    <SkillsGrid groups={groups} />
                </Container>
            </section>

            <CtaBand
                title="Need a specific stack?"
                lead="Most of the above is interchangeable. Tell me what you are building and I will map it to the right tools."
            />
        </>
    );
}
