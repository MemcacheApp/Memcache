import React from "react";
import { Sidebar } from "../../../ui/components";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className={"bg-muted h-screen"}>
            <Sidebar />
            <div className="ml-64 flex flex-col items-center">
                <main className="w-full max-w-6xl p-8">{children}</main>
            </div>
        </div>
    );
}
