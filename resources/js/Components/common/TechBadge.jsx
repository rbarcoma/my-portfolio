import { Badge } from '../ui/badge';

/**
 * Technology pill used on project cards and case studies.
 */
export function TechBadge({ children, className }) {
    return <Badge className={className}>{children}</Badge>;
}

export default TechBadge;
