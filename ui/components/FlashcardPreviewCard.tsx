"use client";

import {
    FlashcardExperienceNames,
    FlashcardRangeNames,
} from "@/src/datatypes/flashcard";
import {
    Card,
    CardHeader,
    CardTitle,
    SimpleItemCardFooter,
} from "@/ui/components";
import { cn } from "@/ui/utils";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import DueStatus from "./DueStatus";

export default function FlashcardPreviewCard({
    data,
    onClick,
}: {
    data: Flashcard & { item: Item & { collection: Collection; tags: Tag[] } };
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
    return (
        <Card
            key={data.id}
            className="w-[30rem] h-[26rem] max-h-[50vh] bg-transparent"
        >
            <div
                className={cn(
                    "group/flashcardpreview w-full relative border rounded-t-lg overflow-hidden aspect-[16/9] hover:",
                    "transition-[transform,border-color,border-radius]",
                    "hover:scale-[101%] hover:shadow-md hover:border-slate-500 hover:rounded-lg hover:cursor-pointer",
                )}
                onClick={onClick}
            >
                <img
                    src={
                        data.item.thumbnail ??
                        "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                    }
                    alt="Image"
                    className="absolute w-full h-full object-cover object-center blur group-hover/flashcardpreview:blur-[6px] transition"
                />
                <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 flex flex-col justify-between items-center shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset] group-hover/flashcardpreview:bg-black/40 transition">
                    <div className="px-4 pt-4 pb-3 w-[75%] max-w-[24rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center">
                        {data.question}
                    </div>
                    <div className="px-4 py-2">
                        <button className="py-2 rounded-full bg-slate-200/20 px-7 hover:bg-slate-100/30">
                            View
                        </button>
                    </div>
                    <div className="flex gap-2 px-4 py-3 text-sm text-slate-400/90">
                        <span>{FlashcardExperienceNames[data.experience]}</span>
                        <span>&#183;</span>
                        <span>{FlashcardRangeNames[data.range]}</span>
                    </div>
                </div>
            </div>
            <div>
                <CardHeader className="pt-2 overflow-y-hidden">
                    <div className="flex items-center justify-between py-1 text-sm relative">
                        <DueStatus dueDate={data.dueDate} />
                        <div className="text-slate-500">
                            Last revisited 3 days ago
                        </div>
                    </div>
                    {data.item.title ? (
                        <CardTitle>{data.item.title}</CardTitle>
                    ) : null}
                </CardHeader>
                <SimpleItemCardFooter
                    url={data.item.url}
                    type={data.item.type}
                    title={data.item.title}
                    collection={data.item.collection}
                    tags={data.item.tags}
                    description={data.item.description}
                    thumbnail={data.item.thumbnail}
                    siteName={data.item.siteName}
                    favicon={data.item.favicon}
                />
            </div>
        </Card>
    );
}
