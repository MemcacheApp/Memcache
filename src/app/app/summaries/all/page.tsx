"use client";

import { trpc } from "@/src/app/utils/trpc";
import { Loader, PageTitle, SummaryCard } from "@/ui/components";

export default function AllSummariesPage() {
    const getUserSummariesQuery = trpc.summary.getUserSummaries.useQuery();

    return (
        <div className="@container">
            <PageTitle>All Summaries</PageTitle>
            <div className="md:mx-8 mb-8 grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-3">
                {getUserSummariesQuery.data ? (
                    getUserSummariesQuery.data.map((summary) => (
                        <SummaryCard key={summary.id} summary={summary} />
                    ))
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </div>
        </div>
    );
}
