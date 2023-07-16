import { Globe, Package2, TagIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, Skeleton } from ".";
import ExternalLink from "./ExternalLink";
import { cn } from "../utils";
import { Collection, Tag } from "@prisma/client";
import Link from "next/link";

interface SimpleItemCardProps {
    type?: string;
    title?: string;
    url?: string;
    className?: string;
    description?: string;
    collection?: Collection;
    tags?: Tag[];
    thumbnail?: string | null;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    loading?: boolean;
    siteName?: string;
    favicon?: string | null;
    footerLeft?: React.ReactNode;
    footerRight?: React.ReactNode;
}

export function SimpleItemCard(props: SimpleItemCardProps) {
    return (
        <Card
            className={cn(
                "@container outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 overflow-hidden",
                { "cursor-pointer hover:border-slate-500": props.onClick },
                props.className
            )}
            tabIndex={props.onClick ? 0 : undefined}
            onClick={props.onClick}
        >
            <div className="flex flex-col @lg:flex-row @lg:items-start">
                <CardHeader className="grow order-2">
                    {props.loading ? (
                        <>
                            <Skeleton className="h-8 rounded-lg" />
                            <Skeleton className="h-5 rounded-lg" />
                            <Skeleton className="h-5 w-40 rounded-lg" />
                        </>
                    ) : (
                        <>
                            {props.title ? (
                                <CardTitle>{props.title}</CardTitle>
                            ) : null}
                            {props.description ? (
                                <p className="mt-3">{props.description}</p>
                            ) : null}
                        </>
                    )}
                </CardHeader>
                <Thumbnail
                    type={props.type}
                    loading={props.loading}
                    thumbnail={props.thumbnail}
                />
            </div>
            <CardFooter className="flex items-start flex-col gap-5 mt-3 mb-1 @lg:flex-row @lg:justify-between @lg:items-end">
                {props.loading ? (
                    <Skeleton className="h-5 w-24 rounded-lg" />
                ) : (
                    <>
                        <div className="flex flex-wrap-reverse gap-x-5 gap-y-1 text-slate-450 text-sm">
                            {props.siteName ? (
                                <ExternalLink
                                    className="flex items-center gap-2 my-2"
                                    href={props.url ? props.url : "#"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {props.favicon ? (
                                        <img
                                            width={16}
                                            height={16}
                                            src={props.favicon}
                                        />
                                    ) : (
                                        <Globe size={16} />
                                    )}
                                    {props.siteName}
                                </ExternalLink>
                            ) : null}
                            {props.collection ? (
                                <Link
                                    className="flex items-center gap-2 my-2"
                                    href={`/app/collection/${props.collection.id}`}
                                >
                                    <Package2 size={16} />
                                    {props.collection.name}
                                </Link>
                            ) : null}
                            {props.tags && props.tags.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    <TagIcon size={16} />
                                    {props.tags.map((tag) => (
                                        <Link
                                            className="flex items-center px-3 py-1.5 rounded-lg hover:no-underline hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border shadow-sm"
                                            key={tag.id}
                                            href={`/app/tag/${tag.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                            {props.footerLeft}
                        </div>
                        {props.footerRight ? (
                            <div className="flex gap-3">
                                {props.footerRight}
                            </div>
                        ) : null}
                    </>
                )}
            </CardFooter>
        </Card>
    );
}

interface ThumbnailProps {
    type: string | undefined;
    loading: boolean | undefined;
    thumbnail: string | undefined | null;
}

function Thumbnail(props: ThumbnailProps) {
    if (props.loading) {
        return (
            <Skeleton className="order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 @lg:max-h-48 aspect-[16/9] @lg:m-6 shrink-0 @lg:border rounded-lg overflow-hidden" />
        );
    } else if (props.thumbnail) {
        return (
            <div
                className={cn(
                    "order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 @lg:max-h-48 @lg:m-6 shrink-0 @lg:border rounded-lg overflow-hidden",
                    props.type?.startsWith("music")
                        ? "aspect-square"
                        : "aspect-[16/9]"
                )}
            >
                <img
                    src={props.thumbnail}
                    alt="Image"
                    className="object-cover object-center relative w-full h-full"
                />
            </div>
        );
    } else {
        return null;
    }
}
