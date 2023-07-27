"use client";

import { includeCaseInsensitive } from "@/src/app/utils";
import { Tag } from "@prisma/client";
import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
    Button,
    ButtonProps,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import { cn } from "../utils";

interface AddTagProps extends Omit<ButtonProps, "onSelect"> {
    tags: Tag[] | undefined;
    onSelect: (name: string) => void;
    disableCreation?: boolean;
    disabled?: boolean;
    selectedTags?: string[];
}

export function AddTag(props: AddTagProps) {
    const { tags, onSelect, selectedTags, disableCreation, ...other } = props;
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const tagNames = useMemo(
        () => tags?.map((tag) => tag.name),
        [tags, selectedTags],
    );

    const isCreatable =
        !disableCreation &&
        useMemo(
            () =>
                searchValue &&
                !includeCaseInsensitive(tagNames, searchValue) &&
                (!selectedTags ||
                    !includeCaseInsensitive(selectedTags, searchValue)),
            [tagNames, searchValue, selectedTags],
        );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    className="px-3 bg-slate-50 border-dashed border-2"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    {...other}
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
                                {isCreatable ? (
                                    <CommandItem
                                        value={`create:${searchValue}:`}
                                        onSelect={() => {
                                            onSelect(searchValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {`Add "${searchValue}"`}
                                    </CommandItem>
                                ) : null}
                                {tagNames.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        value={tag}
                                        onSelect={() => {
                                            onSelect(tag);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedTags?.includes(tag)
                                                    ? "opacity-100"
                                                    : "opacity-0",
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
