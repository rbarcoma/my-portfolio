import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-[var(--ease-out-expo)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-accent text-base hover:bg-accent-soft shadow-[0_0_0_0_rgba(198,255,62,0.4)] hover:shadow-[0_0_32px_-6px_rgba(198,255,62,0.65)]',
                outline:
                    'border border-hairline-strong bg-transparent text-foreground hover:border-accent/60 hover:bg-accent/5',
                ghost: 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
                link: 'text-accent underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-9 px-4 text-sm [&_svg]:size-4',
                md: 'h-11 px-6 text-sm [&_svg]:size-4',
                lg: 'h-13 px-8 text-base [&_svg]:size-5',
                icon: 'size-11 [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

/**
 * @param {import('react').ComponentPropsWithoutRef<'button'> & {
 *   variant?: keyof typeof buttonVariants,
 *   size?: keyof typeof buttonVariants,
 *   asChild?: boolean,
 * }} props
 */
export function Button({ className, variant, size, asChild = false, ...props }) {
    const Component = asChild ? Slot : 'button';

    return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
