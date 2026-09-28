import { Head, usePage } from '@inertiajs/react';
import { Container } from '../Components/common/Container';
import { SectionHeading } from '../Components/common/SectionHeading';
import { Reveal } from '../Components/common/Reveal';
import { MagneticIcon } from '../Components/common/MagneticIcon';
import { Hero } from '../Components/sections/Hero';
import { Marquee } from '../Components/sections/Marquee';
import { FeaturedProjects } from '../Components/sections/FeaturedProjects';
import { StatsBand } from '../Components/sections/StatsBand';
import { AboutTeaser } from '../Components/sections/AboutTeaser';
import { GithubPanel } from '../Components/sections/GitHubPanel';
import { SkillsGrid } from '../Components/sections/SkillsGrid';
import { Timeline } from '../Components/sections/Timeline';
import { ContactForm } from '../Components/sections/ContactForm';

export default function Home({ hero, stats, about, groups, projects, timeline, contact, statuses, github }) {
    const { socials = [] } = usePage().props;
    const total = groups.reduce((count, group) => count + group.skills.length, 0);

    return (
        <>
            <Head title="Full-Stack Developer" />

            <Hero hero={hero} />

            <Marquee items={['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'PHP', 'MySQL', 'Python']} />

            <AboutTeaser about={about} id="about" />

            <StatsBand stats={stats} github={github} />

            <section id="skills" className="scroll-mt-24 section-pad">
                <Container>
                    <SectionHeading
                        label="Skills"
                        title="The toolkit behind the work."
                        lead={total + ' tools across frontend, backend, data, DevOps and design — grouped by how I actually use them.'}
                    />

                    <div className="mt-12">
                        <SkillsGrid groups={groups} />
                    </div>

                    {github?.available && <GithubPanel github={github} embedded />}
                </Container>
            </section>

            <FeaturedProjects projects={projects} statuses={statuses} id="projects" />

            <Timeline items={timeline} id="experience" />

            <section id="contact" className="scroll-mt-24 section-pad">
                <Container>
                    <SectionHeading label="Contact" title={contact.headline} lead={contact.lead} />

                    <div className="mt-14 grid gap-16 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <Reveal>
                                <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
                                    Direct channels
                                </p>

                                <ul className="mt-6 flex gap-3">
                                    {socials.map((social) => (
                                        <li key={social.url}>
                                            <MagneticIcon social={social} />
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-8 max-w-sm leading-relaxed text-muted-foreground">
                                    Prefer email? The form lands straight in my inbox, and I answer everything
                                    within a day or two.
                                </p>

                                <p className="mt-10 font-mono text-xs tracking-[0.2em] text-subtle uppercase">
                                    Availability
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Open to full-time roles, freelance work, and internships.
                                </p>
                            </Reveal>
                        </div>

                        <div className="lg:col-span-7">
                            <Reveal delay={0.1}>
                                <ContactForm />
                            </Reveal>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
