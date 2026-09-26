import { cn } from '../../lib/utils';
import { ScrambleText } from '../reactbits/ScrambleText';
import { Reveal } from './Reveal';

/**
 * Inner-page header: mono eyebrow, oversized title, optional lead.
 * Sits below the fixed navbar.
 */
export function PageHeader({ eyebrow, title, lead, className, children }) {
    return (
        <header className={cn('relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20', className)}>
            <div aria-hidden="true" className="absolute inset-0 texture-grid opacity-50" />
            <div
                aria-hidden="true"
                className="absolute -top-24 right-0 size-[32rem] rounded-full bg-accent/8 blur-[120px]"
            />

            <div className="container-page relative">
                {eyebrow && (
                    <Reveal>
                        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
                            <ScrambleText text={eyebrow} />
                        </p>
                    </Reveal>
                )}

                <Reveal delay={0.06}>
                    <h1 className="mt-5 max-w-4xl text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] font-bold tracking-tight text-balance">
                        {title}
                    </h1>
                </Reveal>

                {lead && (
                    <Reveal delay={0.12}>
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
