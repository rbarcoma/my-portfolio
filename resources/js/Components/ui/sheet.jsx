import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Full-screen navigation panel on mobile, side panel on larger screens.
 */
export function Sheet({ open, onOpenChange, children, side = 'right', label = 'Menu' }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className={cn(
                        'fixed inset-0 z-50 bg-base/80 backdrop-blur-sm',
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                    )}
                />
                <DialogPrimitive.Content
                    aria-label={label}
                    className={cn(
                        'fixed z-50 flex flex-col bg-base/95 backdrop-blur-2xl transition ease-[var(--ease-out-expo)] duration-300',
                        'data-[state=open]:animate-in data-[state=closed]:animate-out',
                        side === 'right' && 'inset-y-0 right-0 w-full max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
                        side === 'left' && 'inset-y-0 left-0 w-full max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
                        side === 'top' && 'inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
                        'focus:outline-none',
                    )}
                >
                    {children}
                    <DialogPrimitive.Close
                        className="absolute top-5 right-5 rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                        aria-label="Close menu"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;
