import { Collection, Item, Summary, Tag } from "@prisma/client";
import {
    ChevronDownIcon,
    InfoIcon,
    TimerIcon,
    WholeWordIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardTitle,
    ItemCard,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from ".";
import { cn } from "../utils";

type SummaryCardProps = {
    className?: string;
} & (
    | {
          item?: undefined;
          summary: Summary & {
              isFullText: boolean;
              item: Item & { collection: Collection; tags: Tag[] };
          };
      }
    | {
          item: Item & { collection: Collection; tags: Tag[] };
          summary: Summary & {
              isFullText: boolean;
          };
      }
);

export function SummaryCard(props: SummaryCardProps) {
    const { push } = useRouter();
    const [item, showItemPreview] = props.item
        ? [props.item, false]
        : [props.summary.item, true];
    const { summary, className } = props;

    return (
        <Card
            className={cn(
                "group relative z-0 overflow-hidden pt-6 px-6 hover:border-slate-500 transition-colors cursor-pointer",
                { "pb-6": summary.isFullText },
                className,
            )}
            onClick={() => push(`/app/summaries/${summary.id}`)}
        >
            {summary.isFullText ? null : (
                <div className="absolute left-0 right-0 bottom-0">
                    <div className="h-32 bg-gradient-to-b from-background/0 to-background pointer-events-none"></div>
                    <div className="h-5 bg-background pointer-events-none"></div>
                    <ChevronDownIcon className="absolute bottom-3 left-1/2 -translate-x-1/2 text-slate-500 transition-opacity duration-200 opacity-0 group-hover:opacity-100" />
                </div>
            )}
            <CardTitle className="text-xl">
                <Link href={`/app/summaries/${summary.id}`}>{item.title}</Link>
                {showItemPreview ? (
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
                                data={item}
                                hideOptions
                            />
                        </PopoverContent>
                    </Popover>
                ) : null}
            </CardTitle>
            <div className="flex justify-between flex-wrap gap-3 text-slate-500 my-3 text-sm">
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
