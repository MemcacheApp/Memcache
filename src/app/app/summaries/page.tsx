"use client";

import {
    H3,
    ItemSelector,
    Link,
    Loader,
    PageTitle,
    ScrollArea,
    ScrollBar,
    SummaryCard,
} from "@/ui/components";
import { ArrowRightIcon } from "lucide-react";
import NextLink from "next/link";
import { trpc } from "../../utils/trpc";

export default function SummariesPage() {
    const latestSummariesQuery = trpc.summary.getLatestSummaries.useQuery();

    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div className="flex flex-col gap-5">
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <div className="flex items-center">
                        <H3>My Summaries</H3>
                        <Link
                            href="/app/summaries/all"
                            className="ml-auto mb-5 font-medium flex items-center gap-2"
                        >
                            See All
                            <ArrowRightIcon size={20} />
                        </Link>
                    </div>
                    <ScrollArea type="scroll">
                        <div className="flex gap-3 p-1">
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
                                            className="group flex flex-col gap-3 items-center p-16 self-center outline-none"
                                            href="/app/summaries/all"
                                        >
                                            <div className="border group-hover:border-foreground group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 transition-colors text-slate-600 p-3 rounded-full ">
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
                <GenerateSummary />
            </div>
        </div>
    );
}

function GenerateSummary() {
    return (
        <div className="bg-background mx-8 p-6 border rounded-lg">
            <H3>Generate Summary</H3>
            <ItemSelector onSelect={(item) => console.log(item)} />
        </div>
    );
}
