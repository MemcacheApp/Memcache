"use client";

import { useRouter } from "next/router";

export default function CollectionPage() {
    const router = useRouter();
    const collectionId = router.query.collectionId;

    return <div>Collection {collectionId}&apos;s content goes here</div>;
}
