"use client";

import {
    H3,
    H4,
    ItemCard,
    ItemSelector,
    Link,
    Loader,
    PageTitle,
    ScrollArea,
    ScrollBar,
    SummaryCard,
} from "@/ui/components";
import { GenerateSummaryDialog } from "@/ui/components/GenerationDialog";
import { Collection, Item, Tag } from "@prisma/client";
import { ArrowRightIcon } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

export default function SummariesPage() {
    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div className="flex flex-col gap-5">
                <MySummaries />
                <GenerateSummary />
            </div>
        </div>
    );
}

function MySummaries() {
    const latestSummariesQuery = trpc.summary.getLatestSummaries.useQuery();

    if (
        latestSummariesQuery.data &&
        latestSummariesQuery.data.summaries.length === 0
    ) {
        return null;
    }

    return (
        <div className="p-6 mx-8 border rounded-lg bg-background">
            <div className="flex items-center">
                <H3>My Summaries</H3>
                <Link
                    href="/app/summaries/all"
                    className="flex items-center gap-2 mb-5 ml-auto font-medium"
                >
                    See All
                    <ArrowRightIcon size={20} />
                </Link>
            </div>
            <ScrollArea
                type="scroll"
                className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
            >
                <div className="flex gap-3 p-3">
                    {latestSummariesQuery.data ? (
                        <>
                            {latestSummariesQuery.data.summaries.map(
                                (summary) => (
                                    <SummaryCard
                                        className="w-80 shrink-0"
                                        key={summary.id}
                                        summary={summary}
                                    />
                                ),
                            )}
                            {latestSummariesQuery.data.hasMore ? (
                                <NextLink
                                    className="flex flex-col items-center self-center gap-3 p-16 outline-none group"
                                    href="/app/summaries/all"
                                >
                                    <div className="p-3 transition-colors border rounded-full group-hover:border-foreground group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 text-slate-600 ">
                                        <ArrowRightIcon
                                            size={30}
                                            absoluteStrokeWidth
                                        />
                                    </div>
                                    More...
                                </NextLink>
                            ) : null}
                        </>
                    ) : (
                        <Loader varient="ellipsis" />
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

function GenerateSummary() {
    const [selectedItem, setSelectedItem] = useState<
        (Item & { collection: Collection; tags: Tag[] }) | null
    >(null);

    const suggestedItemsQuery = trpc.summary.getSuggestedItems.useQuery();

    const onSelectItem = (
        item: Item & { collection: Collection; tags: Tag[] },
    ) => {
        setSelectedItem(item);
    };

    return (
        <div className="p-6 mx-8 border rounded-lg bg-background">
            <H3>Generate Summary</H3>
            <ItemSelector
                className="w-full text-base font-normal text-slate-500"
                onSelect={onSelectItem}
            />
            <div className="flex flex-col mt-5">
                <H4>Suggested Items</H4>
                <ScrollArea
                    type="scroll"
                    className="border rounded-lg shadow-[inset_0_0_5px_-2px_rgba(0,0,0,0.2)]"
                >
                    <div className="flex gap-3 p-3">
                        {suggestedItemsQuery.data ? (
                            <>
                                {suggestedItemsQuery.data?.map((item) => (
                                    <ItemCard
                                        className="w-[25rem] h-[30rem] max-h-[50vh] shadow-[0_0_5px_-1px_rgba(0,0,0,0.3)]"
                                        key={item.id}
                                        data={item}
                                        format={{ growHeight: true }}
                                        onSelect={() => onSelectItem(item)}
                                        hideOptions
                                    />
                                ))}
                            </>
                        ) : (
                            <Loader varient="ellipsis" />
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            <GenerateSummaryDialog
                data={selectedItem}
                open={selectedItem !== null}
                onOpenChange={(value) => {
                    if (!value) {
                        setSelectedItem(null);
                    }
                }}
            />
        </div>
    );
}
