import { useState } from 'react';
import { useIsomorphicLayoutEffect } from './useMediaQuery';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the visitor asked the OS to reduce motion.
 *
 * Starts as `false` so the first client render matches the server output,
 * then syncs before paint. Every animated component checks this and swaps
 * to instant states, so `prefers-reduced-motion` disables the whole
 * experience rather than just CSS.
 */
export function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const media = window.matchMedia(QUERY);
        const onChange = (event) => setReduced(event.matches);

        setReduced(media.matches);
        media.addEventListener('change', onChange);

        return () => media.removeEventListener('change', onChange);
    }, []);

    return reduced;
}

export default useReducedMotion;
