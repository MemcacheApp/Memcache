"use client";
import { Button, Input } from "@/ui/components";
import { PageTitle } from "../../../../ui/components/typography";
import { trpc } from "../../utils/trpc";
import { Pencil } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

function ProfileInfo({
    title,
    info,
    submitEdit,
}: {
    title: string;
    info: string;
    submitEdit: (newInfo: string) => Promise<void>;
}) {
    const [input, setInput] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="grid items-center grid-cols-4 my-2">
            <div className="col-span-1">
                <strong>{title}</strong>
            </div>
            <div className="col-span-2">
                {isEditing ? (
                    <>
                        <Input
                            placeholder={`Please enter your new ${title.toLowerCase()}`}
                            value={input}
                            onChange={(e: ChangeEvent) =>
                                setInput((e.target as HTMLInputElement).value)
                            }
                        />
                        <div>
                            {error && (
                                <span className="px-3 text-sm text-red-600/60">
                                    {error}
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <span className="px-3 py-2 text-sm">{info}</span>
                )}
            </div>
            <div className="col-span-1 justify-self-end">
                {isEditing ? (
                    <div>
                        <Button
                            variant={"outline"}
                            className="bg-white"
                            onClick={async (e) => {
                                e.preventDefault();
                                try {
                                    await submitEdit(input);
                                    setInput("");
                                    setIsEditing(false);
                                } catch (err) {
                                    if (err instanceof Error)
                                        setError(err.message);
                                }
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant={"outline"}
                            className="ml-1 bg-white"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant={"outline"}
                        className="p-0 m-0 bg-white"
                        onClick={() => setIsEditing(true)}
                    >
                        <Pencil size={20} />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const updateEmailMutation = trpc.user.updateEmail.useMutation({
        onSuccess: () =>
            queryClient.invalidateQueries([
                ["user", "getUserInfo"],
                {
                    type: "query",
                },
            ]),
    });
    const { data } = trpc.user.getUserInfo.useQuery();
    return (
        <div className="flex flex-col">
            <PageTitle>Profile</PageTitle>
            <div className="w-full max-w-6xl px-3 py-2 border-solid border-y-2 border-slate-200">
                <ProfileInfo
                    title={"Email"}
                    info={data?.email || "N/A"}
                    submitEdit={async (newEmail: string) => {
                        const result = z
                            .string()
                            .min(1)
                            .email()
                            .safeParse(newEmail);
                        if (!result.success) {
                            throw new Error(result.error.issues[0].message);
                        } else {
                            try {
                                await updateEmailMutation.mutateAsync({
                                    newEmail,
                                });
                            } catch (_) {
                                if (
                                    updateEmailMutation.error?.data?.code ===
                                    "BAD_REQUEST"
                                )
                                    throw new Error("Email is taken");
                            }
                        }
                    }}
                />

                <ProfileInfo
                    title={"First name"}
                    info={data?.firstName || "N/A"}
                    submitEdit={async () => {
                        console.log("First name");
                    }}
                />
                <ProfileInfo
                    title={"Last name"}
                    info={data?.lastName || "N/A"}
                    submitEdit={async () => {
                        console.log("Last name");
                    }}
                />
            </div>
        </div>
    );
}
