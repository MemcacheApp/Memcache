"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/src/app/utils/trpc";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LuUser } from "react-icons/lu";
import { Button, Input, PageTitle } from "../components";

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

/*

TODO: .

Encrypt password
Add go to login link
Add "Make password visible option"
Change error messages
Add loading animation (button animation)
Change button style
Add next auth

 */

export default function page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({ resolver: zodResolver(userSchema) });
    const createUserMutation = trpc.user.createUser.useMutation();

    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();
    useEffect(() => {
        if (isLoggedInQuery.data) {
            redirect("/");
        }
    }, [isLoggedInQuery.data]);

    return (
        <div>
            <div className="flex items-center">
                <LuUser className="mr-5" size={36} />
                <PageTitle>Sign Up</PageTitle>
            </div>
            <form
                className="flex flex-col gap-3"
                action=""
                onSubmit={handleSubmit((data: SignUpFormData) => {
                    createUserMutation.mutate(data);
                })}
            >
                <div>
                    <Input
                        type="text"
                        title="First name"
                        placeholder="First name"
                        id="sign-up-first-name-input"
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span>{errors.firstName.message}</span>
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
                    {errors.lastName && <span>{errors.lastName.message}</span>}
                </div>
                <div>
                    <Input
                        type="email"
                        title="Email"
                        placeholder="Email"
                        id="sign-up-email-input"
                        {...register("email", { required: true })}
                    />
                    {errors.email ? (
                        <span>{errors.email.message}</span>
                    ) : (
                        createUserMutation.error?.data?.code ===
                            "BAD_REQUEST" && (
                            <span>{createUserMutation.error.message}</span>
                        )
                    )}
                </div>
                <div>
                    <Input
                        type="password"
                        title="Password"
                        placeholder="Password"
                        id="sign-up-password-input"
                        {...register("password", { required: true })}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                <Button type="submit">Create account</Button>
                <p>
                    Already have an account?{" "}
                    <Link className="underline" href={"/login"}>
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}
