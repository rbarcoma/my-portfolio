import { Braces, Database, Network, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

function CanvaIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="5" fill="#00C4CC" />
            <path
                fill="#fff"
                d="M16.73 7.25a6.6 6.6 0 0 0-4.9-2.15C8.04 5.1 5 8.1 5 12s3.04 6.9 6.83 6.9c2.2 0 4.12-1.08 5.15-2.68l-2.15-1.24a4.1 4.1 0 0 1-3 1.34 4.31 4.31 0 1 1 3-7.3l1.9-1.77Z"
            />
        </svg>
    );
}

const GENERIC_ICONS = {
    canva: CanvaIcon,
    database: Database,
    network: Network,
    palette: Palette,
};

const THEME_AWARE_ICONS = new Set(['github', 'shadcnui']);

/**
 * A technology mark with a local Lucide fallback for unbranded concepts or
 * an unavailable brand asset. The visible card label provides its accessible name.
 */
export function TechnologyIcon({ skill, className }) {
    const GenericIcon = GENERIC_ICONS[skill.icon] ?? Braces;
    const isGeneric = skill.icon in GENERIC_ICONS;
    const themeAware = THEME_AWARE_ICONS.has(skill.icon);

    return (
        <span
            aria-hidden="true"
            className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
        >
            <GenericIcon
                className={cn('size-full', themeAware && 'text-foreground')}
                strokeWidth={1.65}
                style={themeAware ? undefined : { color: `#${skill.color}` }}
            />

            {!isGeneric && (
                <img
                    src={`https://cdn.simpleicons.org/${skill.icon}/${skill.color}`}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        'absolute inset-0 h-full w-full object-contain',
                    )}
                    onError={(event) => {
                        event.currentTarget.style.display = 'none';
                    }}
                />
            )}
        </span>
    );
}

export default TechnologyIcon;
