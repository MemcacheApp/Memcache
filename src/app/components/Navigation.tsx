"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LuAlbum,
    LuGlobe2,
    LuLayoutDashboard,
    LuNewspaper,
} from "react-icons/lu";
import { trpc } from "@/src/app/utils/trpc";

interface NavigationItemProps {
    children?: React.ReactNode;
    href: string;
    icon?: React.ReactNode;
}

function NavigationItem(props: NavigationItemProps) {
    const pathname = usePathname();

    return (
        <li>
            <Link
                href={props.href}
                className={classNames(
                    "flex items-center h-10 py-2 px-4 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground",
                    { "bg-accent": pathname === props.href }
                )}
            >
                {props.icon ? <span className="mr-3">{props.icon}</span> : null}
                {props.children}
            </Link>
        </li>
    );
}

export function Navigation() {
    const collectionsQuery = trpc.collection.getCollections.useQuery();
    const collections = collectionsQuery.data;

    return (
        <nav className="mx-3 flex flex-col">
            <ul className="flex flex-col gap-1 list-none">
                <NavigationItem href="/saves" icon={<LuAlbum size={20} />}>
                    Saves
                </NavigationItem>
                <NavigationItem href="/discover" icon={<LuGlobe2 size={20} />}>
                    Discover
                </NavigationItem>
                <NavigationItem
                    href="/flashcards"
                    icon={<LuLayoutDashboard size={20} />}
                >
                    Flashcards
                </NavigationItem>
                <NavigationItem
                    href="/summaries"
                    icon={<LuNewspaper size={20} />}
                >
                    Summaries
                </NavigationItem>
                <li className="mt-5">
                    <p className="ml-2 mb-2 font-medium">Collections</p>
                    <ul>
                        {collections
                            ? collections.map((collection) => (
                                  <NavigationItem
                                      key={collection}
                                      href={`/collection/${collection}`}
                                  >
                                      {collection}
                                  </NavigationItem>
                              ))
                            : null}
                    </ul>
                </li>
            </ul>
        </nav>
    );
}
