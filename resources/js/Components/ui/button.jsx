import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary: 'bg-foreground text-[color:var(--color-base)] hover:bg-foreground/82',
                outline: 'border border-hairline bg-surface text-foreground hover:border-hairline-strong hover:bg-surface-2',
                ghost: 'text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                link: 'text-foreground underline decoration-hairline underline-offset-4 hover:decoration-foreground',
            },
            size: {
                sm: 'h-9 px-4 text-sm [&_svg]:size-4',
                md: 'h-11 px-5 text-sm [&_svg]:size-4',
                lg: 'h-12 px-6 text-base [&_svg]:size-4',
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
