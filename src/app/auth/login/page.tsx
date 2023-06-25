"use client";

import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { LuUser } from "react-icons/lu";
import Link from "next/link";
import { PageTitle } from "../../../../ui/components/typography";
import { Input } from "../../../../ui/components/Input";
import { Button } from "../../../../ui/components/Button";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const loginMutation = trpc.user.login.useMutation();
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
                <PageTitle>Login</PageTitle>
            </div>
            <form
                className="flex flex-col gap-3"
                action=""
                onSubmit={handleSubmit((data: LoginFormData) => {
                    loginMutation.mutate(data);
                })}
            >
                <div>
                    <Input
                        type="email"
                        title="Email"
                        placeholder="Email"
                        id="login-email-input"
                        {...register("email", { required: true })}
                    />
                    {errors.email ? (
                        <span>{errors.email.message}</span>
                    ) : (
                        loginMutation.error?.message ===
                            "No account exists for this email" && (
                            <span>{loginMutation.error.message}</span>
                        )
                    )}
                </div>
                <div>
                    <Input
                        type="password"
                        title="Password"
                        placeholder="Password"
                        id="login-password-input"
                        {...register("password", { required: true })}
                    />
                    {errors.password ? (
                        <span>{errors.password.message}</span>
                    ) : (
                        loginMutation.error?.message ===
                            "Incorrect password" && (
                            <span>{loginMutation.error.message}</span>
                        )
                    )}
                </div>
                <Button type="submit">Login</Button>
                <p>
                    <span>Don&apos;t have an account? </span>
                    <Link className="underline" href={"/signup"}>
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
