"use client";

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/components";
import FlashcardQA from "@/ui/components/FlashcardQA";
import { Collection, Flashcard, Item, Tag } from "@prisma/client";
import { useState } from "react";

interface FlashcardDialogProps {
    flashcard: Flashcard & {
        item: Item & { collection: Collection; tags: Tag[] };
    };
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function FlashcardDialog({
    flashcard,
    open,
    onOpenChange,
}: FlashcardDialogProps) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[85%] sm:max-w-[860px]">
                <DialogHeader>
                    <DialogTitle>Flashcard</DialogTitle>
                </DialogHeader>
                <FlashcardQA
                    flashcard={flashcard}
                    showAnswer={showAnswer}
                    setShowAnswer={setShowAnswer}
                />
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Return</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
