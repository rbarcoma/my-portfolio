import { useEffect, useRef, useState } from 'react';

const CHARACTER_VIEWS = [
    {
        id: 'left',
        label: 'Left',
        offsetClassName: 'translate-x-[3px] translate-y-px',
        offsetX: 3,
        offsetY: 1,
        src: '/images/hero-character-left.png',
    },
    {
        id: 'front',
        label: 'Front',
        offsetClassName: 'translate-x-px translate-y-[10px]',
        offsetX: 1,
        offsetY: 10,
        src: '/images/hero-character-front.png',
    },
    {
        id: 'right',
        label: 'Right',
        offsetClassName: '-translate-x-px',
        offsetX: -1,
        offsetY: 0,
        src: '/images/hero-character-right.png',
    },
    {
        id: 'back',
        label: 'Back',
        offsetClassName: '',
        offsetX: 0,
        offsetY: 0,
        src: '/images/hero-character-back.png',
    },
];

const ALPHA_THRESHOLD = 8;

export function HeroCharacter() {
    const [viewIndex, setViewIndex] = useState(0);
    const alphaMapsRef = useRef(new Map());
    const activeView = CHARACTER_VIEWS[viewIndex];
    const nextView = CHARACTER_VIEWS[(viewIndex + 1) % CHARACTER_VIEWS.length];

    useEffect(() => {
        let cancelled = false;
        const images = CHARACTER_VIEWS.map((view) => {
            const image = new Image();

            image.decoding = 'async';
            image.onload = () => {
                if (cancelled || image.naturalWidth === 0 || image.naturalHeight === 0) {
                    return;
                }

                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                const context = canvas.getContext('2d', { willReadFrequently: true });

                if (!context) {
                    return;
                }

                context.drawImage(image, 0, 0);
                alphaMapsRef.current.set(view.id, {
                    context,
                    height: canvas.height,
                    width: canvas.width,
                });
            };
            image.src = view.src;

            return image;
        });

        return () => {
            cancelled = true;
            images.forEach((image) => {
                image.onload = null;
            });
            alphaMapsRef.current.clear();
        };
    }, []);

    const isOpaqueAtPointer = (event) => {
        const alphaMap = alphaMapsRef.current.get(activeView.id);

        if (!alphaMap) {
            return false;
        }

        const bounds = event.currentTarget.getBoundingClientRect();

        if (bounds.width === 0 || bounds.height === 0) {
            return false;
        }

        const relativeX = event.clientX - bounds.left - activeView.offsetX;
        const relativeY = event.clientY - bounds.top - activeView.offsetY;

        if (relativeX < 0 || relativeX >= bounds.width || relativeY < 0 || relativeY >= bounds.height) {
            return false;
        }

        const x = Math.min(
            alphaMap.width - 1,
            Math.max(0, Math.floor((relativeX / bounds.width) * alphaMap.width)),
        );
        const y = Math.min(
            alphaMap.height - 1,
            Math.max(0, Math.floor((relativeY / bounds.height) * alphaMap.height)),
        );

        try {
            return alphaMap.context.getImageData(x, y, 1, 1).data[3] > ALPHA_THRESHOLD;
        } catch {
            return false;
        }
    };

    const rotateCharacter = () => {
        setViewIndex((currentIndex) => (currentIndex + 1) % CHARACTER_VIEWS.length);
    };

    const handleClick = (event) => {
        if (event.detail === 0 || isOpaqueAtPointer(event)) {
            rotateCharacter();
        }
    };

    const handlePointerDown = (event) => {
        if (!isOpaqueAtPointer(event)) {
            event.preventDefault();
        }
    };

    const handlePointerMove = (event) => {
        event.currentTarget.style.cursor = isOpaqueAtPointer(event) ? 'pointer' : 'default';
    };

    const handlePointerLeave = (event) => {
        event.currentTarget.style.cursor = '';
    };

    return (
        <button
            type="button"
            aria-label={`Rotate pixel character. Currently facing ${activeView.label}; next view is ${nextView.label}.`}
            className="relative block h-[30rem] w-[15rem] appearance-none border-0 bg-transparent p-0 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
        >
            {CHARACTER_VIEWS.map((view, index) => (
                <img
                    key={view.id}
                    src={view.src}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className={
                        `pointer-events-none absolute inset-0 block h-full w-full select-none object-contain [image-rendering:pixelated] transition-opacity duration-200 ease-out motion-reduce:transition-none ${view.offsetClassName} ${
                            index === viewIndex ? 'opacity-100' : 'opacity-0'
                        }`
                    }
                />
            ))}
        </button>
    );
}

export default HeroCharacter;
