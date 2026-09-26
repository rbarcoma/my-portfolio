import { cn } from '../../lib/utils';

/**
 * Light sweep across label text — used on the CV button (dark text on accent).
 */
export function ShinyText({ children, className, duration = 3.4 }) {
    return (
        <span className={cn('relative inline-flex overflow-hidden', className)}>
            <span
                aria-hidden="true"
                className="motion-safe-only bg-clip-text text-transparent"
                style={{
                    backgroundImage:
                        'linear-gradient(110deg, currentColor 42%, rgba(255,255,255,0.65) 50%, currentColor 58%)',
                    backgroundSize: '220% 100%',
                    animation: `shiny-sweep ${duration}s linear infinite`,
                }}
            >
                {children}
            </span>
            <span className="sr-only">{children}</span>
        </span>
    );
}

export default ShinyText;
