"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

import { includeCaseInsensitive } from "../../src/app/utils";
import { Package2, Plus, Tag } from "lucide-react";
import { cn } from "../utils";
import {
    Card,
    CardHeader,
    CollectionSelector,
    TagSelector,
    Input,
    Button,
    CardTitle,
    Skeleton,
} from ".";

export function SaveInput() {
    const [isShowPopover, setIsShowPopover] = useState(false);

    const showPopover = () => {
        setIsShowPopover(true);
    };

    const dismissPopOver = () => {
        setIsShowPopover(false);
    };

    return (
        <div className="flex flex-col relative mb-5 mx-8 max-md:mx-5">
            <button
                className={cn(
                    "flex items-center text-left text-base box-border bg-background hover:bg-accent transition-colors py-3 px-4 rounded-lg border border-input cursor-text text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    {
                        "opacity-0": isShowPopover,
                    }
                )}
                onClick={showPopover}
                tabIndex={isShowPopover ? -1 : undefined}
            >
                <Plus size={18} className="mr-2" />
                Save a URL...
            </button>
            <SaveInputPopover
                isShow={isShowPopover}
                onDismiss={dismissPopOver}
            />
        </div>
    );
}

interface SaveInputPopoverProps {
    isShow: boolean;
    onDismiss: () => void;
}

function SaveInputPopover({ isShow, onDismiss }: SaveInputPopoverProps) {
    const ctx = trpc.useContext();

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const [url, setUrl] = useState("");
    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isShow) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
            }, 10);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [isShow]);

    useEffect(() => {
        if (isShow) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [isShow]);

    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });

    const _onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            onDismiss();
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
        onDismiss();
    };

    return (
        <div
            className={cn("z-50", {
                hidden: isHidden,
            })}
            onKeyDown={_onKeyDown}
        >
            <form
                className={cn(
                    "flex flex-col absolute -left-1 -top-1 -right-1 z-10 transition-[transform,opacity]",
                    isCollapse ? "opacity-0 scale-95" : "opacity-100 scale-100"
                )}
                action=""
                onSubmit={handleSubmit}
            >
                <div className="relative h-12 bg-background shadow-lg rounded-t-lg rounded-br-md border">
                    <Input
                        className="absolute top-0 bottom-0 h-full bg-transparent text-base border-none px-4 z-10"
                        placeholder="https://"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        ref={inputRef}
                    />
                </div>
                <div className="relative bg-background p-3 max-w-xl rounded-b-lg border-b border-x shadow-lg">
                    <Card>
                        <div className="flex">
                            <CardHeader className="grow">
                                <CardTitle>Untitled</CardTitle>
                                <p className="mt-3">description</p>
                            </CardHeader>
                            <Skeleton className="w-[320px] max-w-[32%] aspect-[16/9] m-6 shrink-0 rounded-lg" />
                        </div>
                    </Card>
                    <div className="flex flex-col gap-3 my-4 mx-2">
                        <div className="flex gap-4 flex-wrap items-center">
                            <Package2 className="text-slate-500" size={20} />
                            <CollectionSelector
                                collections={collectionsQuery.data}
                                value={collection}
                                setValue={setCollection}
                            />
                        </div>
                        <div className="flex gap-4 flex-wrap items-center">
                            <Tag className="text-slate-500" size={20} />
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
                    <div className="flex items-center justify-end">
                        <Button type="submit">Save</Button>
                    </div>
                </div>
            </form>
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 right-0 transition-[background-color,backdrop-filter]",
                    {
                        "bg-white/80 backdrop-blur-sm": !isCollapse,
                    }
                )}
                onClick={onDismiss}
            ></div>
        </div>
    );
}
