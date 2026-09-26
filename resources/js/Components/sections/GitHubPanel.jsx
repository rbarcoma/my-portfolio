import { useMemo } from 'react';
import { ExternalLink, Star, GitFork, RefreshCw } from 'lucide-react';
import { CountUp } from '../reactbits/CountUp';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';
import { Tooltip } from '../ui/tooltip';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Map a contribution count to one of five lime intensity steps.
 */
export function intensity(count) {
    if (count === 0) {
        return 'bg-white/5';
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

function Heatmap({ weeks }) {
    const grid = useMemo(
        () =>
            weeks.map((counts) =>
                Array.from({ length: 7 }, (_, day) => counts[day] ?? 0),
            ),
        [weeks],
    );

    if (grid.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px]">
                {grid.map((counts, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                        {counts.map((count, dayIndex) => (
                            <Tooltip
                                key={`${weekIndex}-${dayIndex}`}
                                content={`${count} contribution${count === 1 ? '' : 's'}`}
                            >
                                <span
                                    className={`size-3 rounded-[2px] ${intensity(count)}`}
                                    role="img"
                                    aria-label={`${DAY_LABELS[dayIndex]}: ${count} contributions`}
                                />
                            </Tooltip>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatChip({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3">
            {Icon && <Icon className="size-4 text-accent" aria-hidden="true" />}
            <div>
                <p className="font-display text-xl leading-none tabular-nums">
                    <CountUp value={value} />
                </p>
                <p className="mt-1 font-mono text-[0.65rem] tracking-[0.2em] text-subtle uppercase">
                    {label}
                </p>
            </div>
        </div>
    );
}

/**
 * GitHub activity: contribution heatmap, stat chips, language bar, top repos.
 * Renders a calm fallback when the API is unavailable.
 */
export function GithubPanel({ github, compact = false }) {
    if (!github?.available) {
        return null;
    }

    const { profile, repos, languages, contributions } = github;

    return (
        <section className={compact ? 'border-t border-hairline bg-surface/20 py-20' : 'section-pad'}>
            <Container>
                <SectionHeading
                    index={compact ? undefined : 3}
                    label="Open source"
                    title={compact ? 'GitHub activity' : 'What I build in the open.'}
                    lead={profile?.bio ?? 'Commits, repositories, and the languages behind them.'}
                />

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    <StatChip label="Public repos" value={profile?.public_repos ?? 0} />
                    <StatChip label="Followers" value={profile?.followers ?? 0} />
                    <StatChip
                        label="Contributions"
                        value={contributions?.total ?? null}
                        icon={RefreshCw}
                    />
                </div>

                {contributions?.weeks?.length > 0 && (
                    <Reveal className="mt-6">
                        <div className="rounded-card border border-hairline bg-surface/40 p-6">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    {contributions.this_year} contributions this year
                                </p>
                                <a
                                    href={profile?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor="hover"
                                    className="inline-flex items-center gap-2 text-sm text-accent underline-offset-4 hover:underline"
                                >
                                    @{profile?.login}
                                    <ExternalLink className="size-3.5" aria-hidden="true" />
                                </a>
                            </div>

                            <Heatmap weeks={contributions.weeks} />
                        </div>
                    </Reveal>
                )}

                {languages.length > 0 && (
                    <Reveal className="mt-6">
                        <div className="rounded-card border border-hairline bg-surface/40 p-6">
                            <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                Top languages
                            </p>

                            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full">
                                {languages.map((language) => (
                                    <span
                                        key={language.name}
                                        className="h-full"
                                        style={{
                                            width: `${language.percentage}%`,
                                            backgroundColor: language.color,
                                        }}
                                        title={`${language.name} ${language.percentage}%`}
                                    />
                                ))}
                            </div>

                            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                                {languages.map((language) => (
                                    <li
                                        key={language.name}
                                        className="flex items-center gap-2 text-sm text-muted-foreground"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="size-2.5 rounded-full"
                                            style={{ backgroundColor: language.color }}
                                        />
                                        {language.name}
                                        <span className="font-mono text-xs text-subtle">
                                            {language.percentage}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                )}

                {repos.length > 0 && (
                    <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo) => (
                            <RevealItem key={repo.name}>
                                <a
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor="hover"
                                    className="flex h-full flex-col gap-3 rounded-card border border-hairline bg-surface/40 p-5 transition-colors duration-300 hover:border-accent/40"
                                >
                                    <span className="font-mono text-sm text-accent">{repo.name}</span>
                                    <span className="line-clamp-2 text-sm text-muted-foreground">
                                        {repo.description ?? 'No description provided.'}
                                    </span>
                                    <span className="mt-auto flex items-center gap-4 font-mono text-xs text-subtle">
                                        <span className="flex items-center gap-1">
                                            <Star className="size-3.5" aria-hidden="true" />
                                            {repo.stars}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork className="size-3.5" aria-hidden="true" />
                                            {repo.forks}
                                        </span>
                                        {repo.language && <span>{repo.language}</span>}
                                    </span>
                                </a>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                )}
            </Container>
        </section>
    );
}

export default GithubPanel;
