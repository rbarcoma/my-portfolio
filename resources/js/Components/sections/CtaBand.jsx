import { ArrowRight } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { Container } from '../common/Container';
import { Reveal } from '../common/Reveal';

export function CtaBand({ title = "Let's build something", lead }) {
    const route = useRoute();

    return (
        <section className="border-y border-hairline bg-surface">
            <Container className="py-18 sm:py-24">
                <div className="grid items-end gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <Reveal>
                            <p className="eyebrow">Get in touch</p>
                            <h2 className="mt-5 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] font-semibold text-balance">
                                {title}
                            </h2>
                        </Reveal>
                        {lead && (
                            <Reveal delay={0.06}>
                                <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{lead}</p>
                            </Reveal>
                        )}
                    </div>
                    <Reveal delay={0.12} className="lg:col-span-4 lg:justify-self-end">
                        <Button asChild size="lg">
                            <a href={route('home') + '#contact'}>
                                Start a conversation
                                <ArrowRight aria-hidden="true" />
                            </a>
                        </Button>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}

export default CtaBand;
