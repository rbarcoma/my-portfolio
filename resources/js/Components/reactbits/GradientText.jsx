import { cn } from '../../lib/utils';

/**
 * Accent gradient text used to highlight one word in a headline.
 */
export function GradientText({ children, className }) {
    return (
        <span
            className={cn(
                'bg-gradient-to-r from-accent via-accent to-secondary bg-clip-text text-transparent',
                className,
            )}
        >
            {children}
        </span>
    );
}

export default GradientText;
