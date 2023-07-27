"use client";

import { ItemCard, Loader } from "@/ui/components";
import { PageTitle } from "@/ui/components/typography";
import { trpc } from "../../utils/trpc";

export default function DiscoverPage() {
    const getSuggestedItemsQuery =
        trpc.discovery.getSuggestedDiscoveryItems.useQuery();

    return (
        <div className="@container">
            <PageTitle>Discover</PageTitle>
            <div className="md:mx-8 mb-8 grid grid-cols-1 @xl:grid-cols-2 @3xl:grid-cols-3 gap-3">
                {getSuggestedItemsQuery.data ? (
                    getSuggestedItemsQuery.data.map((item) => (
                        <ItemCard key={item.id} data={item} />
                    ))
                ) : (
                    <Loader varient="ellipsis" />
                )}
            </div>
        </div>
    );
}
