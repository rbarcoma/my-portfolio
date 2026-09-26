import { Head } from '@inertiajs/react';
import { PageHeader } from '../Components/common/PageHeader';
import { Container } from '../Components/common/Container';
import { SkillsGrid } from '../Components/sections/SkillsGrid';
import { CtaBand } from '../Components/sections/CtaBand';

export default function Skills({ groups }) {
    const total = groups.reduce((count, group) => count + group.skills.length, 0);

    return (
        <>
            <Head title="Skills" />

            <PageHeader
                eyebrow="02 — Skills"
                title="The toolkit behind the work."
                lead={`${total} tools across frontend, backend, infrastructure and design — grouped by how I actually use them.`}
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
