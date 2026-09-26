import { useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Pointer-following spotlight border. Pure CSS custom properties, no
 * animation loop, so it stays cheap on long pages.
 */
export function SpotlightCard({ children, className, spotlightColor = 'rgba(198, 255, 62, 0.14)', ...props }) {
    const ref = useRef(null);

    const onPointerMove = (event) => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const bounds = element.getBoundingClientRect();

        element.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
        element.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
    };

    return (
        <div
            ref={ref}
            onPointerMove={onPointerMove}
            className={cn(
                'group relative overflow-hidden rounded-card border border-hairline bg-surface/50 p-8 transition-colors duration-300 hover:border-hairline-strong',
                className,
            )}
            style={{ '--spotlight': spotlightColor }}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        'radial-gradient(320px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight), transparent 70%)',
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}

export default SpotlightCard;
