import { cn } from '../../lib/utils';

/**
 * Page-width rhythm: max-w-7xl with fluid gutters.
 */
export function Container({ children, className, as: Component = 'div', ...props }) {
    return (
        <Component className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)} {...props}>
            {children}
        </Component>
    );
}

export default Container;
