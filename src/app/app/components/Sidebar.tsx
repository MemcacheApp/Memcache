"use client";

import { Menu, User } from "lucide-react";
import { Navigation, NavigationItem } from "./Navigation";
import { useEffect, useState } from "react";
import { Button } from "@/ui/components";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { userInfo } from "os";
import { redirect, usePathname } from "next/navigation";
import classNames from "classnames";

export function Sidebar() {
    const pathname = usePathname();
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();

    const userInfoQuery = trpc.user.getUserInfo.useQuery();
    const username = isLoggedInQuery.data
        ? `${userInfoQuery.data?.firstName} ${userInfoQuery.data?.lastName}`
        : null;

    useEffect(() => {
        document.body.classList.add("bg-muted");
    }, []);

    return (
        <div className="fixed flex flex-col w-64 h-full border-r bg-background">
            <Button variant="ghost" className="m-3 w-10 rounded-full p-0">
                <div className="h-4 w-4">
                    <Menu size={16} />
                </div>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <Navigation />
            <div className="absolute bottom-0 left-0 right-0 flex items-center w-full gap-3 p-5 bg-background/50">
                {username ? (
                    <Link
                        href="/app/profile"
                        className={classNames(
                            "flex items-center h-10 py-2 px-4 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground w-full",
                            { "bg-accent": pathname === "/app/profile" }
                        )}
                    >
                        <User size={20} className="mr-3" />
                        <div>{username}</div>
                    </Link>
                ) : (
                    <Link href="auth/login">Log in</Link>
                )}
            </div>
        </div>
    );
}
