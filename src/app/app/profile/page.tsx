"use client";
import { Button, Input } from "@/ui/components";
import { PageTitle } from "../../../../ui/components/typography";
import { trpc } from "../../utils/trpc";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { ZodError, z } from "zod";

function ProfileInfo({
    title,
    info,
    submitEdit,
    errorMessage,
}: {
    title: string;
    info: string;
    submitEdit: (
        newInfo: string,
        setErrorMessage: (errMsg: string) => void
    ) => void;
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState(null);

    return (
        <>
            <div className="">
                <strong>{title}</strong>
            </div>
            <div className="col-span-2 ">
                <form
                    action=""
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("form submit");
                    }}
                >
                    {isEditing ? (
                        <Input
                            placeholder={`Please enter your new ${title.toLowerCase()}`}
                        />
                    ) : (
                        <span className="px-3 py-2 text-sm">{info}</span>
                    )}
                </form>
            </div>
            <div className="justify-self-end">
                {isEditing ? (
                    <div>
                        <Button variant={"outline"} className="bg-white">
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
        </>
    );
}

const emailSchema = z.string().min(1).email();

export default function ProfilePage() {
    const updateEmailMutation = trpc.user.updateEmail.useMutation();
    return (
        <div className="flex flex-col">
            <PageTitle>Profile</PageTitle>
            <div className="grid items-center w-full max-w-6xl grid-cols-4 gap-2 px-3 py-2 border-solid border-y-2 border-slate-200">
                <ProfileInfo
                    title={"Email"}
                    info={"johnsmith@gmail.com"}
                    submitEdit={(
                        newEmail: string,
                        setErrorMessage: (errMsg: string) => void
                    ) => {
                        try {
                            emailSchema.parse(newEmail);
                            updateEmailMutation.mutate({ newEmail });
                        } catch (e) {
                            if (e instanceof ZodError) {
                                setErrorMessage(e.message);
                            } else {
                                console.log(e);
                            }
                        }
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
