import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

/**
 * Vertical role rotator for the hero subline. The full list is exposed to
 * assistive tech as static text.
 */
export function RotatingText({ items, className, interval = 2600 }) {
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (reduced || items.length < 2) {
            return;
        }

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % items.length);
        }, interval);

        return () => window.clearInterval(timer);
    }, [interval, items.length, reduced]);

    if (reduced) {
        return <span className={className}>{items[0]}</span>;
    }

    return (
        <span className={cn('relative inline-flex h-[1.2em] overflow-hidden align-bottom', className)}>
            <span className="sr-only">{items.join(', ')}</span>

            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={items[index]}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 whitespace-nowrap text-accent"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    {items[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

export default RotatingText;
