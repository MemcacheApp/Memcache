"use client";

import { LuMenu } from "react-icons/lu";
import { Button, Navigation } from ".";

export function Sidebar() {
    return (
        <div className="fixed flex flex-col w-64 h-full border-r bg-background">
            <Button variant="ghost" className="m-3 w-10 !rounded-full p-0">
                <div className="h-4 w-4">
                    <LuMenu size={16} />
                </div>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <Navigation />
        </div>
    );
}