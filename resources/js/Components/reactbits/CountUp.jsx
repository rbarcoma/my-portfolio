import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { formatNumber } from '../../lib/utils';

/**
 * Counts up to `value` once the element scrolls into view.
 * `value` may be null while waiting on data — the fallback is shown instead.
 */
export function CountUp({ value, duration = 1400, fallback = '—', className, suffix = '', prefix = '' }) {
    const reduced = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-10% 0px' });
    const [display, setDisplay] = useState(reduced || value === null || value === undefined ? 0 : value);

    useEffect(() => {
        if (value === null || value === undefined) {
            return;
        }

        if (reduced) {
            setDisplay(value);

            return;
        }

        if (!inView) {
            setDisplay(0);

            return;
        }

        let frame = null;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);

            setDisplay(Math.round(value * eased));

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [duration, inView, reduced, value]);

    if (value === null || value === undefined) {
        return (
            <span ref={ref} className={className}>
                {fallback}
            </span>
        );
    }

    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatNumber(display)}
            {suffix}
        </span>
    );
}

export default CountUp;
