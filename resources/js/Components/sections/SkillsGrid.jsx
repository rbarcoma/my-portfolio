import { ArrowRight, Database, MonitorSmartphone, Palette, ServerCog, Sparkles, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TechnologyIcon } from '../common/TechnologyIcon';

const GROUP_ICONS = {
    frontend: MonitorSmartphone,
    backend: ServerCog,
    database: Database,
    tools: Wrench,
    design: Palette,
};

const FULL_WIDTH_GROUPS = new Set(['frontend', 'tools']);

const TILE_LAYOUTS = {
    frontend: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    backend: 'grid-cols-1 sm:grid-cols-2',
    database: 'grid-cols-1 sm:grid-cols-2',
    tools: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
    design: 'grid-cols-1 sm:grid-cols-2',
};

/**
 * All disciplines are presented together so visitors can scan the full skill
 * set without changing state. The compact tile treatment intentionally keeps
 * technology marks secondary to the group hierarchy and readable labels.
 */
export function SkillsGrid({ groups }) {
    if (groups.length === 0) {
        return null;
    }

    return (
        <div role="list" aria-label="Skill disciplines" className="grid gap-4 md:grid-cols-2 sm:gap-5">
            {groups.map((group) => {
                const GroupIcon = GROUP_ICONS[group.id] ?? Sparkles;
                const titleId = `skill-group-${group.id}-title`;
                const descriptionId = `skill-group-${group.id}-description`;

                return (
                    <article
                        key={group.id}
                        role="listitem"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className={cn(
                            'rounded-card border border-hairline bg-surface p-4 text-foreground sm:p-5',
                            FULL_WIDTH_GROUPS.has(group.id) && 'md:col-span-2',
                        )}
                    >
                        <header className="flex flex-col gap-3 border-b border-hairline pb-4 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <GroupIcon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                                <h3 id={titleId} className="text-sm font-semibold tracking-tight uppercase">
                                    {group.label}
                                </h3>
                            </div>

                            <p
                                id={descriptionId}
                                className="text-sm leading-snug text-muted-foreground sm:ml-auto sm:text-right"
                            >
                                {group.description}
                            </p>

                            <ArrowRight
                                className="hidden size-4 shrink-0 text-muted-foreground sm:block"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </header>

                        <ul
                            aria-label={`${group.label} technologies`}
                            className={cn('mt-4 grid gap-2.5 sm:gap-3', TILE_LAYOUTS[group.id] ?? 'grid-cols-1 sm:grid-cols-2')}
                        >
                            {group.skills.map((skill) => (
                                <li
                                    key={skill.name}
                                    className="flex min-h-15 min-w-0 items-center gap-3 rounded-xl border border-hairline bg-base/45 px-3.5 py-3 sm:px-4"
                                >
                                    <TechnologyIcon
                                        skill={skill}
                                        className="size-6 shrink-0 brightness-0"
                                    />
                                    <span className="min-w-0 text-sm font-medium text-foreground">{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </article>
                );
            })}
        </div>
    );
}

export default SkillsGrid;
