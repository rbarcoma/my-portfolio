import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';

/**
 * Vertical journey timeline. The spine draws as you scroll; items fade in
 * as the line reaches them.
 */
export function Timeline({ items, id, label = 'Experience' }) {
    const reduced = useReducedMotion();
    const trackRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ['start 65%', 'end 80%'],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

    return (
        <section id={id} className="scroll-mt-24 section-pad-compact">
            <Container>
                <SectionHeading
                    label={label}
                    title="Education and hands-on work."
                    lead="Where the fundamentals came from, and what I have been building with them."
                />

                <div ref={trackRef} className="relative mt-16 pl-10 sm:pl-16">
                    <div
                        aria-hidden="true"
                        className="absolute top-2 bottom-2 left-[3px] w-px bg-hairline sm:left-[7px]"
                    >
                        <motion.div
                            className="h-full w-full origin-top bg-accent"
                            style={reduced ? { scaleY: 1 } : { scaleY }}
                        />
                    </div>

                    <ol className="flex flex-col gap-14">
                        {items.map((item) => (
                            <li key={`${item.period}-${item.title}`} className="relative">
                                <span
                                    aria-hidden="true"
                                    className="absolute top-1.5 -left-10 size-2.5 rounded-full border-2 border-accent bg-base sm:-left-16"
                                />

                                <Reveal>
                                    <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
                                        {item.period}
                                    </p>

                                    <h3 className="mt-3 text-2xl">{item.title}</h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.org}
                                        {item.location ? ` · ${item.location}` : ''}
                                    </p>

                                    <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>

                                    {item.points?.length > 0 && (
                                        <ul className="mt-5 flex flex-col gap-2">
                                            {item.points.map((point) => (
                                                <li
                                                    key={point}
                                                    className="flex gap-3 text-sm text-muted-foreground"
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/70"
                                                    />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Reveal>
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    );
}

export default Timeline;
