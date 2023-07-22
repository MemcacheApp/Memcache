import { Trash } from "lucide-react";
import { Badge, Button } from ".";

/**
 * Tag component to display tag and enable removal of tag by click.
 */
export function Tag({
    value,
    remove,
}: {
    value: string;
    remove: (name: string) => void;
}) {
    return (
        <Button
            className="px-4 group relative shadow-sm hover:bg-red-200 hover:border-red-500"
            variant="outline"
            role="button"
            onClick={() => {
                remove(value);
            }}
        >
            {value}
            <Badge
                className="absolute -right-3 -bottom-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                variant="destructive"
            >
                <Trash size={13} />
            </Badge>
        </Button>
    );
}
