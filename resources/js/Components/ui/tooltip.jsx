import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export function TooltipProvider({ children, delayDuration = 120 }) {
    return (
        <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={400}>
            {children}
        </TooltipPrimitive.Provider>
    );
}

/**
 * @param {import('react').ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> & {
 *   content: import('react').ReactNode,
 * }} props
 */
export function Tooltip({ content, children, ...props }) {
    return (
        <TooltipPrimitive.Root {...props}>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    sideOffset={8}
                    className={cn(
                        'z-50 rounded-lg border border-hairline bg-elevated px-3 py-1.5 font-mono text-[0.7rem] tracking-wide text-foreground',
                        'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-elevated" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}
