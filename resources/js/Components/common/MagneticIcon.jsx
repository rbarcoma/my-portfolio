import { Mail } from 'lucide-react';
import { BRAND_ICONS } from './BrandIcons';
import { cn } from '../../lib/utils';

const ICONS = { ...BRAND_ICONS, mail: Mail };

/**
 * Social link with a calm, visible hover state.
 */
export function MagneticIcon({ social, className }) {
    const Icon = ICONS[social.icon] ?? Mail;
    const external = social.url?.startsWith('http');

    return (
        <a
            href={social.url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={social.label + (external ? ' (opens in a new tab)' : '')}
            className={cn(
                'inline-flex size-11 items-center justify-center rounded-xl border border-hairline text-muted-foreground transition-colors duration-200 hover:border-hairline-strong hover:bg-surface-2 hover:text-foreground',
                className,
            )}
        >
            <Icon className="size-4.5" aria-hidden="true" />
        </a>
    );
}

export default MagneticIcon;
