import { cn } from '../../lib/utils';

const fieldClasses =
    'w-full rounded-xl border border-hairline bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors duration-200 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/20 disabled:opacity-50 aria-[invalid=true]:border-red-400/60';

export function Input({ className, type = 'text', ...props }) {
    return <input type={type} className={cn(fieldClasses, 'h-12', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
    return <textarea className={cn(fieldClasses, 'min-h-36 resize-y leading-relaxed', className)} {...props} />;
}

export function Label({ className, ...props }) {
    return (
        <label
            className={cn('block font-mono text-xs tracking-wider text-muted-foreground uppercase', className)}
            {...props}
        />
    );
}

export function FieldError({ children, id }) {
    if (!children) {
        return null;
    }

    return (
        <p id={id} className="mt-1.5 text-xs text-red-400" role="alert">
            {children}
        </p>
    );
}
