"use client";

import Link from "next/link";
import { PageTitle } from "../../../../ui/components";
import { trpc } from "@/src/app/utils/trpc";

export default function SummariesPage() {
    const itemId = "a5a618b3-b864-46b4-8ba6-f517d6cc06b5";
    const itemQuery = trpc.item.getItem.useQuery({ itemId });
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div>
                {data?.summaries.map((summary) => (
                    <div key={summary.id}>
                        <Link href={`app/summaries/${summary.id}`}>
							Go to summary {summary.id}
						</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
