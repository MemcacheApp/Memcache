"use client";

import { LogInRequired } from "@/ui/components";
import classNames from "classnames";
import React from "react";
import { useSidebarStore } from "../store/sidebar";
import "./app.css";
import { Sidebar } from "./components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
    const isExpand = useSidebarStore((state) => state.isExpand);

    return (
        <div className={"h-screen"}>
            <LogInRequired>
                <Sidebar />
                <div
                    className={classNames(
                        "h-full flex flex-col items-center transition-[margin-left]",
                        {
                            "md:ml-64": isExpand,
                        },
                    )}
                >
                    <main className="w-full h-full max-w-[1200px]">
                        {children}
                    </main>
                </div>
            </LogInRequired>
        </div>
    );
}
