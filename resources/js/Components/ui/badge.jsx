import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors duration-200',
    {
        variants: {
            variant: {
                default: 'border-hairline bg-surface text-muted-foreground',
                accent: 'border-foreground bg-foreground text-base',
                outline: 'border-hairline-strong bg-transparent text-muted-foreground',
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
