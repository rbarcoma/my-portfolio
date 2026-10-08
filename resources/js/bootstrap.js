import { router } from '@inertiajs/react';

/**
 * Inertia route-load progress bar (2px, accent) — shown only when a visit
 * takes longer than ~120ms so fast navigations never flash it.
 */
const ID = 'inertia-progress';

function bar() {
    let element = document.getElementById(ID);

    if (!element) {
        element = document.createElement('div');
        element.id = ID;
        element.setAttribute('aria-hidden', 'true');
        element.style.cssText = [
            'position:fixed',
            'top:0',
            'left:0',
            'height:2px',
            'width:100%',
            'transform:scaleX(0)',
            'transform-origin:left',
            'background:var(--color-accent)',
            'z-index:60',
            'pointer-events:none',
            'transition:transform 200ms cubic-bezier(0.16,1,0.3,1), opacity 250ms ease',
        ].join(';');
        document.body.appendChild(element);
    }

    return element;
}

let startTimer = null;
let progress = 0;

function show() {
    const element = bar();

    element.style.opacity = '1';
    element.style.transform = 'scaleX(0.02)';
}

function set(value) {
    const element = bar();

    progress = Math.max(progress, value);
    element.style.transform = `scaleX(${Math.min(progress, 0.95)})`;
}

function finish() {
    window.clearTimeout(startTimer);
    startTimer = null;

    const element = bar();

    progress = 0;
    element.style.transform = 'scaleX(1)';
    element.style.opacity = '0';
}

router.on('start', () => {
    window.clearTimeout(startTimer);
    startTimer = window.setTimeout(show, 120);
});

router.on('progress', (event) => {
    const percentage = event.detail?.progress?.percentage;

    if (typeof percentage === 'number') {
        set(percentage / 100);
    }
});

router.on('finish', finish);
router.on('cancel', finish);
