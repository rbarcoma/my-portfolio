import { ArrowDownToLine, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { ClickSpark } from '../reactbits/ClickSpark';
import { ShinyText } from '../reactbits/ShinyText';

/**
 * CV download CTA. Download attribute keeps the browser on the page;
 * the route streams the PDF from public/ when it exists.
 */
export function CvButton({ cv, className, size = 'md', label }) {
    if (!cv?.path) {
        return null;
    }

    return (
        <ClickSpark>
            <Button asChild size={size} className={className}>
                <a href={`/cv`} download={cv.filename} data-cursor="hover">
                    <ArrowDownToLine aria-hidden="true" />
                    <ShinyText>{label ?? cv.label ?? 'Download CV'}</ShinyText>
                </a>
            </Button>
        </ClickSpark>
    );
}

/**
 * Shown instead of a live demo when a project is client-private.
 */
export function PrivateProjectNotice({ email }) {
    return (
        <div className="flex items-start gap-3 rounded-card border border-hairline bg-white/[0.02] p-5 text-sm text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <p>
                Private client project — a walkthrough is available on request.{' '}
                <a href={`mailto:${email}`} className="text-accent underline-offset-4 hover:underline">
                    Ask for access
                </a>
                .
            </p>
        </div>
    );
}

export default CvButton;
