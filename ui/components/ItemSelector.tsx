"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Collection, Item, Tag } from "@prisma/client";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    ItemCard,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import { cn } from "../utils";

interface ItemSelectorProps {
    onSelect: (item: Item & { tags: Tag[]; collection: Collection }) => void;
    className?: string;
}

export function ItemSelector({ onSelect, className }: ItemSelectorProps) {
    const [open, setOpen] = useState(false);

    const itemsQuery = trpc.item.getUserItems.useQuery();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    Select item...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[30rem] p-0">
                <Command>
                    <CommandInput placeholder="Search item..." />
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup className="max-h-[50vh] overflow-auto gap-3">
                        {itemsQuery.data
                            ? itemsQuery.data.map((item) => (
                                  <CommandItem
                                      key={item.id}
                                      value={item.title}
                                      className="p-0"
                                      onSelect={() => {
                                          onSelect(item);
                                          setOpen(false);
                                      }}
                                  >
                                      <ItemCard
                                          className="w-full border-none bg-transparent shadow-none"
                                          data={item}
                                          hideOptions
                                          format={{
                                              forceList: true,
                                          }}
                                      />
                                  </CommandItem>
                              ))
                            : null}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
