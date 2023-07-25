"use client";

import { formatDateTime } from "@/src/app/utils";
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
    const latestFlashcard = data.flashcards.at(-1);
    if (!latestFlashcard) return null;
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
                thumbnail={data.thumbnail}
                siteName={data.siteName}
                favicon={data.favicon}
                footerRight={
                    <div className="w-full flex justify-between text-slate-450">
                        <div>{`${data.flashcards.length} flashcards`}</div>
                        <div>{`Latest: ${formatDateTime(
                            latestFlashcard.createdAt,
                        )}`}</div>
                    </div>
                }
            />
        </>
    );
}
