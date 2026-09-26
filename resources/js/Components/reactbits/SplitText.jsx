import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Character-stagger reveal for display headlines.
 * Words stay selectable and readable by assistive tech (aria-label carries
 * the full text, the animated spans are hidden).
 */
export function SplitText({ text, className, delay = 0, stagger = 0.028, duration = 0.7, as = 'span' }) {
    const reduced = useReducedMotion();
    const words = text.split(' ');

    if (reduced) {
        const Static = as;

        return <Static className={className}>{text}</Static>;
    }

    let charIndex = 0;

    return (
        <motion.span
            className={cn('inline-block', className)}
            initial="hidden"
            animate="visible"
            aria-label={text}
            variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        >
            {words.map((word, wordIndex) => {
                const isLast = wordIndex === words.length - 1;
                const chars = Array.from(word).map((char) => {
                    const index = charIndex++;

                    return (
                        <motion.span
                            key={`${char}-${index}`}
                            aria-hidden="true"
                            className="inline-block will-change-transform"
                            variants={{
                                hidden: { opacity: 0, y: '0.5em', rotateX: -55 },
                                visible: {
                                    opacity: 1,
                                    y: '0em',
                                    rotateX: 0,
                                    transition: { duration, ease: EASE },
                                },
                            }}
                        >
                            {char}
                        </motion.span>
                    );
                });

                return (
                    <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
                        {chars}
                        {!isLast && <span className="inline-block w-[0.28em]">&nbsp;</span>}
                    </span>
                );
            })}
        </motion.span>
    );
}

export default SplitText;
