"use client";

import { PageTitle, ScrollArea, ScrollBar, SummaryCard } from "@/ui/components";
import { trpc } from "../../utils/trpc";

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
                    <ScrollArea>
                        <div className="flex gap-3">
                            {latestSummariesQuery.data?.map((summary) => (
                                <SummaryCard
                                    className="w-80 shrink-0"
                                    key={summary.id}
                                    summary={summary}
                                />
                            ))}
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
