import { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { contributionIntensity, recentWeeks } from '../../lib/contributions';
import { Container } from '../common/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { Tooltip } from '../ui/tooltip';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The upstream sends every year on record; a profile only ever shows one. */
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
                                    className={`size-3 rounded-[2px] ${contributionIntensity(count)}`}
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

/**
 * GitHub activity: contribution heatmap and language breakdown.
 * Renders a calm fallback when the API is unavailable.
 */
export function GithubPanel({ github, compact = false }) {
    if (!github?.available) {
        return null;
    }

    const { profile, languages, contributions } = github;

    return (
        <section className={compact ? 'border-t border-hairline bg-surface/20 py-20' : 'section-pad'}>
            <Container>
                <SectionHeading
                    index={compact ? undefined : 3}
                    label="Open source"
                    title={compact ? 'GitHub activity' : 'What I build in the open.'}
                />

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
            </Container>
        </section>
    );
}

export default GithubPanel;
