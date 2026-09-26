/**
 * Live / WIP / Private indicator. `statuses` comes from config('projects.statuses')
 * so the copy lives with the rest of the content.
 */
export function StatusPill({ status, statuses = {} }) {
    const meta = statuses[status] ?? {
        label: status,
        className: 'text-muted-foreground border-hairline bg-white/5',
    };

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-[0.2em] uppercase ${meta.className}`}
        >
            <span
                aria-hidden="true"
                className={`size-1.5 rounded-full bg-current ${
                    status === 'live' ? 'motion-safe-only animate-[pulse-dot_2.4s_ease-in-out_infinite]' : ''
                }`}
            />
            {meta.label}
        </span>
    );
}

export default StatusPill;
