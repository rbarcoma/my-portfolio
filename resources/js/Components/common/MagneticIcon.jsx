import { Mail } from 'lucide-react';
import { Magnet } from '../reactbits/Magnet';
import { BRAND_ICONS } from './BrandIcons';
import { cn } from '../../lib/utils';

const ICONS = { ...BRAND_ICONS, mail: Mail };

/**
 * Social link with a magnetic pull. Opens external links safely.
 */
export function MagneticIcon({ social, className }) {
    const Icon = ICONS[social.icon] ?? Mail;
    const external = social.url?.startsWith('http');

    return (
        <Magnet>
            <a
                href={social.url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={`${social.label}${external ? ' (opens in a new tab)' : ''}`}
                data-cursor="hover"
                className={cn(
                    'inline-flex size-12 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors duration-200 hover:border-accent/50 hover:text-accent',
                    className,
                )}
            >
                <Icon className="size-5" aria-hidden="true" />
            </a>
        </Magnet>
    );
}

export default MagneticIcon;
