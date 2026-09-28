import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { RevealGroup, RevealItem } from '../common/Reveal';
import { TechnologyIcon } from '../common/TechnologyIcon';
import { SpotlightCard } from '../reactbits/SpotlightCard';

/**
 * Skill group tabs + technology marks.
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

    return (
        <div>
            <div
                role="tablist"
                aria-label="Skill categories"
                className="flex flex-wrap gap-2 border-b border-hairline pb-6"
            >
                {groups.map((group) => {
                    const selected = group.id === activeGroup.id;

                    return (
                        <button
                            key={group.id}
                            type="button"
                            role="tab"
                            id={`skills-tab-${group.id}`}
                            aria-selected={selected}
                            aria-controls="skills-panel"
                            onClick={() => setActive(group.id)}
                            data-cursor="hover"
                            className={cn(
                                'relative rounded-full px-5 py-2.5 text-sm transition-colors duration-200',
                                selected ? 'text-base' : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {selected && (
                                <motion.span
                                    layoutId="skills-tab"
                                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                />
                            )}
                            {group.label}
                        </button>
                    );
                })}
            </div>

            <motion.div
                key={activeGroup.id}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                role="tabpanel"
                id="skills-panel"
                aria-labelledby={`skills-tab-${activeGroup.id}`}
                className="mt-10"
            >
                <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" stagger={0.06}>
                    {activeGroup.skills.map((skill) => (
                        <RevealItem key={skill.name} y={16}>
                            <SpotlightCard className="flex aspect-square items-center justify-center p-5 sm:p-6">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <TechnologyIcon skill={skill} className="size-12 sm:size-14" />
                                    <h3 className="font-display text-sm text-foreground sm:text-base">{skill.name}</h3>
                                </div>
                            </SpotlightCard>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </motion.div>
        </div>
    );
}

export default SkillsGrid;
