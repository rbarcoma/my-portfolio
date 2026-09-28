import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { RotatingText } from '../reactbits/RotatingText';
import { ScrambleText } from '../reactbits/ScrambleText';
import { SplitText } from '../reactbits/SplitText';
import { DotGrid } from '../reactbits/DotGrid';
import { Magnet } from '../reactbits/Magnet';
import { Container } from '../common/Container';

const HEADLINE_WORDS = ['FULL-STACK', 'DEVELOPER'];

export function Hero({ hero }) {
    const route = useRoute();
    const reduced = useReducedMotion();

    return (
        <section id="home" className="relative flex min-h-[100svh] scroll-mt-24 items-center overflow-hidden pt-24 pb-16">
            <DotGrid />

            <Container className="relative">
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
                                            ? 'bg-gradient-to-r from-accent via-accent to-secondary bg-clip-text text-transparent'
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

            <motion.div
                aria-hidden="true"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="absolute inset-x-0 bottom-6 flex justify-center"
            >
                <span className="flex flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.3em] text-subtle uppercase">
                    Scroll
                    <motion.span
                        animate={reduced ? undefined : { y: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ArrowDown className="size-4" />
                    </motion.span>
                </span>
            </motion.div>
        </section>
    );
}

export default Hero;
