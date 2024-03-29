import { Trash } from "lucide-react";
import { useCallback } from "react";
import { Badge, Button, ButtonProps } from ".";
import { cn } from "../utils";

interface SimpleTagProps extends ButtonProps {
    value: string;
    remove?: (name: string) => void;
    editMode?: boolean;
}

/**
 * Tag component to display tag and enable removal of tag by click.
 */
export function SimpleTag(props: SimpleTagProps) {
    const { value, remove, editMode, onClick, ...other } = props;

    const _onClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (editMode && remove) {
                remove(value);
            } else if (onClick) {
                onClick(e);
            }
        },
        [editMode, value, remove],
    );

    return (
        <Button
            className={cn("px-4 group relative shadow-sm", {
                "hover:bg-red-200 hover:border-red-500 focus-visible:bg-red-200":
                    editMode,
            })}
            variant="outline"
            role="button"
            onClick={_onClick}
            {...other}
        >
            {value}
            {editMode ? (
                <Badge
                    className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                    variant="destructive"
                >
                    <Trash size={13} />
                </Badge>
            ) : null}
        </Button>
    );
}
