import { Head } from '@inertiajs/react';
import { PageHeader } from '../Components/common/PageHeader';
import { Container } from '../Components/common/Container';
import { ContactForm } from '../Components/sections/ContactForm';
import { MagneticIcon } from '../Components/common/MagneticIcon';
import { Reveal } from '../Components/common/Reveal';

export default function Contact({ contact, socials }) {
    return (
        <>
            <Head title="Contact" />

            <PageHeader eyebrow="05 — Contact" title={contact.headline} lead={contact.lead} />

            <section className="pb-28 sm:pb-36">
                <Container>
                    <div className="grid gap-16 lg:grid-cols-12">
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
