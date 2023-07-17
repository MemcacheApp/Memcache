import { Collection, Item, Summary, Tag } from "@prisma/client";
import {
    Card,
    CardTitle,
    ItemCard,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import {
    ChevronDownIcon,
    InfoIcon,
    TimerIcon,
    WholeWordIcon,
} from "lucide-react";
import { cn } from "../utils";
import { useRouter } from "next/navigation";

interface SummaryCardProps {
    className?: string;
    summary: Summary & { item: Item & { collection: Collection; tags: Tag[] } };
}

export function SummaryCard({ className, summary }: SummaryCardProps) {
    const { push } = useRouter();

    return (
        <Card
            className={cn(
                "group relative z-0 overflow-hidden pt-6 px-6 hover:border-slate-500 transition-colors cursor-pointer",
                className
            )}
            onClick={() => push(`/app/summaries/${summary.id}`)}
        >
            <div className="absolute left-0 right-0 bottom-0">
                <div className="h-32 bg-gradient-to-b from-background/0 to-background pointer-events-none"></div>
                <div className="h-5 bg-background pointer-events-none"></div>
                <ChevronDownIcon className="absolute bottom-3 left-1/2 -translate-x-1/2 text-slate-500 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
            </div>
            <CardTitle className="text-xl">
                <Link href={`/app/summaries/${summary.id}`}>
                    {summary.item.title}
                </Link>
                <Popover>
                    <PopoverTrigger
                        className="ml-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InfoIcon size={18} className="text-slate-500" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-background/90 backdrop-blur-md p-0 w-[25rem] max-h-[50vh] overflow-auto rounded-lg">
                        <ItemCard
                            className="bg-transparent border-none"
                            data={summary.item}
                            hideOptions
                        />
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
