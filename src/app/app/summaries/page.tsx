"use client";

import {
    H4,
    Link,
    Loader,
    PageTitle,
    ScrollArea,
    ScrollBar,
    SummaryCard
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
                    <div className="flex justify-between mb-5">
                        <h2 className="text-xl font-semibold">My Summaries</h2>
                        <Link
                            href="/app/summaries/all"
                            className="flex items-center gap-2"
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
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <H4>Generate Summary</H4>
                </div>
            </div>
        </div>
    );
}
