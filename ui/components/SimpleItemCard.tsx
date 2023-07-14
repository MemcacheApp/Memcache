import { Globe, Package2, TagIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, Skeleton } from ".";
import ExternalLink from "./ExternalLink";
import { cn } from "../utils";
import { Collection, Tag } from "@prisma/client";
import Link from "next/link";

interface SimpleItemCardProps {
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
                "@container outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden",
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
                {props.loading ? (
                    <Skeleton className="order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 aspect-[16/9] @lg:m-6 shrink-0 @lg:border rounded-lg overflow-hidden" />
                ) : props.thumbnail ? (
                    <div className="order-1 @lg:order-2 @lg:max-w-[32%] max-h-64 aspect-[16/9] @lg:m-6 shrink-0 @lg:border rounded-lg overflow-hidden">
                        <img
                            src={props.thumbnail}
                            alt="Image"
                            className="object-cover object-center relative w-full h-full"
                        />
                    </div>
                ) : null}
            </div>
            <CardFooter className="flex items-start flex-col gap-5 my-3 @lg:flex-row @lg:justify-between @lg:items-end">
                {props.loading ? (
                    <Skeleton className="h-5 w-24 rounded-lg" />
                ) : (
                    <>
                        <div className="flex flex-wrap gap-x-5 text-slate-450 text-sm">
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
                                <div className="flex flex-wrap items-center gap-3">
                                    <TagIcon size={16} />
                                    {props.tags.map((tag) => (
                                        <Link
                                            className="flex items-center px-3 py-2 rounded-lg bg-secondary"
                                            key={tag.id}
                                            href={`/app/tag/${tag.id}`}
                                            tabIndex={-1}
                                        >
                                            {tag.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                            {props.footerLeft}
                        </div>
                        <div className="flex gap-3">{props.footerRight}</div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
