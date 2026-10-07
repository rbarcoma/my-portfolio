import { ArrowRight } from 'lucide-react';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { Container } from '../common/Container';
import { Reveal } from '../common/Reveal';
import Particles from '../reactbits/Particles';

const HERO_PARTICLE_COLORS = ['#111111'];

export function Hero({ hero }) {
    const route = useRoute();
    const isDesktop = useIsDesktop();
    const reducedMotion = useReducedMotion();

    return (
        <section
            id="home"
            className="relative isolate overflow-hidden scroll-mt-24 pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
        >
            {isDesktop && !reducedMotion ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <Particles
                        particleColors={HERO_PARTICLE_COLORS}
                        particleCount={160}
                        particleSpread={14}
                        speed={0.055}
                        particleBaseSize={90}
                        sizeRandomness={0.55}
                        cameraDistance={20}
                        moveParticlesOnHover={false}
                        alphaParticles
                        disableRotation
                        pixelRatio={1.5}
                    />
                </div>
            ) : null}

            <Container className="relative z-10">
                <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-8">
                        <Reveal>
                            <p className="eyebrow">{hero.eyebrow}</p>
                        </Reveal>

                        <Reveal delay={0.04}>
                            <h1 className="mt-7 max-w-4xl text-[clamp(3.25rem,8.5vw,7.25rem)] leading-[0.9] font-bold text-balance">
                                {hero.headline}
                            </h1>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                {hero.subline}
                            </p>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <Button asChild size="lg">
                                    <a href={route('home') + '#projects'}>
                                        View selected work
                                        <ArrowRight aria-hidden="true" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a href={route('home') + '#contact'}>Start a conversation</a>
                                </Button>
                            </div>
                        </Reveal>
                    </div>

                    <Reveal delay={0.16} className="hidden self-stretch lg:col-span-4 lg:flex lg:items-end lg:justify-end">
                        <figure className="flex h-[31rem] w-full max-w-[22rem] items-end justify-center">
                            <img
                                src="/images/hero-character-transparent.png"
                                alt="Pixel-art portrait of Renante Barcoma"
                                width={821}
                                height={1915}
                                className="h-[30rem] w-auto max-w-none object-contain [image-rendering:pixelated]"
                            />
                        </figure>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}

export default Hero;
