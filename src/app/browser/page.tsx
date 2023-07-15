"use client";

import { SaveInput } from "@/ui/components";
import { useSearchParams } from "next/navigation";

export default function BrowserSavePage() {
    const searchParams = useSearchParams();
    const url = searchParams.get("url") ?? undefined;

    return <SaveInput />;
}
