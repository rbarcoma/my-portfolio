import { useEffect, useRef } from 'react';
import { useFinePointer } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import './CursorGrid.css';

const FALL_OFF_CURVES = {
    linear: (value) => value,
    smooth: (value) => value * value * (3 - 2 * value),
    sharp: (value) => value * value * value,
};

const DEFAULT_COLOR = '#C6FF3E';

function resolveColor(color, element) {
    const variable = color.match(/^var\(\s*(--[^,\s)]+).*\)$/)?.[1];

    if (!variable) {
        return color;
    }

    return window.getComputedStyle(element).getPropertyValue(variable).trim() || DEFAULT_COLOR;
}

function hexToRgb(color, element) {
    const hex = resolveColor(color, element).replace('#', '');
    const value = hex.length === 3 ? hex.split('').map((character) => character + character).join('') : hex;

    if (!/^[0-9a-f]{6}$/i.test(value)) {
        return [198, 255, 62];
    }

    const integer = Number.parseInt(value, 16);

    return [(integer >> 16) & 255, (integer >> 8) & 255, integer & 255];
}

/**
 * Decorative canvas lattice that lights up around the cursor.
 *
 * Pointer events are observed from the window rather than captured by the
 * canvas, keeping links and controls above it fully interactive.
 */
export function CursorGrid({
    cellSize = 70,
    color = DEFAULT_COLOR,
    radius = 140,
    falloff = 'smooth',
    holdTime = 400,
    fadeDuration = 800,
    lineWidth = 1.2,
    maxOpacity = 1,
    fillOpacity = 0,
    gridOpacity = 0,
    cellRadius = 0,
    clickPulse = true,
    pulseSpeed = 600,
    className,
}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const propsRef = useRef({});
    const wakeRef = useRef(null);
    const reduced = useReducedMotion();
    const finePointer = useFinePointer();
    const interactive = finePointer && !reduced;

    propsRef.current = {
        cellSize,
        color,
        radius,
        falloff,
        holdTime,
        fadeDuration,
        lineWidth,
        maxOpacity,
        fillOpacity,
        gridOpacity,
        cellRadius,
        clickPulse,
        pulseSpeed,
    };

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) {
            return undefined;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return undefined;
        }

        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        let columns = 0;
        let rows = 0;
        let offsetX = 0;
        let offsetY = 0;
        let alphas = new Float32Array(0);
        let touched = new Float64Array(0);
        let width = 0;
        let height = 0;
        const pulses = [];
        let animationFrame = 0;
        let running = false;
        let lastFrame = 0;

        const rebuild = () => {
            const properties = propsRef.current;

            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = Math.max(1, Math.round(width * devicePixelRatio));
            canvas.height = Math.max(1, Math.round(height * devicePixelRatio));
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            columns = Math.ceil(width / properties.cellSize) + 1;
            rows = Math.ceil(height / properties.cellSize) + 1;
            offsetX = (width - columns * properties.cellSize) / 2;
            offsetY = (height - rows * properties.cellSize) / 2;
            alphas = new Float32Array(columns * rows);
            touched = new Float64Array(columns * rows);
            pulses.length = 0;
        };

        const cellCenter = (index) => {
            const properties = propsRef.current;
            const x = offsetX + (index % columns) * properties.cellSize + properties.cellSize / 2;
            const y = offsetY + Math.floor(index / columns) * properties.cellSize + properties.cellSize / 2;

            return [x, y];
        };

        const energize = (x, y, boost = 1) => {
            const properties = propsRef.current;
            const effectiveRadius = Math.max(properties.radius, 1);
            const falloffCurve = FALL_OFF_CURVES[properties.falloff] ?? FALL_OFF_CURVES.linear;
            const now = performance.now();
            const minimumColumn = Math.max(0, Math.floor((x - effectiveRadius - offsetX) / properties.cellSize));
            const maximumColumn = Math.min(
                columns - 1,
                Math.floor((x + effectiveRadius - offsetX) / properties.cellSize),
            );
            const minimumRow = Math.max(0, Math.floor((y - effectiveRadius - offsetY) / properties.cellSize));
            const maximumRow = Math.min(rows - 1, Math.floor((y + effectiveRadius - offsetY) / properties.cellSize));

            for (let row = minimumRow; row <= maximumRow; row += 1) {
                for (let column = minimumColumn; column <= maximumColumn; column += 1) {
                    const index = row * columns + column;
                    const [centerX, centerY] = cellCenter(index);
                    const distance = Math.hypot(centerX - x, centerY - y);

                    if (distance > effectiveRadius) {
                        continue;
                    }

                    const opacity = falloffCurve(1 - distance / effectiveRadius) * properties.maxOpacity * boost;

                    if (opacity > alphas[index]) {
                        alphas[index] = opacity;
                    }

                    if (opacity > 0) {
                        touched[index] = now;
                    }
                }
            }
        };

        const draw = (now) => {
            const properties = propsRef.current;
            const deltaTime = Math.min(now - lastFrame, 50);
            const [red, green, blue] = hexToRgb(properties.color, container);

            lastFrame = now;
            context.clearRect(0, 0, width, height);

            if (properties.gridOpacity > 0) {
                context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${properties.gridOpacity})`;
                context.lineWidth = 1;
                context.beginPath();

                for (let column = 0; column <= columns; column += 1) {
                    const x = Math.round(offsetX + column * properties.cellSize) + 0.5;
                    context.moveTo(x, 0);
                    context.lineTo(x, height);
                }

                for (let row = 0; row <= rows; row += 1) {
                    const y = Math.round(offsetY + row * properties.cellSize) + 0.5;
                    context.moveTo(0, y);
                    context.lineTo(width, y);
                }

                context.stroke();
            }

            for (let pulseIndex = pulses.length - 1; pulseIndex >= 0; pulseIndex -= 1) {
                const pulse = pulses[pulseIndex];
                const age = (now - pulse.startedAt) / 1000;
                const ringRadius = age * properties.pulseSpeed;

                if (ringRadius > Math.hypot(width, height)) {
                    pulses.splice(pulseIndex, 1);
                    continue;
                }

                const band = properties.cellSize;
                const minimumColumn = Math.max(0, Math.floor((pulse.x - ringRadius - band - offsetX) / properties.cellSize));
                const maximumColumn = Math.min(
                    columns - 1,
                    Math.floor((pulse.x + ringRadius + band - offsetX) / properties.cellSize),
                );
                const minimumRow = Math.max(0, Math.floor((pulse.y - ringRadius - band - offsetY) / properties.cellSize));
                const maximumRow = Math.min(
                    rows - 1,
                    Math.floor((pulse.y + ringRadius + band - offsetY) / properties.cellSize),
                );

                for (let row = minimumRow; row <= maximumRow; row += 1) {
                    for (let column = minimumColumn; column <= maximumColumn; column += 1) {
                        const index = row * columns + column;
                        const [centerX, centerY] = cellCenter(index);
                        const distance = Math.hypot(centerX - pulse.x, centerY - pulse.y);

                        if (Math.abs(distance - ringRadius) < band / 2 && properties.maxOpacity > alphas[index]) {
                            alphas[index] = properties.maxOpacity;
                            touched[index] = now;
                        }
                    }
                }
            }

            let hasVisibleCells = pulses.length > 0;
            const fadeStep = deltaTime / Math.max(properties.fadeDuration, 16);
            const halfCell = properties.cellSize / 2;

            for (let index = 0; index < alphas.length; index += 1) {
                let opacity = alphas[index];

                if (opacity <= 0) {
                    continue;
                }

                if (now - touched[index] > properties.holdTime) {
                    opacity = Math.max(0, opacity - fadeStep);
                    alphas[index] = opacity;
                }

                if (opacity <= 0) {
                    continue;
                }

                hasVisibleCells = true;

                const [centerX, centerY] = cellCenter(index);
                const gradient = context.createRadialGradient(
                    centerX,
                    centerY,
                    halfCell * 0.1,
                    centerX,
                    centerY,
                    properties.cellSize,
                );
                gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${opacity})`);
                gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);

                const x = centerX - halfCell + 0.5;
                const y = centerY - halfCell + 0.5;
                const size = properties.cellSize - 1;

                context.beginPath();

                if (properties.cellRadius > 0 && typeof context.roundRect === 'function') {
                    context.roundRect(x, y, size, size, properties.cellRadius);
                } else {
                    context.rect(x, y, size, size);
                }

                if (properties.fillOpacity > 0) {
                    context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity * properties.fillOpacity})`;
                    context.fill();
                }

                context.strokeStyle = gradient;
                context.lineWidth = properties.lineWidth;
                context.stroke();
            }

            if (hasVisibleCells) {
                animationFrame = window.requestAnimationFrame(draw);
                return;
            }

            running = false;
        };

        const wake = () => {
            if (running || document.hidden) {
                return;
            }

            running = true;
            lastFrame = performance.now();
            animationFrame = window.requestAnimationFrame(draw);
        };

        const pointInContainer = (event) => {
            const bounds = container.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) {
                return null;
            }

            return [x, y];
        };

        const onPointerMove = (event) => {
            if (!interactive || event.pointerType !== 'mouse') {
                return;
            }

            const point = pointInContainer(event);

            if (!point) {
                return;
            }

            energize(...point);
            wake();
        };

        const onPointerDown = (event) => {
            if (!interactive || event.pointerType !== 'mouse' || !propsRef.current.clickPulse) {
                return;
            }

            const point = pointInContainer(event);

            if (!point) {
                return;
            }

            const [x, y] = point;
            pulses.push({ x, y, startedAt: performance.now() });
            wake();
        };

        const resizeObserver = new ResizeObserver(() => {
            rebuild();
            wake();
        });
        const themeObserver = new MutationObserver(wake);
        const onVisibilityChange = () => {
            if (document.hidden) {
                window.cancelAnimationFrame(animationFrame);
                running = false;

                return;
            }

            wake();
        };

        wakeRef.current = wake;
        resizeObserver.observe(container);
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
        document.addEventListener('visibilitychange', onVisibilityChange);
        rebuild();
        wake();

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });

        return () => {
            window.cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            themeObserver.disconnect();
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerdown', onPointerDown);
            wakeRef.current = null;
        };
    }, [cellSize, interactive]);

    useEffect(() => {
        wakeRef.current?.();
    }, [cellRadius, color, fillOpacity, gridOpacity, lineWidth, maxOpacity]);

    return (
        <div ref={containerRef} aria-hidden="true" className={cn('cursor-grid', className)}>
            <canvas ref={canvasRef} aria-hidden="true" className="cursor-grid__canvas" />
        </div>
    );
}

export default CursorGrid;
