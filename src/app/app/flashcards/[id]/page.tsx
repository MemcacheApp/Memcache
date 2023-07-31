"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Button, ExternalLink, PageTitle } from "@/ui/components";
import FlashcardDialog from "@/ui/components/FlashcardDialog";
import FlashcardPreviewCard from "@/ui/components/FlashcardPreviewCard";
import {
    Collection,
    Flashcard,
    FlashcardReview,
    Item,
    Tag,
} from "@prisma/client";
import { Globe, Package2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FlashcardSetPageProps {
    params: {
        id: string;
    };
}

export default function FlashcardSetPage({ params }: FlashcardSetPageProps) {
    const itemQuery = trpc.item.getItemFlashcards.useQuery({
        itemId: params.id,
    });
    const data = itemQuery.data;

    const [selectedFlashcard, setSelectedFlashcard] = useState<
        | (Flashcard & {
              item: Item & { collection: Collection; tags: Tag[] };
              reviews: FlashcardReview[];
          })
        | null
    >(null);

    return (
        <div className="flex flex-col @container/flashcards-set">
            <PageTitle>Flashcards</PageTitle>
            <div className="mx-8 pt-6 flex flex-col gap-5">
                {data ? (
                    <>
                        <div className="text-xl">{data.title}</div>
                        <div className="w-full flex flex-wrap-reverse gap-x-5 gap-y-1 text-slate-450 text-sm">
                            {data.siteName ? (
                                <ExternalLink
                                    className="flex items-center gap-2 my-2"
                                    href={data.url ? data.url : "#"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {data.favicon ? (
                                        <img
                                            width={16}
                                            height={16}
                                            src={data.favicon}
                                        />
                                    ) : (
                                        <Globe size={16} />
                                    )}
                                    {data.siteName}
                                </ExternalLink>
                            ) : null}
                            {data.collection ? (
                                <Link
                                    className="flex items-center gap-2 my-2"
                                    href={`/app/collection/${data.collection.id}`}
                                >
                                    <Package2 size={16} />
                                    {data.collection.name}
                                </Link>
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
            <div className="mx-8 pt-6 w-full ">
                <div className="mx-auto w-[80%] grid grid-cols-2">
                    <div className="grid grid-cols-1 justify-items-center">
                        <span className="text-6xl font-bold">
                            {
                                data?.flashcards.filter(
                                    (flashcard) =>
                                        flashcard.dueDate < new Date(),
                                ).length
                            }
                        </span>
                        <span className="text-3xl">&nbsp;{"due"}</span>
                        <Button className="w-[180px]">Review Due</Button>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center">
                        <span className="text-6xl font-bold">
                            {data?.flashcards.length}
                        </span>
                        <span className="text-3xl">&nbsp;{"total"}</span>
                        <Button className="w-[180px]">Review All</Button>
                    </div>
                </div>
            </div>
            <div className="mx-8 pt-6 grid grid-cols-1 @3xl/flashcards-set:grid-cols-2 @6xl/flashcards-set:grid-cols-2 gap-4">
                {data?.flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="  ">
                        <FlashcardPreviewCard
                            data={{ ...flashcard, item: data }}
                            onClick={() =>
                                setSelectedFlashcard({
                                    ...flashcard,
                                    item: data,
                                })
                            }
                            format={{
                                fixedDimensions: false,
                                showItemData: false,
                            }}
                        />
                    </div>
                ))}
            </div>
            {selectedFlashcard && (
                <FlashcardDialog
                    flashcard={selectedFlashcard}
                    open={selectedFlashcard !== null}
                    onOpenChange={(value) => {
                        if (!value) {
                            setSelectedFlashcard(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
