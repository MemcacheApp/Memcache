"use client";

import React, { useEffect } from "react";
import styles from "@/src/app/styles/forms.module.css";
import { UserCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";
import { trpc } from "@/src/app/utils/trpc";
import Link from "next/link";
import { redirect } from "next/navigation";
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

export default function SignUpForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({ resolver: zodResolver(userSchema) });

    const queryClient = useQueryClient();
    const createUserMutation = trpc.user.createUser.useMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users", "isLoggedIn"],
            });
        },
    });
    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();
    useEffect(() => {
        if (isLoggedInQuery.data) {
            redirect("/");
        }
    }, [isLoggedInQuery.data]);

    return (
        <form
            className={styles["form-container"]}
            action=""
            onSubmit={handleSubmit((data: SignUpFormData) => {
                createUserMutation.mutate(data);

                // TODO: need to change pages
            })}
        >
            <div className={styles["header"]}>
                <UserCircle2 size={36} />
                <h1 className={styles["form-title"]}>Sign Up</h1>
            </div>

            <div className={styles["name"]}>
                <div className={styles["form-field"]}>
                    <label htmlFor="sign-up-first-name-input">First name</label>
                    <input
                        type="text"
                        id="sign-up-first-name-input"
                        className={styles["input"]}
                        {...register("firstName", { required: true })}
                    />
                    {errors.firstName && (
                        <span className={styles["error-message"]}>
                            {errors.firstName.message}
                        </span>
                    )}
                </div>
                <div className={styles["form-field"]}>
                    <label htmlFor="sign-up-last-name-input">Last name</label>
                    <input
                        type="text"
                        id="sign-up-last-name-input"
                        className={styles["input"]}
                        {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                        <span className={styles["error-message"]}>
                            {errors.lastName.message}
                        </span>
                    )}
                </div>
            </div>

            <div className={styles["form-field"]}>
                <label htmlFor="sign-up-email-input">Email</label>
                <input
                    type="email"
                    id="sign-up-email-input"
                    className={styles["input"]}
                    {...register("email", { required: true })}
                />
                {errors.email ? (
                    <span className={styles["error-message"]}>
                        {errors.email.message}
                    </span>
                ) : (
                    createUserMutation.error?.data?.code === "BAD_REQUEST" && (
                        <span className={styles["error-message"]}>
                            {createUserMutation.error.message}
                        </span>
                    )
                )}
            </div>
            <div className={styles["form-field"]}>
                <label htmlFor="sign-up-password-input">Password</label>
                <input
                    type="password"
                    id="sign-up-password-input"
                    className={styles["input"]}
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <span className={styles["error-message"]}>
                        {errors.password.message}
                    </span>
                )}
            </div>
            <button type="submit" className={styles["submit-button"]}>
                Create account
            </button>

            <span className={styles["link-nav"]}>
                Already have an account? <Link href={"/login"}>Log in</Link>
            </span>
        </form>
    );
}
