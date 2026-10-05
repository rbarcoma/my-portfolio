import { cn } from '../../lib/utils';
import { Reveal } from './Reveal';

/**
 * Section label + display heading + optional lead.
 */
export function SectionHeading({ label, title, lead, align = 'left', className, children }) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3',
                align === 'center' && 'items-center text-center',
                className,
            )}
        >
            {label !== undefined && (
                <Reveal y={8} duration={0.35}>
                    <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
                        <span aria-hidden="true" className="h-px w-8 bg-zinc-300" />
                        <p className="text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase">{label}</p>
                    </div>
                </Reveal>
            )}

            {title && (
                <Reveal delay={0.04} y={8} duration={0.35}>
                    <h2
                        className={cn(
                            'max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] font-bold tracking-tight text-balance text-zinc-950',
                            align === 'center' && 'mx-auto',
                        )}
                    >
                        {title}
                    </h2>
                </Reveal>
            )}

            {lead && (
                <Reveal delay={0.08} y={8} duration={0.35}>
                    <p
                        className={cn(
                            'max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg',
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
