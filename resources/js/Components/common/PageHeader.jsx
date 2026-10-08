import { cn } from '../../lib/utils';
import { Reveal } from './Reveal';

/**
 * Inner-page header: quiet eyebrow, oversized title, optional lead.
 * Sits below the fixed navbar.
 */
export function PageHeader({ eyebrow, title, lead, className, children }) {
    return (
        <header className={cn('border-b border-hairline bg-surface pt-28 pb-14 sm:pt-32 sm:pb-16', className)}>
            <div className="container-page">
                {eyebrow && (
                    <Reveal y={8} duration={0.35}>
                        <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="h-px w-8 bg-hairline-strong" />
                            <p className="text-xs font-medium tracking-[0.16em] text-subtle uppercase">{eyebrow}</p>
                        </div>
                    </Reveal>
                )}

                <Reveal delay={0.04} y={8} duration={0.35}>
                    <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] font-bold tracking-tight text-balance text-foreground">
                        {title}
                    </h1>
                </Reveal>

                {lead && (
                    <Reveal delay={0.08} y={8} duration={0.35}>
                        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {lead}
                        </p>
                    </Reveal>
                )}

                {children}
            </div>
        </header>
    );
}

export default PageHeader;
