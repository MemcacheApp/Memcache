"use client";

import {
    Link,
    Loader,
    PageTitle,
    ScrollArea,
    ScrollBar,
    SummaryCard,
} from "@/ui/components";
import { trpc } from "../../utils/trpc";
import { ArrowRightIcon } from "lucide-react";

export default function SummariesPage() {
    const latestSummariesQuery = trpc.summary.getLatestSummaries.useQuery();

    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div className="flex flex-col gap-5">
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-5">My Summaries</h2>
                    <h3 className="text-lg font-medium mb-3">
                        Latest Generated
                    </h3>
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
                                        )
                                    )}
                                    {latestSummariesQuery.data.hasMore ? (
                                        <Link
                                            className="group flex flex-col gap-3 items-center p-16 self-center"
                                            href="/app/summaries/all"
                                        >
                                            <div className="border group-hover:border-foreground group-hover:text-foreground transition-colors text-slate-600 p-3 rounded-full ">
                                                <ArrowRightIcon
                                                    size={30}
                                                    absoluteStrokeWidth
                                                />
                                            </div>
                                            More...
                                        </Link>
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
                    <h2 className="text-xl font-semibold mb-5">
                        Generate Summary
                    </h2>
                </div>
            </div>
        </div>
    );
}
