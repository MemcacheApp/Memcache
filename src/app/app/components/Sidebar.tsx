"use client";

import { Menu, User } from "lucide-react";
import { Navigation } from "./Navigation";
import { useEffect, useState } from "react";
import { Button } from "@/ui/components";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import { userInfo } from "os";

export function Sidebar() {
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
            <div className="absolute flex items-center bg-background/50 bottom-0 left-0 right-0 p-5 gap-3">
                <User />
                {username ? (
                    <div>{username}</div>
                ) : (
                    <Link href="auth/login">Log in</Link>
                )}
            </div>
        </div>
    );
}
