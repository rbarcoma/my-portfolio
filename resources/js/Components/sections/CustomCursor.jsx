import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useFinePointer } from '../../hooks/useMediaQuery';

/**
 * Custom cursor: 8px dot + trailing ring, morphing to a label pill over
 * `[data-cursor="label"]` targets. Only runs on fine pointers and never
 * hides the native caret over text inputs.
 */
export function CustomCursor() {
    const reduced = useReducedMotion();
    const finePointer = useFinePointer();
    const enabled = finePointer && !reduced;

    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const [mode, setMode] = useState('default');
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ring = { ...target };
        let frame = null;

        const onMove = (event) => {
            target.x = event.clientX;
            target.y = event.clientY;

            const element = event.target instanceof Element ? event.target : null;
            const interactive = element?.closest('[data-cursor], a, button, [role="button"], input, textarea, select');

            if (!interactive || element?.closest('input, textarea, select')) {
                setMode('default');
                setLabel('');

                return;
            }

            const cursor = interactive.getAttribute('data-cursor');

            if (cursor === 'label') {
                setMode('label');
                setLabel(interactive.getAttribute('data-cursor-label') ?? 'Open');

                return;
            }

            setMode('hover');
            setLabel('');
        };

        const onLeave = () => {
            if (dotRef.current) {
                dotRef.current.style.opacity = '0';
            }

            if (ringRef.current) {
                ringRef.current.style.opacity = '0';
            }
        };

        const onEnter = () => {
            if (dotRef.current) {
                dotRef.current.style.opacity = '1';
            }

            if (ringRef.current) {
                ringRef.current.style.opacity = '1';
            }
        };

        const render = () => {
            ring.x += (target.x - ring.x) * 0.15;
            ring.y += (target.y - ring.y) * 0.15;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
            }

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
            }

            frame = window.requestAnimationFrame(render);
        };

        window.addEventListener('pointermove', onMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onLeave);
        document.documentElement.addEventListener('pointerenter', onEnter);
        frame = window.requestAnimationFrame(render);

        return () => {
            window.removeEventListener('pointermove', onMove);
            document.documentElement.removeEventListener('pointerleave', onLeave);
            document.documentElement.removeEventListener('pointerenter', onEnter);
            window.cancelAnimationFrame(frame);
        };
    }, [enabled]);

    if (!enabled) {
        return null;
    }

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden lg:block">
            <div
                ref={dotRef}
                className="absolute top-0 left-0 size-2 rounded-full bg-accent mix-blend-difference"
                style={{ transition: 'opacity 200ms ease' }}
            />
            <div
                ref={ringRef}
                className={`absolute top-0 left-0 flex items-center justify-center rounded-full border border-accent/70 font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase transition-[width,height,background-color,border-color] duration-200 ease-[var(--ease-out-expo)] ${
                    mode === 'label'
                        ? 'h-16 w-24 border-accent bg-accent/10 backdrop-blur-sm'
                        : mode === 'hover'
                          ? 'size-9'
                          : 'size-8'
                }`}
            >
                {mode === 'label' && label}
            </div>
        </div>
    );
}

export default CustomCursor;
