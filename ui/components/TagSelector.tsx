"use client";

import { useState } from "react";
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
    Tag,
} from ".";
import { includeCaseInsensitive } from "../../src/app/utils";
import classNames from "classnames";
import { Check, Edit, Plus, Trash } from "lucide-react";

interface TagSelectorProps {
    tags: string[] | undefined;
    index: number;
    value: string;
    setValue: (name: string, index: number) => void;
    remove: (index: number) => void;
}

export function TagSelector({
    tags,
    index,
    value,
    setValue,
    remove,
}: TagSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {index === -1 ? (
                    <Button
                        variant="outline"
                        size="xs"
                        role="combobox"
                        aria-expanded={open}
                    >
                        <Plus size={16} />
                    </Button>
                ) : (
                    <Button
                        className="px-4 group relative"
                        variant="secondary"
                        size="xs"
                        role="combobox"
                        aria-expanded={open}
                    >
                        {value}
                        <span className="absolute -right-3 -bottom-2 bg-background p-1 border text-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 rounded-full z-10">
                            <Edit size={13} />
                        </span>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-[200px] !p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or Add..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandEmpty>No tag found.</CommandEmpty>
                    <CommandGroup>
                        {tags ? (
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
                                    tags,
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
                                {tags.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        onSelect={() => {
                                            setValue(tag, index);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={classNames(
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
