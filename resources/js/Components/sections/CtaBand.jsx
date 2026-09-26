import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { Container } from '../common/Container';
import { Reveal } from '../common/Reveal';
import { GradientText } from '../reactbits/GradientText';
import { Magnet } from '../reactbits/Magnet';
import { Marquee } from './Marquee';

export function CtaBand({ title = "Let's build something", lead, items }) {
    const route = useRoute();
    const words = title.split(' ');
    const accentWord = words.length > 1 ? words.pop() : null;

    return (
        <section className="relative overflow-hidden border-y border-hairline bg-surface/30">
            <div aria-hidden="true" className="absolute inset-0 texture-grid opacity-60" />
            <div
                aria-hidden="true"
                className="absolute -bottom-32 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
            />

            <Container className="relative py-24 text-center sm:py-28">
                <Reveal>
                    <h2 className="mx-auto max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-bold tracking-tight text-balance">
                        {words.join(' ')}
                        {accentWord && (
                            <>
                                {' '}
                                <GradientText>{accentWord}</GradientText>
                            </>
                        )}
                    </h2>
                </Reveal>

                {lead && (
                    <Reveal delay={0.08}>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {lead}
                        </p>
                    </Reveal>
                )}

                <Reveal delay={0.16}>
                    <div className="mt-10 flex justify-center">
                        <Magnet>
                            <Button asChild size="lg">
                                <Link href={route('contact')} data-cursor="hover">
                                    Start a conversation
                                    <ArrowRight aria-hidden="true" />
                                </Link>
                            </Button>
                        </Magnet>
                    </div>
                </Reveal>
            </Container>

            {items?.length > 0 && <Marquee items={items} />}
        </section>
    );
}

export default CtaBand;
