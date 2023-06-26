"use client";

import { useRef, useState } from "react";
import { trpc } from "@/src/app/utils/trpc";
import classNames from "classnames";
import { LuPackage2, LuTag } from "react-icons/lu";

import { CollectionSelector } from "./CollectionSelector";
import { TagSelector } from "./TagSelector";
import { includeCaseInsensitive } from "../../src/app/utils";
import { Input } from "./Input";
import { Button } from "./Button";
import { useQueryClient } from "@tanstack/react-query";

export function SaveInput() {
    const queryClient = useQueryClient();
    const [isShowPopover, setIsShowPopover] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const collectionsQuery = trpc.collection.getCollections.useQuery();
    const tagsQuery = trpc.tag.getTags.useQuery();

    const [url, setUrl] = useState("");
    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const createItemMutation = trpc.item.createFromURL.useMutation({
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: [["item", "getItems"], { type: "query" }],
                exact: true,
            }),
    });

    const showPopover = () => {
        setIsShowPopover(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 10);
    };

    const dismissPopOver = () => {
        setIsShowPopover(false);
    };

    const _onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            dismissPopOver();
        }
    };

    const setTag = (name: string, index: number) => {
        if (includeCaseInsensitive(tags, name)) {
            if (index !== -1) {
                const newTags = [...tags];
                newTags.splice(index, 1);
                setTags(newTags);
            }
        } else {
            if (index === -1) {
                setTags([...tags, name]);
            } else {
                const newTags = [...tags];
                newTags[index] = name;
                setTags(newTags);
            }
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (url === "") return;
        createItemMutation.mutate({
            url,
            collectionName: collection,
            tagNames: tags,
        });
        setUrl("");
        setTags([]);
        dismissPopOver();
    };

    return (
        <div className="flex flex-col relative">
            <button
                className="text-left text-base box-border bg-background p-4 rounded-md border border-input cursor-text text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={showPopover}
                tabIndex={isShowPopover ? -1 : undefined}
            >
                Save a URL...
            </button>
            <div
                className={classNames({ hidden: !isShowPopover })}
                onKeyDown={_onKeyDown}
            >
                <form
                    className="flex flex-col absolute border rounded-md -left-1 -top-1 -right-1 bg-background drop-shadow-md z-50"
                    action=""
                    onSubmit={handleSubmit}
                >
                    <Input
                        className="!text-base border-0 px-4 py-7"
                        placeholder="https://"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        ref={inputRef}
                    />
                    <div className="flex p-2 place-content-between gap-3 flex-wrap">
                        <div className="flex gap-3 flex-wrap">
                            <div className="flex items-center">
                                <div className="mx-3">
                                    <LuPackage2 />
                                </div>
                                <CollectionSelector
                                    collections={collectionsQuery.data}
                                    value={collection}
                                    setValue={setCollection}
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="mx-3">
                                    <LuTag />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {tags.map((tag, index) => (
                                        <TagSelector
                                            key={tag}
                                            index={index}
                                            tags={tagsQuery.data}
                                            value={tag}
                                            setValue={setTag}
                                            remove={removeTag}
                                        />
                                    ))}
                                    <TagSelector
                                        tags={tagsQuery.data}
                                        value=""
                                        index={-1}
                                        setValue={setTag}
                                        remove={removeTag}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button type="submit">Save</Button>
                        </div>
                    </div>
                </form>
                <div
                    className="fixed top-0 bottom-0 left-0 right-0"
                    onClick={dismissPopOver}
                ></div>
            </div>
        </div>
    );
}