import { useEffect, useState } from 'react';

const REFRESH_INTERVAL = 30_000;

/**
 * Keeps GitHub activity fresh while the portfolio is open without polling in
 * background tabs. The server remains responsible for credentials and cache.
 */
export function useGithubStats(initialGithub, endpoint) {
    const [github, setGithub] = useState(initialGithub);

    useEffect(() => {
        setGithub(initialGithub);
    }, [initialGithub]);

    useEffect(() => {
        if (!endpoint) {
            return undefined;
        }

        let cancelled = false;
        let refreshing = false;

        const refresh = async () => {
            if (cancelled || refreshing || document.hidden) {
                return;
            }

            refreshing = true;

            try {
                const response = await window.fetch(endpoint, {
                    cache: 'no-store',
                    credentials: 'same-origin',
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    const nextGithub = await response.json();

                    if (!cancelled) {
                        setGithub(nextGithub);
                    }
                }
            } catch {
                // Keep the most recent successful activity data on network failures.
            } finally {
                refreshing = false;
            }
        };

        const onVisibilityChange = () => {
            if (!document.hidden) {
                refresh();
            }
        };

        refresh();
        const interval = window.setInterval(refresh, REFRESH_INTERVAL);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [endpoint]);

    return github;
}

export default useGithubStats;
