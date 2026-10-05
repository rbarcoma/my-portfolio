import { Container } from '../common/Container';

export function Marquee({ items = [] }) {
    return (
        <div className="border-y border-hairline bg-surface">
            <Container className="overflow-x-auto py-4">
                <ul className="flex min-w-max items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {items.map((item, index) => (
                        <li key={item} className="flex items-center gap-6 whitespace-nowrap">
                            {index > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-subtle/60" />}
                            {item}
                        </li>
                    ))}
                </ul>
            </Container>
        </div>
    );
}

export default Marquee;
