"use client";

import { ItemExt } from "@/src/datatypes/item";
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/ui/components";
import FlashcardReviewCard from "@/ui/components/FlashcardReviewCard";
import { Flashcard, FlashcardReview } from "@prisma/client";

interface FlashcardDialogProps {
    flashcard:
        | (Flashcard & {
              item: ItemExt;
              reviews: FlashcardReview[];
          })
        | null;
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function FlashcardDialog({
    flashcard,
    open,
    onOpenChange,
}: FlashcardDialogProps) {
    if (!flashcard) {
        return null;
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[85%] sm:max-w-[860px]">
                <DialogHeader>
                    <DialogTitle>Flashcard</DialogTitle>
                </DialogHeader>
                <FlashcardReviewCard flashcard={flashcard} viewOnly />
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Return</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
