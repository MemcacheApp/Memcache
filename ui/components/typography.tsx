import { cn } from "../utils";

export function PageTitle(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h1
            className={cn(
                "mt-16 mb-5 mx-8 max-md:mx-5 text-4xl font-bold tracking-tight",
                className
            )}
            {...other}
        />
    );
}

export function H1(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h1
            className={cn(
                "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
                className
            )}
            {...other}
        />
    );
}

export function H2(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h2
            className={cn(
                "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
                className
            )}
            {...other}
        />
    );
}

export function H3(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h3
            className={cn(
                "scroll-m-20 text-2xl font-semibold tracking-tight",
                className
            )}
            {...other}
        />
    );
}

export function H4(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h4
            className={cn(
                "scroll-m-20 text-xl font-semibold tracking-tight",
                className
            )}
            {...other}
        />
    );
}

export function P(props: React.HTMLProps<HTMLParagraphElement>) {
    const { className, ...other } = props;

    return (
        <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...other}
        />
    );
}
