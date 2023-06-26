import classNames from "classnames";
import React from "react";
import { LuEdit } from "react-icons/lu";
import { Button } from "./Button";

const Tag = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    const { className, children, ...other } = props;
    return (
        <Button
            ref={ref}
            className={classNames("relative group px-4 hover:px-2", className)}
            size="xs"
            variant="secondary"
            {...other}
        >
            {children}
            <span className="hidden group-hover:flex group-focus-visible:flex justify-end w-4 bg-secondary group-hover:bg-secondary rounded-sm ">
                <LuEdit />
            </span>
        </Button>
    );
});
Tag.displayName = "Tag";

export { Tag };
