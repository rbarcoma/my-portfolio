import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.7rem] tracking-wider uppercase transition-colors duration-200',
    {
        variants: {
            variant: {
                default: 'border-hairline bg-surface-2 text-muted-foreground',
                accent: 'border-accent/40 bg-accent/10 text-accent',
                outline: 'border-hairline-strong text-muted-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

/**
 * @param {import('react').ComponentPropsWithoutRef<'span'> & {
 *   variant?: keyof typeof badgeVariants,
 * }} props
 */
export function Badge({ className, variant, ...props }) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
