"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

import { CollectionSelector } from "./CollectionSelector";
import { TagSelector } from "./TagSelector";
import { includeCaseInsensitive } from "../../src/app/utils";
import { Input } from "./Input";
import { Button } from "./Button";
import { Package2, Tag } from "lucide-react";
import { cn } from "../utils";

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
                    "text-left text-base box-border bg-background py-3 px-4 rounded-lg border border-input cursor-text text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    {
                        "opacity-0": isShowPopover,
                    }
                )}
                onClick={showPopover}
                tabIndex={isShowPopover ? -1 : undefined}
            >
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
            collection,
            tags,
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
                <div className="relative h-12 bg-background shadow-lg rounded-t-md rounded-br-md border">
                    <Input
                        className="absolute top-0 bottom-0 h-full bg-transparent text-base border-none px-4 z-10"
                        placeholder="https://"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        ref={inputRef}
                    />
                </div>
                <div className="relative bg-background max-w-3xl rounded-b-md border-b border-x shadow-lg">
                    <div className="flex gap-2 flex-wrap items-center w-full py-3 px-4">
                        <div className="flex gap-3 items-center mx-3 text-sm capitalize text-slate-450 tracking-wider">
                            <Package2 size={18} />
                            {"Collection:"}
                        </div>
                        <CollectionSelector
                            collections={collectionsQuery.data}
                            value={collection}
                            setValue={setCollection}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center w-full py-3 px-4 border-t-2 border-solid">
                        <div className="flex gap-3 items-center mx-3 text-sm capitalize text-slate-450 tracking-wider">
                            <Tag size={18} />
                            {"Tags:"}
                        </div>
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
                    <div className="flex gap-2 flex-wrap justify-end items-center w-full py-3 px-4 border-t-2 border-solid">
                        <Button className="w-full" type="submit">
                            Save
                        </Button>
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
