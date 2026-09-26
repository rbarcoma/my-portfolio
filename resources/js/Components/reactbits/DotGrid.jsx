import { cn } from '../../lib/utils';

/**
 * Ambient hero background: dot grid + radial accent glows.
 * Pure CSS/SVG — no WebGL — so it costs nothing on the main bundle.
 */
export function DotGrid({ className, glow = true, fade = true }) {
    return (
        <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
            {glow && (
                <>
                    <div className="absolute -top-40 -left-20 size-[38rem] rounded-full bg-accent/12 blur-[130px]" />
                    <div className="absolute top-1/3 -right-32 size-[34rem] rounded-full bg-secondary/10 blur-[140px]" />
                </>
            )}

            <div
                className={cn(
                    'absolute inset-0 texture-grid',
                    fade && '[mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_72%)]',
                )}
            />

            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        'radial-gradient(rgba(198,255,62,0.5) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)',
                }}
            />
        </div>
    );
}

export default DotGrid;
