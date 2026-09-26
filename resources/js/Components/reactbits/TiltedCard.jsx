import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

/**
 * 3D tilt with glare sweep, used for project cards.
 * `cursorLabel` morphs the custom cursor over the card.
 */
export function TiltedCard({ children, className, intensity = 8, glare = true, cursorLabel = 'View', ...props }) {
    const reduced = useReducedMotion();
    const finePointer = useFinePointer();
    const enabled = finePointer && !reduced;
    const ref = useRef(null);
    const [hovered, setHovered] = useState(false);

    const rotateXValue = useMotionValue(0);
    const rotateYValue = useMotionValue(0);
    const glareX = useMotionValue(50);
    const glareY = useMotionValue(50);

    const springConfig = { stiffness: 200, damping: 22, mass: 0.4 };
    const rotateX = useSpring(rotateXValue, springConfig);
    const rotateY = useSpring(rotateYValue, springConfig);
    const rotateXDeg = useTransform(rotateX, (value) => `${value}deg`);
    const rotateYDeg = useTransform(rotateY, (value) => `${value}deg`);
    const glareBackground = useTransform(
        [glareX, glareY],
        ([x, y]) => `radial-gradient(220px circle at ${x}% ${y}%, rgba(255,255,255,0.14), transparent 65%)`,
    );

    const onPointerMove = (event) => {
        if (!enabled || !ref.current) {
            return;
        }

        const bounds = ref.current.getBoundingClientRect();
        const percentX = (event.clientX - bounds.left) / bounds.width;
        const percentY = (event.clientY - bounds.top) / bounds.height;

        rotateXValue.set((0.5 - percentY) * intensity * 2);
        rotateYValue.set((percentX - 0.5) * intensity * 2);
        glareX.set(percentX * 100);
        glareY.set(percentY * 100);
    };

    const onPointerLeave = () => {
        setHovered(false);
        rotateXValue.set(0);
        rotateYValue.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={onPointerLeave}
            data-cursor={hovered ? 'label' : 'hover'}
            data-cursor-label={cursorLabel}
            style={enabled ? { rotateX: rotateXDeg, rotateY: rotateYDeg, transformPerspective: 1000 } : undefined}
            className={cn('group relative will-change-transform', className)}
            {...props}
        >
            {children}

            {glare && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: glareBackground }}
                />
            )}
        </motion.div>
    );
}

export default TiltedCard;
