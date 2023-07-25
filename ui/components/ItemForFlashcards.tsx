"use client";

import { formatDateTime } from "@/src/app/utils";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { LayersIcon } from "lucide-react";
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
                    <div className="w-full flex justify-end text-slate-450">
                        <div>{`Latest created: ${formatDateTime(
                            latestFlashcard.createdAt,
                        )}`}</div>
                    </div>
                }
                thumbnailOverlay={
                    <div className="flex items-center gap-3 bg-slate-200/75 backdrop-blur-md rounded-md px-2 py-1 border-[2px] border-slate-400 hover:bg-100/85 hover:border-slate-200 hover:shadow-[0_0_36px_-12px_rgba(255,255,255,0.70)] transition">
                        <LayersIcon />
                        {`${data.flashcards.length} flashcard${
                            data.flashcards.length > 1 ? "s" : ""
                        }`}
                    </div>
                }
            />
        </>
    );
}
