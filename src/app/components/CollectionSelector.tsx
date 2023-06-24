"use client";

import { useEffect, useState } from "react";
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
import { LuCheck, LuChevronsUpDown, LuPlus } from "react-icons/lu";
import { includeCaseInsensitive } from "../utils";
import classNames from "classnames";
import { type VariantProps } from "class-variance-authority";

interface CollectionSelectorProps extends VariantProps<typeof buttonVariants> {
    collections: string[] | undefined;
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

    useEffect(() => {
        if (collections && !value) {
            setValue(collections[0]);
        }
    }, [collections]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    size={size}
                >
                    {value || "Loading..."}
                    <div className="ml-2 h-4 w-4 shrink-0 opacity-50 flex justify-end">
                        <LuChevronsUpDown />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] !p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or Add..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandGroup>
                        {collections ? (
                            <>
                                {!searchValue ||
                                includeCaseInsensitive(
                                    collections,
                                    searchValue
                                ) ? null : (
                                    <CommandItem
                                        onSelect={() => {
                                            setValue(searchValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <span className="mr-2 h-4 w-4">
                                            <LuPlus />
                                        </span>
                                        {`Add "${searchValue}"`}
                                    </CommandItem>
                                )}
                                {collections.map((collection) => (
                                    <CommandItem
                                        key={collection}
                                        onSelect={() => {
                                            setValue(collection);
                                            setOpen(false);
                                        }}
                                    >
                                        <span
                                            className={classNames(
                                                "mr-2 h-4 w-4",
                                                collection === value
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        >
                                            <LuCheck />
                                        </span>
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
