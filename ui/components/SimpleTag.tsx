import { Trash } from "lucide-react";
import { Button } from ".";

/**
 * Simple tag component to display tag and enable removal of tag by click.
 */

export default function SimpleTag({
    value,
    remove,
}: {
    value: string;
    remove: (name: string) => void;
}) {
    return (
        <Button
            className="px-4 group relative hover:bg-red-200"
            variant="secondary"
            size="xs"
            role="combobox"
            onClick={() => {
                remove(value);
            }}
        >
            {value}
            <span className="absolute -right-3 -bottom-2 bg-background group-hover:text-red-500 p-1 border text-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 rounded-full z-10">
                <Trash size={13} />
            </span>
        </Button>
    );
}
