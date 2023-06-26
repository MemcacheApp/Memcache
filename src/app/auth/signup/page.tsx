"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/src/app/utils/trpc";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, Input } from "../../../../ui/components";
import { Eye, EyeOff, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const userSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
});

type SignUpFormData = z.infer<typeof userSchema>;

export default function page() {
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();
    useEffect(() => {
        if (isLoggedInQuery.data) {
            redirect("/");
        }
    }, [isLoggedInQuery.data]);

    const queryClient = useQueryClient();
    const createUserMutation = trpc.user.createUser.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user", "isLoggedIn"],
            });
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({ resolver: zodResolver(userSchema) });

    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <div className="flex items-center justify-center h-screen">
            <form
                className="flex flex-col gap-3 w-[32rem] px-10"
                action=""
                onSubmit={handleSubmit((data: SignUpFormData) => {
                    createUserMutation.mutate(data);
                })}
            >
                <div className="flex items-center self-start mb-4">
                    <User className="mr-3" size={36} strokeWidth={1.75} />
                    <h1 className="text-3xl">Sign Up</h1>
                </div>
                <div className="flex">
                    <div className="mr-3">
                        <Input
                            type="text"
                            title="First name"
                            placeholder="First name"
                            id="sign-up-first-name-input"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && (
                            <span className="mt-2 text-sm text-red-600/60">
                                {errors.firstName.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <Input
                            type="text"
                            title="Last name"
                            placeholder="Last name"
                            id="sign-up-last-name-input"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && (
                            <span className="mt-2 text-sm text-red-600/60">
                                {errors.lastName.message}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <Input
                        type="text" // Leave this as text or else the error message won't appear properly
                        title="Email"
                        placeholder="Email"
                        id="sign-up-email-input"
                        {...register("email", { required: true })}
                    />
                    {errors.email ? (
                        <span className="mt-2 text-sm text-red-600/60">
                            {errors.email.message}
                        </span>
                    ) : (
                        createUserMutation.error?.data?.code ===
                            "BAD_REQUEST" && (
                            <span className="mt-2 text-sm text-red-600/60">
                                {createUserMutation.error.message}
                            </span>
                        )
                    )}
                </div>
                <div className="relative">
                    <Input
                        type={passwordShown ? "text" : "password"}
                        title="Password"
                        placeholder="Password"
                        id="sign-up-password-input"
                        {...register("password", { required: true })}
                    />
                    <button
                        onClick={() => setPasswordShown((prev) => !prev)}
                        className="absolute w-fit right-[10px] top-[10px]"
                        type="button"
                    >
                        {passwordShown ? (
                            <EyeOff size={20} color="grey" />
                        ) : (
                            <Eye size={20} color="grey" />
                        )}
                    </button>
                    {errors.password && (
                        <span className="mt-2 text-sm text-red-600/60">
                            {errors.password.message}
                        </span>
                    )}
                </div>
                <Button type="submit">Create account</Button>
                <p className="text-sm">
                    Already have an account?{" "}
                    <Link className="underline" href={"/login"}>
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}
