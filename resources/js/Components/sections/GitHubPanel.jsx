import { useMemo } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { contributionIntensity, recentWeeks } from '../../lib/contributions';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { Tooltip } from '../ui/tooltip';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const VISIBLE_WEEKS = 53;

function Heatmap({ weeks }) {
    const grid = useMemo(
        () =>
            recentWeeks(weeks, VISIBLE_WEEKS).map((counts) =>
                Array.from({ length: 7 }, (_, day) => counts[day] ?? 0),
            ),
        [weeks],
    );

    if (grid.length === 0) {
        return <p className="text-sm text-muted-foreground">Contribution data is not available right now.</p>;
    }

    return (
        <div className="overflow-x-auto pb-2">
            <div className="w-max">
                <div className="flex gap-[3px]">
                    {grid.map((counts, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-[3px]">
                            {counts.map((count, dayIndex) => (
                                <Tooltip
                                    key={weekIndex + '-' + dayIndex}
                                    content={count + ' contribution' + (count === 1 ? '' : 's')}
                                >
                                    <span
                                        className={'size-3 rounded-[2px] ' + contributionIntensity(count)}
                                        role="img"
                                        aria-label={DAY_LABELS[dayIndex] + ': ' + count + ' contributions'}
                                    />
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Legend() {
    return (
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 3, 6, 10].map((count) => (
                <span
                    key={count}
                    aria-hidden="true"
                    className={'size-3 rounded-[2px] ' + contributionIntensity(count)}
                />
            ))}
            <span>More</span>
        </div>
    );
}

function Metric({ value, label }) {
    return (
        <div>
            <p className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">{value ?? '—'}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
    );
}

function GithubContent({ github, compact, embedded }) {
    const { profile, languages = [], contributions } = github;
    const profileUrl = profile?.url ?? 'https://github.com/' + github.username;

    return (
        <>
            {embedded ? (
                <Reveal>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="eyebrow">GitHub activity</p>
                            <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.25rem)] leading-[0.98] font-semibold">
                                Contributions in the open.
                            </h2>
                        </div>
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 self-start rounded-full bg-foreground px-5 py-3 text-sm font-medium text-base transition-colors hover:bg-foreground/80 sm:self-auto"
                        >
                            View GitHub
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                    </div>
                </Reveal>
            ) : (
                <SectionHeading
                    label="Open source"
                    title={compact ? 'GitHub activity' : 'What I build in the open.'}
                />
            )}

            <Reveal className={embedded ? 'mt-9' : 'mt-7'}>
                <div className="overflow-hidden rounded-card border border-hairline bg-surface">
                    <div className="grid lg:grid-cols-12">
                        <div className="p-5 sm:p-7 lg:col-span-8">
                            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium">Contribution graph</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {contributions?.this_year ?? 0} contributions this year
                                    </p>
                                </div>
                                <a
                                    href={profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    @{profile?.login ?? github.username}
                                    <ExternalLink className="size-3.5" aria-hidden="true" />
                                </a>
                            </div>
                            {contributions?.weeks?.length > 0 ? <Heatmap weeks={contributions.weeks} /> : <Heatmap weeks={[]} />}
                            {contributions?.weeks?.length > 0 && <Legend />}
                        </div>

                        <div className="grid grid-cols-3 gap-5 border-t border-hairline p-5 sm:p-7 lg:col-span-4 lg:grid-cols-1 lg:border-t-0 lg:border-l">
                            <Metric value={contributions?.this_year ?? contributions?.total} label="Contributions" />
                            <Metric value={profile?.public_repos} label="Repositories" />
                            <Metric value={languages.length} label="Languages" />
                        </div>
                    </div>

                    {languages.length > 0 && (
                        <div className="border-t border-hairline px-5 py-4 sm:px-7">
                            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                {languages.slice(0, 5).map((language) => (
                                    <li key={language.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
                                        {language.name}
                                        <span className="text-subtle">{language.percentage}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Reveal>
        </>
    );
}

export function GithubPanel({ github, compact = false, embedded = false }) {
    if (!github?.available) {
        return null;
    }

    const content = <GithubContent github={github} compact={compact} embedded={embedded} />;

    if (embedded) {
        return <section className="mt-18 border-t border-hairline pt-16 sm:mt-24 sm:pt-20">{content}</section>;
    }

    return (
        <section className={compact ? 'border-t border-hairline bg-surface py-20' : 'section-pad'}>
            <Container>{content}</Container>
        </section>
    );
}

export default GithubPanel;
