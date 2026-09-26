import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*<>/\\';
const SETTLE_ITERATIONS = 14;

/**
 * Mono label that "decrypts" into its final text when scrolled into view.
 */
export function ScrambleText({ text, className, speed = 34, delay = 0 }) {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-10% 0px' });
    const [output, setOutput] = useState(() => (reduced ? text : ''));

    useEffect(() => {
        if (reduced) {
            setOutput(text);

            return;
        }

        if (!inView) {
            return;
        }

        let queue = Array.from(text).map((char) =>
            char === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        );
        let iteration = 0;

        const startTimeout = window.setTimeout(() => {
            const interval = window.setInterval(() => {
                queue = queue.map((char, index) => {
                    if (char === ' ' || text[index] === ' ') {
                        return ' ';
                    }

                    return iteration >= SETTLE_ITERATIONS
                        ? text[index]
                        : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                });

                iteration += 1;
                setOutput(queue.join(''));

                if (iteration > text.length + SETTLE_ITERATIONS) {
                    window.clearInterval(interval);
                    setOutput(text);
                }
            }, speed);
        }, delay);

        return () => window.clearTimeout(startTimeout);
    }, [delay, inView, reduced, speed, text]);

    return (
        <span ref={ref} className={cn('font-mono tracking-widest', className)} aria-label={text}>
            <span aria-hidden="true">{output || text}</span>
        </span>
    );
}

export default ScrambleText;
