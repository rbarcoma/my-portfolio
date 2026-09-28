import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { RotatingText } from '../reactbits/RotatingText';
import { ScrambleText } from '../reactbits/ScrambleText';
import { SplitText } from '../reactbits/SplitText';
import { CursorGrid } from '../reactbits/CursorGrid';
import { Magnet } from '../reactbits/Magnet';
import { Container } from '../common/Container';

const HEADLINE_WORDS = ['FULL-STACK', 'DEVELOPER'];

export function Hero({ hero }) {
    const route = useRoute();
    const reduced = useReducedMotion();

    return (
        <section id="home" className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden pt-24 pb-16">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-20 size-[38rem] rounded-full bg-accent/12 blur-[130px]" />
                <div className="absolute top-1/3 -right-32 size-[34rem] rounded-full bg-secondary/10 blur-[140px]" />
                <CursorGrid
                    className="absolute inset-0"
                    cellSize={72}
                    color="var(--color-accent)"
                    radius={145}
                    holdTime={280}
                    fadeDuration={760}
                    lineWidth={1}
                    maxOpacity={0.62}
                    fillOpacity={0.035}
                    gridOpacity={0.06}
                    clickPulse={false}
                    pulseSpeed={520}
                />
            </div>

            <Container className="relative z-10">
                <div className="mx-auto max-w-5xl text-center">
                    <motion.p
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="font-mono text-xs tracking-[0.35em] text-accent uppercase sm:text-sm"
                    >
                        <ScrambleText text={hero.eyebrow} />
                    </motion.p>

                    <h1 className="mt-6 font-display text-[clamp(2.75rem,11vw,8.5rem)] leading-[0.9] font-bold tracking-tight uppercase">
                        {HEADLINE_WORDS.map((word, index) => (
                            <span key={word} className="block overflow-hidden">
                                <SplitText
                                    text={word}
                                    delay={0.1 + index * 0.15}
                                    className={
                                        index === HEADLINE_WORDS.length - 1
                                            ? 'text-black dark:text-foreground'
                                            : undefined
                                    }
                                />
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
                    >
                        I build{' '}
                        <RotatingText
                            items={hero.rotating}
                            className="font-display font-medium text-accent"
                        />{' '}
                        — end to end, with the schema and the pixels treated as
                        equally important.
                    </motion.p>

                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Magnet>
                            <Button asChild variant="outline" size="lg">
                                <a href={route('home') + '#projects'} data-cursor="hover">
                                    View projects
                                    <ArrowRight aria-hidden="true" />
                                </a>
                            </Button>
                        </Magnet>
                    </motion.div>
                </div>
            </Container>

        </section>
    );
}

export default Hero;
