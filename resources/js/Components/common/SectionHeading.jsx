import { cn } from '../../lib/utils';
import { sectionIndex } from '../../lib/utils';
import { Reveal } from './Reveal';

/**
 * Mono section label (`01 — ABOUT`) + display heading + optional lead.
 */
export function SectionHeading({ index, label, title, lead, align = 'left', className, children }) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4',
                align === 'center' && 'items-center text-center',
                className,
            )}
        >
            {label !== undefined && (
                <Reveal>
                    <p className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-accent uppercase">
                        {index !== undefined && <span className="text-subtle">{sectionIndex(index)}</span>}
                        <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
                        {label}
                    </p>
                </Reveal>
            )}

            {title && (
                <Reveal delay={0.05}>
                    <h2 className="max-w-3xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] text-balance">
                        {title}
                    </h2>
                </Reveal>
            )}

            {lead && (
                <Reveal delay={0.1}>
                    <p
                        className={cn(
                            'max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg',
                            align === 'center' && 'mx-auto',
                        )}
                    >
                        {lead}
                    </p>
                </Reveal>
            )}

            {children}
        </div>
    );
}

export default SectionHeading;
