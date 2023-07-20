"use client";

import { Menu, User } from "lucide-react";
import { Navigation } from "./Navigation";
import { useEffect, useState } from "react";
import { Button } from "@/ui/components";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { useSidebarStore } from "../../store/sidebar";

export function Sidebar() {
    const { isExpand, toggle, collapse } = useSidebarStore();

    useEffect(() => {
        if (window.innerWidth <= 768) {
            collapse();
        }
    }, []);

    return (
        <div className="z-50 relative">
            <Button
                variant={isExpand ? "ghost" : "outline"}
                className="fixed m-3 w-10 rounded-full p-0 z-10"
                onClick={toggle}
            >
                <div className="h-4 w-4">
                    <Menu size={16} />
                </div>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <SidebarInner isExpand={isExpand} />
        </div>
    );
}

function SidebarInner({ isExpand }: { isExpand: boolean }) {
    const pathname = usePathname();
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();

    const userInfoQuery = trpc.user.getUserInfo.useQuery();
    const username = isLoggedInQuery.data
        ? `${userInfoQuery.data?.firstName} ${userInfoQuery.data?.lastName}`
        : null;

    const [isHidden, setIsHidden] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);

    useEffect(() => {
        if (isExpand) {
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
    }, [isExpand]);

    return (
        <div
            className={classNames(
                "fixed flex flex-col w-[256px] h-full pt-16 border-r bg-background transition-transform max-md:drop-shadow-lg",
                {
                    hidden: isHidden,
                    "-translate-x-64": isCollapse,
                },
            )}
        >
            <Navigation />
            <div className="absolute bottom-0 left-0 right-0 flex items-center w-full gap-3 p-5 bg-background/50">
                {username ? (
                    <Link
                        href="/app/profile"
                        className={classNames(
                            "flex items-center h-10 py-2 px-4 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground w-full",
                            { "bg-accent": pathname === "/app/profile" },
                        )}
                    >
                        <User size={20} className="mr-3" />
                        <div>{username}</div>
                    </Link>
                ) : (
                    <Link href="/auth/login">Log in</Link>
                )}
            </div>
        </div>
    );
}
