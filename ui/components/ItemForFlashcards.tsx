"use client";

import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { SimpleItemCard } from ".";
import { cn } from "../utils";

export function ItemForFlashcards({
    data,
    selected,
    onSelect,
    className,
}: {
    data: Item & {
        collection: Collection;
        tags: Tag[];
        flashcards: Flashcard[];
    };
    selected?: boolean;
    onSelect?: (id: string) => void;
    className?: string;
}) {
    return (
        <>
            <SimpleItemCard
                className={cn(
                    "transition-[transform,border-color]",
                    selected
                        ? "scale-[101%] shadow-md border-slate-500"
                        : "scale-100",
                    className,
                )}
                onClick={
                    onSelect
                        ? () => {
                              onSelect(data.id);
                          }
                        : undefined
                }
                url={data.url}
                type={data.type}
                title={data.title}
                collection={data.collection}
                tags={data.tags}
                description={data.description}
                thumbnail={data.thumbnail}
                siteName={data.siteName}
                favicon={data.favicon}
                footerRight={
                    <div>
                        <span>{`${3} flashcards`}</span>
                        <span>{`Latest ${data.flashcards.at(-1)}`}</span>
                    </div>
                }
            />
        </>
    );
}
