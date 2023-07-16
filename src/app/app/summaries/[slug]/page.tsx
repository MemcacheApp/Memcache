"use client";

import { H1, P, PageTitle } from "@/ui/components";
import { trpc } from "@/src/app/utils/trpc";

interface SummaryDetailPageProps {
    params: {
        slug: string;
    };
}

export default function SummaryDetailPage({ params }: SummaryDetailPageProps) {
    const itemQuery = trpc.summary.getSummary.useQuery({
        summaryId: params.slug,
    });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Summary of {data?.item.title} </PageTitle>
            <div className="mx-8">
                <P>ID: {params.slug}</P>
                <P>{data?.content}</P>
            </div>
        </div>
    );
}
