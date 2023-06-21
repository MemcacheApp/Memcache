import classNames from "classnames";

export function PageTitle(props: React.HTMLProps<HTMLHeadingElement>) {
    const { className, ...other } = props;

    return (
        <h1
            className={classNames(
                "my-5 text-4xl font-bold tracking-tight",
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
            className={classNames(
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
            className={classNames(
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
            className={classNames(
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
            className={classNames(
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
            className={classNames(
                "leading-7 [&:not(:first-child)]:mt-6",
                className
            )}
            {...other}
        />
    );
}
