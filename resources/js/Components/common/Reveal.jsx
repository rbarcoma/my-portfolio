import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

const EASE = [0.16, 1, 0.3, 1];

/**
 * Scroll-triggered reveal: fade + rise, once, transform/opacity only.
 * With reduced motion it renders the final state immediately.
 */
export function Reveal({
    children,
    className,
    delay = 0,
    y = 24,
    duration = 0.5,
    as = 'div',
    once = true,
    ...props
}) {
    const reduced = useReducedMotion();
    const Component = motion[as] ?? motion.div;

    if (reduced) {
        const Static = as;
        return (
            <Static className={className} {...props}>
                {children}
            </Static>
        );
    }

    return (
        <Component
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, margin: '-15% 0px -10% 0px' }}
            transition={{ duration, delay, ease: EASE }}
            {...props}
        >
            {children}
        </Component>
    );
}

/**
 * Stagger container for lists of children.
 */
export function RevealGroup({ children, className, stagger = 0.08, delay = 0, ...props }) {
    const reduced = useReducedMotion();

    if (reduced) {
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
            variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({ children, className, y = 20, ...props }) {
    const reduced = useReducedMotion();

    if (reduced) {
        return (
            <div className={className} {...props}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export { EASE };
export default Reveal;
