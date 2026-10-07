import { useEffect, useRef } from 'react';
import { Camera, Geometry, Mesh, Program, Renderer } from 'ogl';

import { useReducedMotion } from '../../hooks/useReducedMotion';

import './Particles.css';

const defaultColors = ['#ffffff', '#ffffff', '#ffffff'];

const hexToRgb = (hex) => {
    const normalizedHex = hex.replace(/^#/, '');
    const expandedHex =
        normalizedHex.length === 3
            ? normalizedHex
                  .split('')
                  .map((character) => character + character)
                  .join('')
            : normalizedHex;
    const integer = Number.parseInt(expandedHex.slice(0, 6), 16);

    return [((integer >> 16) & 255) / 255, ((integer >> 8) & 255) / 255, (integer & 255) / 255];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export function Particles({
    particleCount = 200,
    particleSpread = 10,
    speed = 0.1,
    particleColors,
    moveParticlesOnHover = false,
    particleHoverFactor = 1,
    alphaParticles = false,
    particleBaseSize = 100,
    sizeRandomness = 1,
    cameraDistance = 20,
    disableRotation = false,
    pixelRatio = 1,
    className,
}) {
    const containerRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (reducedMotion) {
            return undefined;
        }

        const container = containerRef.current;

        if (!container) {
            return undefined;
        }

        const requestedPixelRatio = Number(pixelRatio) || 1;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const dpr = Math.min(requestedPixelRatio, devicePixelRatio, 2);
        const renderer = new Renderer({
            dpr,
            depth: false,
            alpha: true,
        });
        const gl = renderer.gl;

        container.appendChild(gl.canvas);
        gl.clearColor(0, 0, 0, 0);

        const camera = new Camera(gl, { fov: 15 });
        camera.position.set(0, 0, cameraDistance);

        const resize = () => {
            const { clientHeight: height, clientWidth: width } = container;

            if (width === 0 || height === 0) {
                return;
            }

            renderer.setSize(width, height);
            camera.perspective({ aspect: width / height });
        };

        let resizeObserver;

        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(container);
        } else {
            window.addEventListener('resize', resize, false);
        }

        resize();

        const handleMouseMove = (event) => {
            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

            mouseRef.current = { x, y };
        };

        if (moveParticlesOnHover) {
            container.addEventListener('mousemove', handleMouseMove);
        }

        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount * 4);
        const colors = new Float32Array(particleCount * 3);
        const palette = particleColors?.length ? particleColors : defaultColors;

        for (let index = 0; index < particleCount; index += 1) {
            let x;
            let y;
            let z;
            let length;

            do {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                z = Math.random() * 2 - 1;
                length = x * x + y * y + z * z;
            } while (length > 1 || length === 0);

            const radius = Math.cbrt(Math.random());
            positions.set([x * radius, y * radius, z * radius], index * 3);
            randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], index * 4);
            colors.set(hexToRgb(palette[Math.floor(Math.random() * palette.length)]), index * 3);
        }

        const geometry = new Geometry(gl, {
            position: { size: 3, data: positions },
            random: { size: 4, data: randoms },
            color: { size: 3, data: colors },
        });
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uSpread: { value: particleSpread },
                uBaseSize: { value: particleBaseSize * dpr },
                uSizeRandomness: { value: sizeRandomness },
                uAlphaParticles: { value: alphaParticles ? 1 : 0 },
            },
            transparent: true,
            depthTest: false,
        });
        const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

        let animationFrameId = null;
        let lastTime = performance.now();
        let elapsed = 0;
        let isPageVisible = document.visibilityState === 'visible';

        const update = (time) => {
            if (!isPageVisible) {
                animationFrameId = null;

                return;
            }

            animationFrameId = requestAnimationFrame(update);

            const delta = time - lastTime;
            lastTime = time;
            elapsed += delta * speed;

            program.uniforms.uTime.value = elapsed * 0.001;

            if (moveParticlesOnHover) {
                particles.position.x = -mouseRef.current.x * particleHoverFactor;
                particles.position.y = -mouseRef.current.y * particleHoverFactor;
            } else {
                particles.position.x = 0;
                particles.position.y = 0;
            }

            if (!disableRotation) {
                particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
                particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
                particles.rotation.z += 0.01 * speed;
            }

            renderer.render({ scene: particles, camera });
        };

        const handleVisibilityChange = () => {
            isPageVisible = document.visibilityState === 'visible';

            if (!isPageVisible && animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;

                return;
            }

            if (isPageVisible && animationFrameId === null) {
                lastTime = performance.now();
                animationFrameId = requestAnimationFrame(update);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (isPageVisible) {
            animationFrameId = requestAnimationFrame(update);
        }

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            if (moveParticlesOnHover) {
                container.removeEventListener('mousemove', handleMouseMove);
            }

            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            geometry.remove();
            program.remove();

            if (container.contains(gl.canvas)) {
                container.removeChild(gl.canvas);
            }
        };
    }, [
        alphaParticles,
        cameraDistance,
        disableRotation,
        moveParticlesOnHover,
        particleBaseSize,
        particleColors,
        particleCount,
        particleHoverFactor,
        particleSpread,
        pixelRatio,
        reducedMotion,
        sizeRandomness,
        speed,
    ]);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={['particles-container', className].filter(Boolean).join(' ')}
        />
    );
}

export default Particles;
