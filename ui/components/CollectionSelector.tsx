"use client";

import { Collection } from "@prisma/client";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
    Button,
    ButtonProps,
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import { includeCaseInsensitive } from "../../src/app/utils";
import { cn } from "../utils";

interface CollectionSelectorProps extends Omit<ButtonProps, "onSelect"> {
    collections: Collection[] | undefined;
    value?: string;
    onSelect: (s: string) => void;
    trigger?: React.ReactNode;
}

export function CollectionSelector(props: CollectionSelectorProps) {
    const { collections, value, onSelect, trigger, ...other } = props;
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const collectionNames = useMemo(
        () => collections?.map((collection) => collection.name),
        [collections],
    );

    const isCreatable = useMemo(
        () =>
            searchValue &&
            !includeCaseInsensitive(collectionNames, searchValue),
        [collectionNames, searchValue],
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        className="shadow-sm"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        {...other}
                    >
                        {value || "Loading..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex justify-end" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search or add collection..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandGroup>
                        {collectionNames ? (
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
                                {collectionNames.map((collection) => (
                                    <CommandItem
                                        key={collection}
                                        value={collection}
                                        onSelect={() => {
                                            onSelect(collection);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                collection === value
                                                    ? "opacity-100"
                                                    : "opacity-0",
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
