"use client";
import { Button } from "@/ui/components";
import { PageTitle } from "../../../../ui/components/typography";
import { trpc } from "../../utils/trpc";
import { Pencil } from "lucide-react";
import { useState } from "react";

function ProfileInfo({
    title,
    info,
    edit,
}: {
    title: string;
    info: string;
    edit: (newInfo: string) => void;
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <>
            <div className="">
                <strong>{title}</strong>
            </div>
            <div className="col-span-2">{info}</div>
            <div className="justify-self-end">
                <button
                    type="button"
                    className="p-2 rounded-md hover:bg-slate-200 w-fit h-fit"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil size={20} />
                </button>
            </div>
        </>
    );
}

export default function ProfilePage() {
    const updateEmailMutation = trpc.user.updateEmail.useMutation();
    return (
        <div className="flex flex-col">
            <PageTitle>Profile</PageTitle>
            <div className="grid w-full max-w-6xl grid-cols-4 border-solid border-y-2 border-slate-200">
                <ProfileInfo
                    title={"Email"}
                    info={"johnsmith@gmail.com"}
                    edit={() => {
                        console.log("Email");
                    }}
                />
                <ProfileInfo
                    title={"First name"}
                    info={"John"}
                    edit={() => {
                        console.log("First name");
                    }}
                />
                <ProfileInfo
                    title={"Last name"}
                    info={"Smith"}
                    edit={() => {
                        console.log("Last name");
                    }}
                />
            </div>
        </div>
    );
}
