"use client";

import {
    FlashcardExperienceNames,
    FlashcardRangeNames,
} from "@/src/datatypes/flashcard";
import {
    Button,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    SimpleItemCardFooter,
} from "@/ui/components";
import DueStatus from "@/ui/components/DueStatus";
import { Progress } from "@/ui/components/Progress";
import { cn } from "@/ui/utils";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { useState } from "react";

export default function FlashcardDialog({
    flashcard,
    item,
    open,
    onOpenChange,
}: {
    flashcard: Flashcard & {
        item: Item & { collection: Collection; tags: Tag[] };
    };
    item: Item & { collection: Collection; tags: Tag[] };
    open: boolean;
    onOpenChange: (value: boolean) => void;
}) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[85%] sm:max-w-[860px]">
                <DialogHeader>
                    <DialogTitle>Flashcard</DialogTitle>
                </DialogHeader>
                <div
                    className={cn(
                        "group/flashcarddialog w-full relative border rounded-lg overflow-hidden aspect-[16/9]",
                    )}
                >
                    <img
                        src={
                            flashcard.item.thumbnail ??
                            "https://www.maxpixel.net/static/photo/2x/Snow-Peaks-Ai-Generated-Artwork-Mountains-Forest-7903258.jpg"
                        }
                        alt="Image"
                        className="absolute object-cover object-center w-full h-full blur"
                    />
                    <div className="absolute w-full h-full text-slate-100/90 text-lg bg-black/50 shadow-[0_-32px_83px_-25px_rgba(0,0,0,0.65)_inset]">
                        <div className="flex flex-col items-center w-full h-full px-4 py-16 justify-evenly ">
                            <div
                                className={cn(
                                    "px-4 pt-4 pb-3 w-[80%] max-w-[52rem] h-full grow text-xl text-center font-medium tracking-wide flex items-center",
                                )}
                            >
                                {flashcard.question}
                            </div>

                            <div
                                className={cn(
                                    "px-4 py-2 h-full grow transition-[height,width,border-style,transform]",
                                    {
                                        "h-1 py-0 w-[45%] border-solid border-t-2":
                                            showAnswer,
                                    },
                                )}
                            >
                                <button
                                    className={cn(
                                        "bg-slate-200/20 px-10 py-4 rounded-full hover:bg-slate-100/30",
                                        { "hidden ": showAnswer },
                                    )}
                                    onClick={() => {
                                        setShowAnswer(true);
                                        console.log("clicked");
                                    }}
                                >
                                    Answer
                                </button>
                            </div>
                            <div
                                className={cn(
                                    "px-4 py-0 h-0 w-[90%] max-w-[56rem] opacity-0 text-center flex items-center transition-[height,opacity] overflow-y-hidden",
                                    {
                                        "h-full grow py-2 opacity-1":
                                            showAnswer,
                                    },
                                )}
                            >
                                {flashcard.answer}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full ">
                    <div className="w-[70%] ">
                        <div className="flex flex-col justify-between w-full">
                            <div className="flex items-center justify-between py-1">
                                <DueStatus dueDate={flashcard.dueDate} />
                                <div className="text-slate-500">
                                    Last revisited 3 days ago
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <div className="px-1 mr-2 text-xl">{"65%"}</div>
                                <Progress value={65} />
                            </div>
                            <div className="flex gap-2 py-1 text-sm text-slate-400/90">
                                <span>
                                    {
                                        FlashcardExperienceNames[
                                            flashcard.experience
                                        ]
                                    }
                                </span>
                                <span>&#183;</span>
                                <span>
                                    {FlashcardRangeNames[flashcard.range]}
                                </span>
                            </div>
                        </div>
                        <CardHeader className="px-0 overflow-y-hidden">
                            {item.title ? (
                                <CardTitle>{item.title}</CardTitle>
                            ) : null}
                        </CardHeader>
                        <SimpleItemCardFooter
                            url={item.url}
                            type={item.type}
                            title={item.title}
                            collection={item.collection}
                            tags={item.tags}
                            description={item.description}
                            thumbnail={item.thumbnail}
                            siteName={item.siteName}
                            favicon={item.favicon}
                            className="px-0"
                        />
                    </div>
                    <div className="ml-[2.5rem] flex flex-col gap-2">
                        <div className="text-easy">
                            <span className="font-mono text-3xl font-bold">
                                1
                            </span>
                            <span className="ml-2">easy</span>
                        </div>
                        <div className="text-medium">
                            <span className="font-mono text-3xl font-bold">
                                4
                            </span>
                            <span className="ml-2">medium</span>
                        </div>
                        <div className="text-hard">
                            <span className="font-mono text-3xl font-bold">
                                3
                            </span>
                            <span className="ml-2">hard</span>
                        </div>
                        <div className="text-forgot">
                            <span className="font-mono text-3xl font-bold">
                                2
                            </span>
                            <span className="ml-2">forgot</span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Return</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
