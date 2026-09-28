import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names, letting later Tailwind utilities win.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Fluid type helper: clamp(min, preferred, max).
 */
export function clamp(min, preferred, max) {
    return `clamp(${min}, ${preferred}, ${max})`;
}

/**
 * Locale-aware number formatting for stat values.
 */
export function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Split a string into words, preserving spacing for animated text.
 */
export function toWords(text) {
    return text.split(' ');
}
