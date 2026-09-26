import { useCallback, useRef, useState } from 'react';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

const SPARK_COUNT = 8;
const DURATION = 620;

/**
 * Click sparkles emitted at the pointer position.
 */
export function ClickSpark({ children, color = '#C6FF3E', className }) {
    const reduced = useReducedMotion();
    const finePointer = useFinePointer();
    const [sparks, setSparks] = useState([]);
    const containerRef = useRef(null);

    const onClick = useCallback(
        (event) => {
            if (reduced || !finePointer || !containerRef.current) {
                return;
            }

            const bounds = containerRef.current.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            const batch = Array.from({ length: SPARK_COUNT }, (_, index) => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 24 + Math.random() * 28;

                return {
                    id: `${Date.now()}-${index}`,
                    x,
                    y,
                    dx: Math.cos(angle) * distance,
                    dy: Math.sin(angle) * distance,
                    delay: Math.random() * 90,
                };
            });

            setSparks((current) => [...current, ...batch]);

            window.setTimeout(() => {
                setSparks((current) => current.filter((spark) => !batch.some((item) => item.id === spark.id)));
            }, DURATION + 240);
        },
        [containerRef, finePointer, reduced],
    );

    return (
        <span ref={containerRef} onClick={onClick} className={cn('relative inline-flex', className)}>
            {children}

            {sparks.map((spark) => (
                <span
                    key={spark.id}
                    aria-hidden="true"
                    className="motion-safe-only pointer-events-none absolute top-0 left-0 size-1.5 rounded-full"
                    style={{
                        background: color,
                        '--x': `${spark.x}px`,
                        '--y': `${spark.y}px`,
                        '--dx': `${spark.dx}px`,
                        '--dy': `${spark.dy}px`,
                        animation: `spark-fly ${DURATION}ms var(--ease-out-expo) ${spark.delay}ms forwards`,
                    }}
                />
            ))}
        </span>
    );
}

export default ClickSpark;
