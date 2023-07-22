"use client";

import { Tag } from "@prisma/client";
import { Plus, TagIcon } from "lucide-react";
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

interface AddTagProps {
    tags: Tag[] | undefined;
    onSelect: (name: string) => void;
    disabled?: boolean;
}

export function AddTag({ tags, onSelect, disabled }: AddTagProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const tagNames = useMemo(() => tags?.map((tag) => tag.name), [tags]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="px-2 bg-slate-50"
                    variant="outline"
                    size="xs"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                >
                    <Plus size={16} />
                </Button>
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
                                {!searchValue ||
                                includeCaseInsensitive(
                                    tagNames,
                                    searchValue,
                                ) ? null : (
                                    <CommandItem
                                        onSelect={() => {
                                            onSelect(searchValue);
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
                                            onSelect(tag);
                                            setOpen(false);
                                        }}
                                    >
                                        <TagIcon className="mr-2 h-4 w-4" />
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
