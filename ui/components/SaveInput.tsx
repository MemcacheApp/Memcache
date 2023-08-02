"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { trpc } from "../../src/app/utils/trpc";

import { usePerferences } from "@/src/app/utils/procedures";
import { ItemMetadata } from "@/src/datatypes/item";
import { hostname } from "@/src/utils";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { Slot } from "@radix-ui/react-slot";
import { Package2, Plus, RefreshCw, TagIcon, X } from "lucide-react";
import React from "react";
import { RemoveScroll } from "react-remove-scroll";
import {
    AddTag,
    Button,
    CollectionSelector,
    Input,
    Label,
    Loader,
    SimpleItemCard,
    SimpleTag,
    Switch,
} from ".";
import { cn } from "../utils";

interface SaveInputState {
    isShow: boolean;
    show: () => void;
    dismiss: () => void;
}

const SaveInputContext = React.createContext<SaveInputState | null>(null);
const SaveInputProvider = SaveInputContext.Provider;
const useSaveInputStore = () => {
    return useContext(SaveInputContext) as SaveInputState;
};

interface SaveInputProps {
    children?: React.ReactNode;
    className?: string;
}

export function SaveInput({ className, children }: SaveInputProps) {
    const [isShow, setIsShow] = useState(false);

    const show = useCallback(() => {
        setIsShow(true);
    }, []);

    const dismiss = useCallback(() => {
        setIsShow(false);
    }, []);

    return (
        <SaveInputProvider
            value={{
                isShow,
                show,
                dismiss,
            }}
        >
            <div className={cn("relative z-10", className)}>
                {children}
                <SaveInputDialog />
            </div>
        </SaveInputProvider>
    );
}

interface SaveInputTriggerProps {
    children?: React.ReactNode;
}

export function SaveInputTrigger(props: SaveInputTriggerProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { isShow, show } = useSaveInputStore();

    const children = props.children || (
        <button
            className={cn(
                "flex items-center text-left text-base box-border bg-background hover:border-slate-500 transition-colors py-3 px-4 rounded-lg border border-input cursor-text text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
                {
                    "opacity-0": isShow,
                },
            )}
        >
            <Plus size={18} className="mr-2" />
            Save a URL...
        </button>
    );

    return (
        <Slot ref={buttonRef} onClick={show}>
            {children}
        </Slot>
    );
}

function SaveInputDialog() {
    const { isShow, dismiss } = useSaveInputStore();

    const ctx = trpc.useContext();

    const [url, setUrl] = useState("");
    const [collection, setCollection] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    const createItemMutation = trpc.item.createItem.useMutation({
        onSuccess: () => ctx.item.getUserItems.invalidate(),
    });
    const perferences = usePerferences();

    useEffect(() => {
        if (createItemMutation.isSuccess) {
            setUrl("");
            setTags([]);
            dismiss();
        }
    }, [createItemMutation.isSuccess]);

    useEffect(() => {
        if (isShow) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
                inputRef.current?.focus();
            }, 10);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [isShow]);

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

    const clearInput = () => {
        setUrl("");
        inputRef.current?.focus();
    };

    return (
        <RemoveScroll enabled={isShow} as={Slot} allowPinchZoom>
            <FocusScope asChild trapped={isShow} loop>
                <DismissableLayer asChild onDismiss={dismiss}>
                    <div
                        className={cn("z-50", {
                            hidden: isHidden,
                        })}
                    >
                        <div
                            className={cn(
                                "fixed top-0 bottom-0 left-0 right-0 transition-[background-color,backdrop-filter]",
                                {
                                    "bg-white/80 backdrop-blur-sm": !isCollapse,
                                },
                            )}
                            onClick={dismiss}
                        ></div>
                        <form
                            className={cn(
                                "@container flex flex-col -left-1 -right-1 top-0 absolute z-10 transition-[transform,opacity] pointer-events-none",
                                isCollapse
                                    ? "opacity-0 scale-95"
                                    : "opacity-100 scale-100",
                            )}
                            action=""
                            onSubmit={handleSubmit}
                        >
                            <div
                                className={cn(
                                    "relative h-12 bg-background shadow-lg rounded-t-lg border pointer-events-auto",
                                    url
                                        ? "@xl:rounded-br-md"
                                        : "rounded-br-md rounded-bl-md",
                                )}
                            >
                                <Input
                                    className="absolute top-0 bottom-0 h-full bg-transparent text-base border-none pl-4 pr-10 z-10"
                                    placeholder="https://"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    ref={inputRef}
                                />
                                <Button
                                    className={cn(
                                        "absolute right-2 top-1/2 -translate-y-1/2 z-10 text-slate-500 rounded-full p-1",
                                        { hidden: !url },
                                    )}
                                    onClick={clearInput}
                                    type="button"
                                    variant="ghost"
                                    size="none"
                                >
                                    <X size={20} />
                                </Button>
                            </div>
                            <SaveOptions
                                url={url}
                                isCreating={createItemMutation.isLoading}
                                collection={collection}
                                setCollection={setCollection}
                                tags={tags}
                                setTags={setTags}
                                isPublic={isPublic}
                                setIsPublic={setIsPublic}
                                fixedHeight
                            />
                        </form>
                    </div>
                </DismissableLayer>
            </FocusScope>
        </RemoveScroll>
    );
}

interface SaveOptionsProps {
    url: string;
    isCreating: boolean;
    collection: string;
    setCollection: (collection: string) => void;
    tags: string[];
    setTags: (tags: string[]) => void;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
    fixedHeight?: boolean;
}

export function SaveOptions({
    url,
    isCreating,
    collection,
    setCollection,
    tags,
    setTags,
    isPublic,
    setIsPublic,
    fixedHeight,
}: SaveOptionsProps) {
    const [isHidden, setIsHidden] = useState(true);
    const [isCollapse, setIsCollapse] = useState(true);

    const [metadata, setMetadata] = useState<ItemMetadata | null>(null);

    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const tagsQuery = trpc.tag.getUserTags.useQuery();

    const fetchMetadataTimer = useRef<number | NodeJS.Timeout | null>(null);
    const fetchMetadataQuery = trpc.item.fetchMetadata.useQuery(
        {
            url,
        },
        { refetchOnWindowFocus: false, enabled: false },
    );

    const refresh = useCallback(() => {
        fetchMetadataQuery.refetch();
    }, []);

    useEffect(() => {
        if (url) {
            setIsHidden(false);
            setTimeout(() => {
                setIsCollapse(false);
            }, 10);

            if (fetchMetadataTimer.current) {
                clearTimeout(fetchMetadataTimer.current);
                fetchMetadataTimer.current = null;
            }
            fetchMetadataTimer.current = setTimeout(refresh, 2000);
        } else {
            setIsCollapse(true);
            setTimeout(() => {
                setIsHidden(true);
            }, 200);
        }
    }, [url]);

    useEffect(() => {
        if (fetchMetadataQuery.isFetched) {
            if (fetchMetadataQuery.data) {
                setMetadata(fetchMetadataQuery.data);
            } else {
                setMetadata({
                    title: url,
                    url: url,
                    siteName: hostname(url),
                });
            }
        }
    }, [fetchMetadataQuery.isFetched]);

    const addTag = (name: string) => {
        if (!tags.includes(name)) {
            setTags([...tags, name]);
        }
    };

    const removeTag = (name: string) => {
        setTags(tags.filter((tagName) => tagName != name));
    };

    return (
        <div
            className={cn(
                "relative flex flex-col overflow-auto gap-3 bg-background p-3 max-w-xl rounded-b-lg border-b border-x shadow-lg transition-[transform,opacity] pointer-events-auto",
                {
                    hidden: isHidden,
                    "-translate-y-5 opacity-0": isCollapse,
                    "max-h-[75vh]": fixedHeight,
                },
            )}
        >
            <SimpleItemCard
                loading={fetchMetadataQuery.isLoading}
                url={metadata?.url}
                title={metadata?.title}
                description={metadata?.description}
                thumbnail={metadata?.thumbnail}
                siteName={metadata?.siteName}
                favicon={metadata?.favicon}
                footerRight={
                    <>
                        <div className="flex items-center gap-3">
                            <Label htmlFor="airplane-mode">Public</Label>
                            <Switch
                                id="is-public"
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                            />
                        </div>
                        {fetchMetadataQuery.isLoading ? undefined : (
                            <Button
                                className="shrink-0"
                                type="button"
                                variant="icon"
                                size="none"
                                onClick={refresh}
                                disabled={isCreating}
                            >
                                <RefreshCw size={18} />
                            </Button>
                        )}
                    </>
                }
            />
            <div className="flex flex-col rounded-lg bg-slate-50 gap-3 py-4 px-5">
                <div className="flex gap-3 flex-wrap items-center">
                    <Package2 className="text-slate-500" size={18} />
                    <CollectionSelector
                        collections={collectionsQuery.data}
                        value={collection}
                        onSelect={setCollection}
                        disabled={isCreating}
                    />
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    <TagIcon className="text-slate-500" size={18} />
                    {tags.map((tag) => (
                        <SimpleTag
                            key={tag}
                            value={tag}
                            remove={removeTag}
                            disabled={isCreating}
                            editMode
                        />
                    ))}
                    <AddTag
                        tags={tagsQuery.data}
                        onSelect={addTag}
                        disabled={isCreating}
                        selectedTags={tags}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 justify-end">
                <Loader
                    varient="ring"
                    className={cn("w-6 h-6", {
                        hidden: !isCreating,
                    })}
                />
                <Button type="submit" disabled={isCreating}>
                    Save
                </Button>
            </div>
        </div>
    );
}
