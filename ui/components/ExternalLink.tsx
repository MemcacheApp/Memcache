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
            className={cn(
                "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className,
            )}
            href={href}
            target="_blank"
            rel="noreferrer"
            {...props}
        >
            {children}
        </a>
    );
};

export { ExternalLink };
