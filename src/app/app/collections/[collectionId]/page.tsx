"use client";

interface CollectionPageProps {
    params: {
        collectionId: string;
    };
}

export default function CollectionPage({ params }: CollectionPageProps) {
    const collectionId = params.collectionId;

    return <div>Collection {collectionId}&apos;s content goes here</div>;
}
