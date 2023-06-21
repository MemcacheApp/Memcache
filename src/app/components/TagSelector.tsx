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
import { LuCheck, LuPlus, LuTrash } from "react-icons/lu";
import { includeCaseInsensitive } from "../utils";
import classNames from "classnames";

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
                        role="combobox"
                        aria-expanded={open}
                    >
                        <LuPlus />
                    </Button>
                ) : (
                    <Tag role="combobox" aria-expanded={open}>
                        {value}
                    </Tag>
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
                                        <span className="mr-2 h-4 w-4">
                                            <LuTrash />
                                        </span>
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
                                        <span className="mr-2 h-4 w-4">
                                            <LuPlus />
                                        </span>
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
                                        <span
                                            className={classNames(
                                                "mr-2 h-4 w-4",
                                                tag === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        >
                                            <LuCheck />
                                        </span>
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
