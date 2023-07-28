"use client";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/ui/components";
import { cn } from "@/ui/utils";
import classNames from "classnames";
import {
    LogOutIcon,
    Menu,
    MoreHorizontalIcon,
    SettingsIcon,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebarStore } from "../../store/sidebar";
import { useTopbarStore } from "../../store/topbar";
import { trpc } from "../../utils/trpc";
import { Navigation } from "./Navigation";
import PerferencesDialog from "./PerferencesDialog";

export function Sidebar() {
    const { isExpand, toggle, collapse } = useSidebarStore();
    const isShowTopbar = useTopbarStore((state) => state.isShow);

    useEffect(() => {
        if (window.innerWidth <= 768) {
            collapse();
        }
    }, []);

    return (
        <div className="z-50 relative">
            <Button
                variant={isExpand ? "ghost" : "shadow"}
                className={cn("fixed m-3 w-10 rounded-full p-0 z-10", {
                    "max-[1240px]:hidden": isShowTopbar && !isExpand,
                })}
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
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();

    const userInfoQuery = trpc.user.getUserInfo.useQuery();
    const username = isLoggedInQuery.data
        ? `${userInfoQuery.data?.firstName} ${userInfoQuery.data?.lastName}`
        : null;

    const [isHidden, setIsHidden] = useState(false);
    const [isCollapse, setIsCollapse] = useState(false);

    const [isOpenPerferences, setIsOpenPerferences] = useState(false);

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
            <div className="absolute flex flex-col bottom-0 left-0 right-0 w-full gap-3 p-3 bg-background/50">
                {username ? (
                    <div className="flex gap-1">
                        <SidebarItem
                            className="grow"
                            href="/app/profile"
                            icon={<User />}
                        >
                            {username}
                        </SidebarItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="ml-auto">
                                <Button className="px-2" variant="ghost">
                                    <MoreHorizontalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setIsOpenPerferences(true)
                                        }
                                    >
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Preferences</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-700">
                                        <LogOutIcon className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <SidebarItem href="/auth/login">Log in</SidebarItem>
                )}
            </div>
            <PerferencesDialog
                open={isOpenPerferences}
                onOpenChange={setIsOpenPerferences}
            />
        </div>
    );
}

interface SidebarItemProps {
    href: string;
    children?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

export function SidebarItem(props: SidebarItemProps) {
    const pathname = usePathname();

    return (
        <Link
            href={props.href}
            className={cn(
                "flex items-center h-10 py-2 px-4 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground hover:no-underline",
                { "bg-accent": pathname === props.href },
                props.className,
            )}
        >
            {props.icon ? <span className="mr-3">{props.icon}</span> : null}
            {props.children}
        </Link>
    );
}
