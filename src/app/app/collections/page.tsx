"use client";

import { trpc } from "@/src/app/utils/trpc";
import { PageTitle } from "@/ui/components";
import Link from "next/link";

export default function CollectionsPage() {
    const itemQuery = trpc.collection.getUserCollections.useQuery();
    const data = itemQuery.data;

    return (
        <div className="flex flex-col">
            <PageTitle>Collections</PageTitle>
            <div className="flex flex-col gap-3 md:mx-8 pb-8">
                {data?.map((collection) => (
                    <div key={collection.name}>
                        <Link href={`app/collections/${collection.name}`}>
                            Go to collection &apos;{collection.name}&apos;
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
