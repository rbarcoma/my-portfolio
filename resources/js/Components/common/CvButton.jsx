import { ArrowDownToLine, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

/**
 * CV download CTA. Download the public PDF directly without an application request.
 */
export function CvButton({ cv, className, size = 'md', label }) {
    if (!cv?.path) {
        return null;
    }

    return (
        <Button asChild size={size} className={className}>
            <a href={cv.path} download={cv.filename}>
                <ArrowDownToLine aria-hidden="true" />
                <span>{label ?? cv.label ?? 'Download CV'}</span>
            </a>
        </Button>
    );
}

/**
 * Shown instead of a live demo when a project is client-private.
 */
export function PrivateProjectNotice({ email }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-2/60 p-4 text-sm text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
            <p>
                Private client project — a walkthrough is available on request.{' '}
                <a href={'mailto:' + email} className="font-medium text-foreground underline underline-offset-4">
                    Ask for access
                </a>
                .
            </p>
        </div>
    );
}

export default CvButton;
