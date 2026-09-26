import { Head } from '@inertiajs/react';
import { Hero } from '../Components/sections/Hero';
import { Marquee } from '../Components/sections/Marquee';
import { FeaturedProjects } from '../Components/sections/FeaturedProjects';
import { StatsBand } from '../Components/sections/StatsBand';
import { AboutTeaser } from '../Components/sections/AboutTeaser';
import { CtaBand } from '../Components/sections/CtaBand';
import { GithubPanel } from '../Components/sections/GitHubPanel';

export default function Home({ hero, stats, about, contact, cv, featuredProjects, statuses, github }) {
    return (
        <>
            <Head title="Full-Stack Developer" />

            <Hero hero={hero} cv={cv} />

            <Marquee items={['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'PHP', 'MySQL', 'Python']} />

            <FeaturedProjects projects={featuredProjects} statuses={statuses} />

            <StatsBand stats={stats} github={github} />

            <AboutTeaser about={about} cv={cv} />

            {github?.available && <GithubPanel github={github} compact />}

            <CtaBand title={contact.headline} lead={contact.lead} />
        </>
    );
}
