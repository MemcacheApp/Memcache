import classNames from "classnames";
import React from "react";
import { LuEdit } from "react-icons/lu";

const Tag = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    const { className, children, ...other } = props;
    return (
        <button
            ref={ref}
            className={classNames(
                "relative group inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background h-10 py-2 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                className
            )}
            {...other}
        >
            {children}
            <span className="absolute right-3 p-1 opacity-0 bg-secondary group-hover:opacity-100">
                <LuEdit />
            </span>
        </button>
    );
});
Tag.displayName = "Tag";

export { Tag };
