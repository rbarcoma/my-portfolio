import { createInertiaApp } from '@inertiajs/react';
import RootLayout from './Layouts/RootLayout';
import './bootstrap';

const SITE_TITLE = 'Renante Barcoma | Full-Stack Developer';

/**
 * Inertia + React entry point. Page components are resolved and code-split by
 * the @inertiajs/vite plugin (resources/js/Pages/**). RootLayout is the
 * persistent shell: it stays mounted across visits, so only <main> swaps.
 */
createInertiaApp({
    title: () => SITE_TITLE,
    layout: () => RootLayout,
});
