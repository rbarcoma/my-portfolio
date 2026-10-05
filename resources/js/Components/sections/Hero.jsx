import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { useRoute } from '../../lib/route';
import { Button } from '../ui/button';
import { Container } from '../common/Container';
import { Reveal, RevealGroup, RevealItem } from '../common/Reveal';

export function Hero({ hero }) {
    const route = useRoute();

    return (
        <section id="home" className="scroll-mt-24 pt-32 pb-18 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
            <Container>
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

                    <Reveal delay={0.16} className="lg:col-span-4">
                        <aside className="rounded-card border border-hairline bg-surface p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
                                <p className="text-sm font-medium">What I work with</p>
                                <ArrowDownRight className="size-4 text-muted-foreground" aria-hidden="true" />
                            </div>
                            <RevealGroup className="mt-5 grid gap-3" stagger={0.05}>
                                {hero.rotating?.map((item, index) => (
                                    <RevealItem key={item} className="flex items-center gap-3">
                                        <span className="w-5 text-xs tabular-nums text-subtle">0{index + 1}</span>
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </RevealItem>
                                ))}
                            </RevealGroup>
                        </aside>
                    </Reveal>
                </div>
            </Container>
        </section>
    );
}

export default Hero;
