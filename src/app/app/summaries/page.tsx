"use client";

import { PageTitle } from "@/ui/components";

export default function SummariesPage() {
    return (
        <div className="flex flex-col">
            <PageTitle>Summaries</PageTitle>
            <div className="flex flex-col gap-5">
                <div className="bg-background mx-8 p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-5">My Summaries</h2>
                    <h3 className="text-lg font-medium">Recently viewed</h3>
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
