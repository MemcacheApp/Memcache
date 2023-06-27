import classNames from "classnames";
import { Edit } from "lucide-react";
import React from "react";
import { Button } from "./Button";

interface TagProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    editable?: boolean;
}

const Tag = React.forwardRef<HTMLButtonElement, TagProps>((props, ref) => {
    const { className, children, ...other } = props;
    return (
        <Button
            ref={ref}
            className={classNames("relative group px-4", className)}
            size="xs"
            variant="secondary"
            {...other}
        >
            {children}
            {props.editable ? (
                <span className="hidden group-hover:flex group-focus-visible:flex justify-end w-4 bg-secondary group-hover:bg-secondary rounded-sm ">
                    <Edit />
                </span>
            ) : null}
        </Button>
    );
});
Tag.displayName = "Tag";

export { Tag };
