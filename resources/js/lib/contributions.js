/**
 * Map a contribution count to one of five lime intensity steps.
 */
export function contributionIntensity(count) {
    if (count === 0) {
        return 'bg-surface-2';
    }

    if (count < 3) {
        return 'bg-accent/25';
    }

    if (count < 6) {
        return 'bg-accent/45';
    }

    if (count < 10) {
        return 'bg-accent/70';
    }

    return 'bg-accent';
}

/**
 * The trailing slice of week columns, oldest first.
 *
 * @param {number[][]} weeks Columns of seven counts, as returned by the API.
 * @param {number} count How many weeks to keep.
 */
export function recentWeeks(weeks, count) {
    return weeks.slice(-count);
}
