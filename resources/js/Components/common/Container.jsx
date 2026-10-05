import { cn } from '../../lib/utils';

/**
 * Page-width rhythm with fluid gutters.
 */
export function Container({ children, className, as: Component = 'div', ...props }) {
    return (
        <Component className={cn('mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-10', className)} {...props}>
            {children}
        </Component>
    );
}

export default Container;
