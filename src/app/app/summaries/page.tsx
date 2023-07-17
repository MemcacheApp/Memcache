"use client";

import {
    H2,
    H3,
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
                    <H2 className="mb-5">My Summaries</H2>
                    <H3 className="mb-3">Latest Generated</H3>
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
                    <H3 className="mb-5">Generate Summary</H3>
                </div>
            </div>
        </div>
    );
}
