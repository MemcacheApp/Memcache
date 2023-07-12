"use client";

import React from "react";
import { Sidebar } from "./components/Sidebar";
import { useSidebarStore } from "../store/sidebar";
import classNames from "classnames";

export default function layout({ children }: { children: React.ReactNode }) {
    const isExpand = useSidebarStore((state) => state.isExpand);

    return (
        <div className={"bg-muted h-screen"}>
            <Sidebar />
            <div
                className={classNames(
                    "flex flex-col items-center transition-[margin-left]",
                    {
                        "md:ml-64": isExpand,
                    }
                )}
            >
                <main className="w-full max-w-[1200px]">{children}</main>
            </div>
        </div>
    );
}
