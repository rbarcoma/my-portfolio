import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import { SpotlightCard } from '../reactbits/SpotlightCard';

/**
 * Skill group tabs + proficiency bars.
 */
export function SkillsGrid({ groups }) {
    const reduced = useReducedMotion();
    const [active, setActive] = useState(groups[0]?.id);

    const activeGroup = useMemo(
        () => groups.find((group) => group.id === active) ?? groups[0],
        [active, groups],
    );

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
                            aria-selected={selected}
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
                className="mt-10 grid gap-4 sm:grid-cols-2"
            >
                {activeGroup.skills.map((skill, index) => (
                    <SpotlightCard key={skill.name} className="p-6">
                        <div className="flex items-baseline justify-between gap-4">
                            <h3 className="font-display text-lg">{skill.name}</h3>
                            <span className="font-mono text-xs text-subtle tabular-nums">
                                {skill.level}%
                            </span>
                        </div>

                        <div
                            className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/8"
                            role="img"
                            aria-label={`${skill.name} proficiency ${skill.level} percent`}
                        >
                            <motion.div
                                className="h-full rounded-full bg-accent"
                                initial={reduced ? { width: `${skill.level}%` } : { width: '0%' }}
                                whileInView={{ width: `${skill.level}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                    </SpotlightCard>
                ))}
            </motion.div>
        </div>
    );
}

export default SkillsGrid;
