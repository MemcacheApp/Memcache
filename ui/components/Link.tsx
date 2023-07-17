import NextLink from "next/link";
import { cn } from "../utils";

type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link(props: LinkProps) {
    const { className, ...other } = props;

    return (
        <NextLink
            className={cn(
                "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...other}
        />
    );
}
