"use client";

import { Input, SaveOptions } from "@/ui/components";
import { cn } from "@/ui/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../app/app.css";
import { usePerferences } from "../utils/procedures";
import { trpc } from "../utils/trpc";

export default function BrowserSavePage() {
    const ctx = trpc.useContext();
    const searchParams = useSearchParams();
    const perferences = usePerferences();

    const [url, setUrl] = useState(searchParams.get("url") || "");
    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    useEffect(() => {
        if (perferences) {
            setIsPublic(perferences.publicNewItem);
        }
    }, [perferences]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (url === "") return;
        createItemMutation.mutate({
            url,
            collectionName: collection,
            tagNames: tags,
            public: isPublic,
        });
    };

    return (
        <div className="flex flex-col max-w-lg bg-muted w-full mx-auto p-5">
            <form action="" onSubmit={handleSubmit}>
                <Input
                    placeholder="https://"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={cn({ "rounded-bl-none rounded-br-none": url })}
                />
                <SaveOptions
                    url={url}
                    isCreating={createItemMutation.isLoading}
                    collection={collection}
                    setCollection={setCollection}
                    tags={tags}
                    setTags={setTags}
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                    fixedHeight={false}
                />
            </form>
        </div>
    );
}
