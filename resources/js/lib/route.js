import { useCallback, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { route as ziggyRoute } from 'ziggy-js';

/**
 * Route helper bound to the Ziggy config shared by Inertia.
 *
 * Ziggy config arrives as an Inertia prop (see HandleInertiaRequests), so no
 * global script tag is needed and route names stay owned by the backend.
 * URLs are relative by default, which keeps active-state matching and
 * base-path deployments working.
 */
export function useRoute() {
    const { ziggy } = usePage().props;
    const config = useMemo(() => ziggy?.config, [ziggy]);

    return useCallback(
        (name, params = {}, absolute = false) =>
            config ? ziggyRoute(name, params, absolute, config) : name,
        [config],
    );
}

export default useRoute;
