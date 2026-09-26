import { useRef } from 'react';
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

/**
 * Infinite marquee whose direction and speed react to scroll velocity.
 * Based on the React Bits ScrollVelocity pattern.
 */
export function ScrollVelocity({ children, baseVelocity = 2, className }) {
    const reduced = useReducedMotion();
    const wrapRef = useRef(null);
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
    const skew = useTransform(smoothVelocity, [-1000, 0, 1000], [-2, 0, 2], { clamp: true });
    const x = useTransform(baseX, (value) => `${-value}%`);

    useAnimationFrame((_, delta) => {
        let moveBy = baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            moveBy = (baseVelocity + velocityFactor.get()) * -1;
        }

        baseX.set(baseX.get() + moveBy);
    });

    if (reduced) {
        return <div className={cn('mask-fade-x overflow-hidden py-2', className)}>{children}</div>;
    }

    return (
        <div ref={wrapRef} className={cn('mask-fade-x overflow-hidden', className)}>
            <motion.div className="flex w-max" style={{ x, skew }}>
                {[0, 1].map((copy) => (
                    <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                        {children}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default ScrollVelocity;
