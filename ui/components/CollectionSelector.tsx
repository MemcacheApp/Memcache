"use client";

import { useMemo, useState } from "react";
import {
    Button,
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
    buttonVariants,
} from ".";
import { includeCaseInsensitive } from "../../src/app/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { Collection } from "@prisma/client";

interface CollectionSelectorProps extends VariantProps<typeof buttonVariants> {
    collections: Collection[] | undefined;
    value: string;
    setValue: (s: string) => void;
}

export function CollectionSelector({
    collections,
    value,
    setValue,
    size,
}: CollectionSelectorProps) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const collectionNames = useMemo(() => {
        const names = collections?.map((collection) => collection.name);
        if (names && !value) {
            setValue(names[0]);
        }
        return names;
    }, [collections]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    // variant="ghost"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    size={size}
                >
                    {value || "Loading..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex justify-end" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or Add..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandGroup>
                        {collectionNames ? (
                            <>
                                {!searchValue ||
                                includeCaseInsensitive(
                                    collectionNames,
                                    searchValue
                                ) ? null : (
                                    <CommandItem
                                        onSelect={() => {
                                            setValue(searchValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {`Add "${searchValue}"`}
                                    </CommandItem>
                                )}
                                {collectionNames.map((collection) => (
                                    <CommandItem
                                        key={collection}
                                        onSelect={() => {
                                            setValue(collection);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                collection === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {collection}
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
