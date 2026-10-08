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
import TextLoop from '../Components/reactbits/TextLoop';
import { useGithubStats } from '../hooks/useGithubStats';
import { useRoute } from '../lib/route';

export default function Home({ hero, stats, about, groups, projects, timeline, contact, statuses, github }) {
    const { socials = [] } = usePage().props;
    const route = useRoute();
    const liveGithub = useGithubStats(github, route('github.stats'));

    return (
        <>
            <Head title="Full-Stack Developer" />

            <Hero hero={hero} />

            <Marquee items={['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'PHP', 'MySQL', 'Python']} />

            <AboutTeaser about={about} id="about" />

            <StatsBand stats={stats} github={liveGithub} />

            <section id="skills" className="scroll-mt-24 section-pad">
                <Container>
                    <SectionHeading
                        label="Skills"
                        title="Skills"
                        lead="A curated set of tools, frameworks, and technologies I use to turn ideas into useful products."
                    />

                    <div className="mt-10">
                        <SkillsGrid groups={groups} />
                    </div>
                </Container>
            </section>

            <FeaturedProjects projects={projects} statuses={statuses} id="projects" />

            {liveGithub?.available && (
                <Container>
                    <GithubPanel github={liveGithub} embedded />
                </Container>
            )}

            <Timeline items={timeline} id="experience" />

            <div aria-hidden="true" className="relative mx-auto isolate h-[8rem] overflow-hidden">
                <TextLoop
                    text="LinkedIn ✦ Email ✦ Github"
                    shape="wave"
                    speed={110}
                    direction="forward"
                    separator="✦"
                    curviness={12}
                    fontSize={15}
                    fontWeight={800}
                    letterSpacing={7}
                    uppercase
                    color="#ffffff"
                    ribbon
                    ribbonColor="#000000"
                    ribbonWidth={45}
                    pauseOnHover={false}
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: 'max(100vw, 42rem)' }}
                />
            </div>

            <section id="contact" className="scroll-mt-24 section-pad">
                <Container>
                    <SectionHeading label="Contact" title={contact.headline} lead={contact.lead} />

                    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-5">
                            <Reveal>
                                <p className="text-sm font-medium">Direct channels</p>

                                <ul className="mt-5 flex gap-3">
                                    {socials.map((social) => (
                                        <li key={social.url}>
                                            <MagneticIcon social={social} />
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-8 max-w-sm leading-relaxed text-muted-foreground">
                                    Prefer email? The form lands straight in my inbox, and I reply within a day or two.
                                </p>

                                <div className="mt-9 border-t border-hairline pt-5">
                                    <p className="text-xs font-medium tracking-[0.12em] text-subtle uppercase">Availability</p>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        Open to full-time roles, freelance work, and internships.
                                    </p>
                                </div>
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
