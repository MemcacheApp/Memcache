"use client";

import {
    H3,
    H4,
    PageTitle,
    ScrollArea,
    ScrollBar,
    SummaryCard,
} from "@/ui/components";
import { trpc } from "../../utils/trpc";

export default function SummariesPage() {
    const latestSummariesQuery = trpc.summary.getLatestSummaries.useQuery();

    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div className="flex flex-col gap-5">
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <H3>My Summaries</H3>
                    <H4>Latest Generated</H4>
                    <ScrollArea type="scroll">
                        <div className="flex gap-3 p-1">
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
                    <H4>Generate Summary</H4>
                </div>
            </div>
        </div>
    );
}
