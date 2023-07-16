import { Collection, Item, Summary, Tag } from "@prisma/client";
import {
    Card,
    CardHeader,
    CardTitle,
    ItemCard,
    Popover,
    PopoverContent,
    PopoverTrigger,
    SimpleItemCard,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from ".";
import { CalendarIcon, InfoIcon, TimerIcon, WholeWordIcon } from "lucide-react";

interface SummaryCardProps {
    summary: Summary & { item: Item & { collection: Collection; tags: Tag[] } };
}

export function SummaryCard({ summary }: SummaryCardProps) {
    return (
        <Card className="max-w-sm relative z-0 overflow-hidden pt-6 px-6">
            <div className="absolute left-0 right-0 bottom-5 h-32 bg-gradient-to-b from-background/0 to-background pointer-events-none"></div>
            <div className="absolute left-0 right-0 bottom-0 h-5 bg-background pointer-events-none"></div>
            <CardTitle className="text-xl">
                {summary.item.title}
                <Popover>
                    <PopoverTrigger className="ml-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <InfoIcon size={18} className="text-slate-500" />
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[25rem] rounded-lg border-none">
                        <ItemCard data={summary.item} hideOptions />
                    </PopoverContent>
                </Popover>
            </CardTitle>
            <div className="flex justify-between text-slate-500 my-3 text-sm">
                <div className="flex gap-2 items-center">
                    {summary.createdAt.toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                    <div className="flex gap-2 items-center">
                        <WholeWordIcon size={16} />
                        {summary.wordCount} words
                    </div>
                    <div className="flex gap-2 items-center">
                        <TimerIcon size={16} />
                        {Math.round(summary.wordCount / 265)} min
                    </div>
                </div>
            </div>
            <p>{summary.content}</p>
        </Card>
    );
}
