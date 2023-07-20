"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { trpc } from "@/src/app/utils/trpc";
import {
    Album,
    ArrowRight,
    Globe2,
    LayoutDashboard,
    Newspaper,
    Package2,
} from "lucide-react";
import { cn } from "@/ui/utils";

interface NavigationItemProps {
    children?: React.ReactNode;
    href: string;
    icon?: React.ReactNode;
}

export function NavigationItem(props: NavigationItemProps) {
    const pathname = usePathname();

    return (
        <li>
            <Link
                href={props.href}
                className={cn(
                    "flex items-center h-10 py-2 px-4 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground hover:no-underline",
                    { "bg-accent": pathname === props.href },
                )}
            >
                {props.icon ? <span className="mr-3">{props.icon}</span> : null}
                {props.children}
            </Link>
        </li>
    );
}

export function Navigation() {
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();

    return (
        <nav className="flex flex-col mx-3">
            <ul className="flex flex-col gap-1 list-none">
                <NavigationItem href="/app/saves" icon={<Album size={20} />}>
                    Saves
                </NavigationItem>
                <NavigationItem
                    href="/app/discover"
                    icon={<Globe2 size={20} />}
                >
                    Discover
                </NavigationItem>
                <NavigationItem
                    href="/app/flashcards"
                    icon={<LayoutDashboard size={20} />}
                >
                    Flashcards
                </NavigationItem>
                <NavigationItem
                    href="/app/summaries"
                    icon={<Newspaper size={20} />}
                >
                    Summaries
                </NavigationItem>
                {isLoggedInQuery.data ? <Collections /> : null}
            </ul>
        </nav>
    );
}

function Collections() {
    const collectionsQuery = trpc.collection.getUserCollections.useQuery();
    const collections = collectionsQuery.data;

    return (
        <li className="mt-2">
            <div className="ml-2 flex flex-row items-center gap-2 py-2">
                <Package2 size={12} className="text-slate-450" />
                <p className="text-slate-450 text-[12px] tracking-widest uppercase">
                    collections
                </p>
            </div>
            <ul className="flex flex-col gap-1 list-none">
                {collections
                    ? collections.map((collection) => (
                          <NavigationItem
                              key={collection.id}
                              href={`/app/collections/${collection.id}`}
                          >
                              {collection.name}
                          </NavigationItem>
                      ))
                    : null}
                <NavigationItem href={`/app/collections`}>
                    {"See all"}
                    <ArrowRight size={14} className="ml-2" />
                </NavigationItem>
            </ul>
        </li>
    );
}
