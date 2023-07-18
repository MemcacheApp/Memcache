"use client";

import { trpc } from "@/src/app/utils/trpc";
import { PageTitle } from "@/ui/components";

interface SummaryDetailPageProps {
    params: {
        itemId: string;
    };
}

export default function SummaryDetailPage({ params }: SummaryDetailPageProps) {
    const itemQuery = trpc.summary.getSummary.useQuery({
        summaryId: params.itemId,
    });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Summary of {data?.id} </PageTitle>
            <div>
                <h1>ID: {params.itemId}</h1>
                <p> {data?.content} </p>
            </div>
        </div>
    );
}
