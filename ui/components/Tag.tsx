import classNames from "classnames";
import { Edit } from "lucide-react";
import React from "react";
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
                <Edit />
            </span>
        </Button>
    );
});
Tag.displayName = "Tag";

export { Tag };
