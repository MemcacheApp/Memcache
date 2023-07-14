"use client";

import { useMemo, useState } from "react";
import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import { includeCaseInsensitive } from "../../src/app/utils";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { cn } from "../utils";
import { Tag } from "@prisma/client";

interface TagSelectorProps {
    tags: Tag[] | undefined;
    index: number;
    value: string;
    setValue: (name: string, index: number) => void;
    remove: (index: number) => void;
    disabled?: boolean;
}

export function TagSelector({
    tags,
    index,
    value,
    setValue,
    remove,
    disabled,
}: TagSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const tagNames = useMemo(() => tags?.map((tag) => tag.name), [tags]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {index === -1 ? (
                    <Button
                        className="px-3"
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                    >
                        <Plus size={16} />
                    </Button>
                ) : (
                    <Button
                        className="px-4 group relative"
                        variant="secondary"
                        size="default"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                    >
                        {value}
                        <span className="absolute -right-3 -bottom-2 bg-background p-1 border text-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 rounded-full z-10">
                            <Edit size={13} />
                        </span>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or add tag..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                        {tagNames ? (
                            <>
                                {index !== -1 ? (
                                    <CommandItem
                                        className="!text-red-800 font-medium"
                                        onSelect={() => {
                                            remove(index);
                                            setOpen(false);
                                        }}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        {`Remove "${value}"`}
                                    </CommandItem>
                                ) : null}
                                {!searchValue ||
                                includeCaseInsensitive(
                                    tagNames,
                                    searchValue
                                ) ? null : (
                                    <CommandItem
                                        onSelect={() => {
                                            setValue(searchValue, index);
                                            setOpen(false);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {`Add "${searchValue}"`}
                                    </CommandItem>
                                )}
                                {tagNames.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        onSelect={() => {
                                            setValue(tag, index);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                tag === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {tag}
                                    </CommandItem>
                                ))}
                            </>
                        ) : null}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
