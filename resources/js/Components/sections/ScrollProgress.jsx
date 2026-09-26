import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * 2px accent scroll progress line pinned to the top of the viewport.
 */
export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 240, damping: 30, restDelta: 0.001 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (value) => setVisible(value > 0.002));

        return unsubscribe;
    }, [scrollYProgress]);

    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className={`fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent transition-opacity duration-300 ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
        />
    );
}

export default ScrollProgress;
