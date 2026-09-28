import { cn } from '../../lib/utils';
import { Reveal } from './Reveal';

/**
 * Mono section label + display heading + optional lead.
 */
export function SectionHeading({ label, title, lead, align = 'left', className, children }) {
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
                    <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">{label}</p>
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
