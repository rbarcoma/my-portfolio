import { useEffect, useRef, useState } from 'react';

/**
 * Track scroll direction and offset using a single passive listener.
 *
 * `direction` is null until the visitor has scrolled at least `threshold` px,
 * which keeps the navbar stable on first paint.
 */
export function useScrollDirection(threshold = 8) {
    const [state, setState] = useState({ direction: null, offset: 0 });
    const lastY = useRef(0);

    useEffect(() => {
        lastY.current = window.scrollY;

        let frame = null;

        const onScroll = () => {
            if (frame !== null) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                frame = null;

                const offset = window.scrollY;
                const delta = offset - lastY.current;

                if (Math.abs(delta) >= threshold) {
                    setState({
                        direction: delta > 0 ? 'down' : 'up',
                        offset,
                    });
                    lastY.current = offset;
                } else {
                    setState((current) => ({ ...current, offset }));
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);

            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, [threshold]);

    return state;
}

export default useScrollDirection;
