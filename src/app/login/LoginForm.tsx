"use client";

import React, { useEffect, useLayoutEffect } from "react";
import styles from "@/src/app/styles/forms.module.css";

import { UserCircle2 } from "lucide-react";
import { trpc } from "@/src/app/utils/trpc";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { redirect } from "next/navigation";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

/*
TODO:
send email for resetting password
*/

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    const loginMutation = trpc.users.login.useMutation();

    const isLoggedInQuery = trpc.users.isLoggedIn.useQuery();
    useEffect(() => {
        if (isLoggedInQuery.data) {
            redirect("/");
        }
    }, [isLoggedInQuery.data]);

    return (
        <form
            className={styles["form-container"]}
            action=""
            onSubmit={handleSubmit((data: LoginFormData) => {
                loginMutation.mutate(data);
            })}
        >
            <div className={styles["header"]}>
                <UserCircle2 size={36} />
                <h1 className={styles["form-title"]}>Login</h1>
            </div>

            <div className={styles["form-field"]}>
                <label htmlFor="login-email-input">Email</label>
                <input
                    type="email"
                    id="login-email-input"
                    className={styles["input"]}
                    {...register("email", { required: true })}
                />
                {errors.email ? (
                    <span className={styles["error-message"]}>
                        {errors.email.message}
                    </span>
                ) : (
                    loginMutation.error?.message ===
                        "No account exists for this email" && (
                        <span className={styles["error-message"]}>
                            {loginMutation.error.message}
                        </span>
                    )
                )}
            </div>
            <div className={styles["form-field"]}>
                <label htmlFor="login-password-input">Password</label>
                <input
                    type="text"
                    id="login-password-input"
                    className={styles["input"]}
                    {...register("password", { required: true })}
                />
                {errors.password ? (
                    <span className={styles["error-message"]}>
                        {errors.password.message}
                    </span>
                ) : (
                    loginMutation.error?.message === "Incorrect password" && (
                        <span className={styles["error-message"]}>
                            {loginMutation.error.message}
                        </span>
                    )
                )}
            </div>
            <button type="submit" className={styles["submit-button"]}>
                Login
            </button>

            <span className={styles["link-nav"]}>
                Don&apos;t have an account? <Link href={"/signup"}>Sign up</Link>
            </span>
        </form>
    );
}
