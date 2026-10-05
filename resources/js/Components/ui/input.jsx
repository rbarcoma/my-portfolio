import { cn } from '../../lib/utils';

const fieldClasses =
    'w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors duration-200 outline-none focus:border-foreground focus:ring-3 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500/55';

export function Input({ className, type = 'text', ...props }) {
    return <input type={type} className={cn(fieldClasses, 'h-12', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
    return <textarea className={cn(fieldClasses, 'min-h-36 resize-y leading-relaxed', className)} {...props} />;
}

export function Label({ className, ...props }) {
    return <label className={cn('block text-sm font-medium text-foreground', className)} {...props} />;
}

export function FieldError({ children, id }) {
    if (!children) {
        return null;
    }

    return (
        <p id={id} className="mt-1.5 text-xs text-red-600" role="alert">
            {children}
        </p>
    );
}
