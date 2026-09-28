import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { RevealGroup, RevealItem } from '../common/Reveal';
import { TechnologyIcon } from '../common/TechnologyIcon';

/**
 * A responsive discipline selector with an unboxed technology logo field.
 */
export function SkillsGrid({ groups }) {
    const reduced = useReducedMotion();
    const [active, setActive] = useState(groups[0]?.id);

    const activeGroup = useMemo(
        () => groups.find((group) => group.id === active) ?? groups[0],
        [active, groups],
    );

    if (!activeGroup) {
        return null;
    }

    const selectGroup = (groupId) => setActive(groupId);

    return (
        <div className="grid gap-10 lg:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.7fr)] lg:gap-14">
            <ul aria-label="Skill disciplines" className="flex flex-col gap-1">
                {groups.map((group) => {
                    const selected = group.id === activeGroup.id;

                    return (
                        <li key={group.id}>
                            <button
                                type="button"
                                aria-pressed={selected}
                                onClick={() => selectGroup(group.id)}
                                onFocus={() => selectGroup(group.id)}
                                onPointerEnter={(event) => {
                                    if (event.pointerType === 'mouse') {
                                        selectGroup(group.id);
                                    }
                                }}
                                data-cursor="hover"
                                className={cn(
                                    'group relative w-full py-1 pl-5 text-left font-display text-[clamp(1.9rem,5vw,4rem)] leading-[0.95] font-bold uppercase transition-colors duration-200',
                                    selected
                                        ? 'text-foreground'
                                        : 'text-subtle hover:text-muted-foreground focus-visible:text-foreground',
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full transition-opacity duration-200',
                                        selected ? 'bg-accent opacity-100' : 'bg-hairline opacity-0 group-hover:opacity-100',
                                    )}
                                />
                                {group.label}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <motion.div
                key={activeGroup.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                role="region"
                aria-label={`${activeGroup.label} technologies`}
                aria-live="polite"
                className="border-t border-hairline pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14"
            >
                <div className="flex gap-4">
                    <ArrowUpRight className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                    <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        {activeGroup.description}
                    </p>
                </div>

                <RevealGroup
                    key={activeGroup.id}
                    role="list"
                    className="mt-10 grid grid-cols-3 gap-x-5 gap-y-9 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7"
                    stagger={0.05}
                >
                    {activeGroup.skills.map((skill) => (
                        <RevealItem key={skill.name} role="listitem" y={16}>
                            <div className="flex min-w-0 flex-col items-center gap-3 text-center">
                                <TechnologyIcon skill={skill} className="size-11 sm:size-12" />
                                <p className="text-sm leading-snug text-muted-foreground">{skill.name}</p>
                            </div>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </motion.div>
        </div>
    );
}

export default SkillsGrid;
