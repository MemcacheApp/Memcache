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
import {
    Collection,
    Flashcard,
    FlashcardReview,
    Item,
    Tag,
} from "@prisma/client";
import DueStatus from "./DueStatus";
import LastReview from "./LastReview";

interface FlashcardPreviewCardProps {
    data: Flashcard & {
        item: Item & { collection: Collection; tags: Tag[] };
        reviews: FlashcardReview[];
    };
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
    format?: FlashcardPreviewCardFormat;
}

interface FlashcardPreviewCardFormat {
    fixedDimensions?: boolean;
    showItemData?: boolean;
}

export default function FlashcardPreviewCard({
    data,
    onClick,
    className,
    format = { fixedDimensions: true, showItemData: true },
}: FlashcardPreviewCardProps) {
    return (
        <Card
            key={data.id}
            className={cn(
                "bg-transparent",
                className,
                format?.fixedDimensions
                    ? "w-[28rem] h-[26rem] max-h-[50vh]"
                    : "w-full",
            )}
        >
            <div
                className={cn(
                    "@container/fcPreviewContainer group/fcPreviewGroup w-full relative border rounded-t-lg overflow-hidden aspect-[16/9] hover:",
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
                    className="absolute w-full h-full object-cover object-center blur-[12px] group-hover/fcPreviewGroup:blur-[9px] transition"
                />
                <div
                    className={cn(
                        "absolute w-full h-full text-slate-100/90 bg-black/60 text-lg flex flex-col justify-between items-center shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset] group-hover/fcPreviewGroup:bg-black/45 transition",
                    )}
                >
                    <div
                        className={cn(
                            "px-4 pt-4 pb-3 w-[95%] @md/fcPreviewContainer:w-[75%] max-w-[24rem] h-full grow text-center font-medium text-sm @sm/fcPreviewContainer:text-base @md/fcPreviewContainer:text-lg  tracking-wide flex justify-center items-center",
                        )}
                    >
                        <p className="text-center">{data.question}</p>
                    </div>
                    <div className="px-4 py-2">
                        <button
                            className={cn(
                                "py-2 rounded-full bg-slate-200/20 px-7 hover:bg-slate-100/30 text-sm @sm/fcpreview:text-base @md/fcpreview:text-lg",
                            )}
                        >
                            View
                        </button>
                    </div>
                    <div className="flex gap-2 px-4 py-3 text-xs @sm/fcpreview:text-sm @md/fcpreview:text-base text-slate-300/90">
                        <span>{FlashcardExperienceNames[data.experience]}</span>
                        <span>&#183;</span>
                        <span>{FlashcardRangeNames[data.range]}</span>
                    </div>
                </div>
            </div>{" "}
            <div>
                <CardHeader
                    className={cn(
                        "pt-2 overflow-y-hidden",
                        format.showItemData || "pb-3",
                    )}
                >
                    <div className="flex items-center justify-between py-1 text-sm relative">
                        <DueStatus dueDate={data.dueDate} />
                        <LastReview reviewTime={data.reviews.at(-1)?.end} />
                    </div>
                    {data.item.title && format.showItemData ? (
                        <CardTitle>{data.item.title}</CardTitle>
                    ) : null}
                </CardHeader>
                {format.showItemData && (
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
                )}
            </div>
        </Card>
    );
}
