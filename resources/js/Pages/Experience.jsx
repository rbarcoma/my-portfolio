import { Head } from '@inertiajs/react';
import { PageHeader } from '../Components/common/PageHeader';
import { Timeline } from '../Components/sections/Timeline';
import { CtaBand } from '../Components/sections/CtaBand';

export default function Experience({ timeline }) {
    return (
        <>
            <Head title="Experience" />

            <PageHeader
                eyebrow="04 — Experience"
                title="The path so far."
                lead="Undergraduate foundations, freelance builds, and projects that forced me to learn something new on purpose."
            />

            <Timeline items={timeline} />

            <CtaBand
                title="The next entry is still open."
                lead="If you are hiring for a full-stack role or an internship, I would like to hear about it."
            />
        </>
    );
}
