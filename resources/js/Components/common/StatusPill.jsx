/**
 * Project-status indicator. Copy comes from config('projects.statuses').
 */
export function StatusPill({ status, statuses = {} }) {
    const meta = statuses[status] ?? { label: status };

    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1 text-[0.68rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {meta.label}
        </span>
    );
}

export default StatusPill;
