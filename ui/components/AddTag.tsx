"use client";

import { Tag } from "@prisma/client";
import { Plus } from "lucide-react";
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
    selectedTags?: string[];
}

export function AddTag({
    tags,
    onSelect,
    disabled,
    selectedTags,
}: AddTagProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const tagNames = useMemo(
        () =>
            tags
                ?.map((tag) => tag.name)
                .filter((tag) =>
                    selectedTags ? !selectedTags.includes(tag) : true,
                ),
        [tags, selectedTags],
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="px-3 bg-slate-50"
                    variant="outline"
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
                                        className="pl-8"
                                        key={tag}
                                        onSelect={() => {
                                            onSelect(tag);
                                            setOpen(false);
                                        }}
                                    >
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
