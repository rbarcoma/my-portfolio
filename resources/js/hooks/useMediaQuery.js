import { useEffect, useLayoutEffect, useState } from 'react';

export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Subscribe to a media query.
 *
 * State starts as `false` so the first client render matches the
 * server-rendered HTML (no hydration mismatch), then syncs in a layout
 * effect so the correct value is applied before paint.
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useIsomorphicLayoutEffect(() => {
        const media = window.matchMedia(query);
        const onChange = (event) => setMatches(event.matches);

        setMatches(media.matches);
        media.addEventListener('change', onChange);

        return () => media.removeEventListener('change', onChange);
    }, [query]);

    return matches;
}

/** True on devices without a precise pointer (phones, tablets in touch mode). */
export function useFinePointer() {
    return useMediaQuery('(pointer: fine)');
}

/** True at or above the Tailwind `lg` breakpoint. */
export function useIsDesktop() {
    return useMediaQuery('(min-width: 1024px)');
}

export default useMediaQuery;
