import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

/**
 * Magnetic pull wrapper for CTAs and social icons.
 * Disabled for coarse pointers and reduced motion.
 */
export function Magnet({ children, strength = 0.35, radius = 120, className, as = 'div', ...props }) {
    const reduced = useReducedMotion();
    const finePointer = useFinePointer();
    const ref = useRef(null);

    const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
    const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
    const enabled = finePointer && !reduced;

    const onPointerMove = (event) => {
        if (!enabled || !ref.current) {
            return;
        }

        const bounds = ref.current.getBoundingClientRect();
        const deltaX = event.clientX - (bounds.left + bounds.width / 2);
        const deltaY = event.clientY - (bounds.top + bounds.height / 2);

        if (Math.hypot(deltaX, deltaY) > radius + Math.max(bounds.width, bounds.height)) {
            x.set(0);
            y.set(0);

            return;
        }

        x.set(deltaX * strength);
        y.set(deltaY * strength);
    };

    const onPointerLeave = () => {
        x.set(0);
        y.set(0);
    };

    const Component = motion[as] ?? motion.div;

    return (
        <Component
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={enabled ? { x, y } : undefined}
            className={cn('inline-flex', className)}
            {...props}
        >
            {children}
        </Component>
    );
}

export default Magnet;
