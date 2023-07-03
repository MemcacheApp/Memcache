import { cn } from "../utils";

const ExternalLink = ({
    className,
    href,
    children,
    ...props
}: React.HTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: React.ReactNode;
}) => {
    return (
        <a
            className={cn(className)}
            href={href}
            target="_blank"
            rel="noreferrer"
            {...props}
        >
            {children}
        </a>
    );
};

export default ExternalLink;
