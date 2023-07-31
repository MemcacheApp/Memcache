"use client";

import { trpc } from "@/src/app/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../ui/components/Button";
import { Input } from "../../../../ui/components/Input";

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({
        message: "Must be a valid email",
    }),
    password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function page() {
    const { push } = useRouter();

    const isLoggedInQuery = trpc.user.isLoggedIn.useQuery();
    useEffect(() => {
        if (isLoggedInQuery.data) {
            push("/app/saves");
        }
    }, [isLoggedInQuery.data]);

    const loginMutation = trpc.user.login.useMutation({
        onSuccess: async () => {
            await isLoggedInQuery.refetch();
            push("/app/saves");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
    const [passwordShown, setPasswordShown] = useState<boolean>(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form
                className="flex flex-col gap-3 w-[32rem] px-10"
                action=""
                onSubmit={handleSubmit((data: LoginFormData) => {
                    loginMutation.mutate(data);
                })}
            >
                <div className="flex items-center self-start mb-4">
                    <User className="mr-3" size={36} strokeWidth={1.75} />
                    <h1 className="text-3xl">Login</h1>
                </div>
                <div>
                    <Input
                        type="text"
                        title="Email"
                        placeholder="Email"
                        id="login-email-input"
                        {...register("email", { required: true })}
                    />
                    {errors.email ? (
                        <span className="text-sm text-red-600/60">
                            {errors.email.message}
                        </span>
                    ) : (
                        loginMutation.error?.message ===
                            "No account exists for this email" && (
                            <span className="text-sm text-red-600/60">
                                {loginMutation.error.message}
                            </span>
                        )
                    )}
                </div>
                <div className="relative">
                    <Input
                        type={passwordShown ? "text" : "password"}
                        title="Password"
                        placeholder="Password"
                        id="login-password-input"
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
                    {errors.password ? (
                        <span className="text-sm text-red-600/60">
                            {errors.password.message}
                        </span>
                    ) : (
                        loginMutation.error?.message ===
                            "The password is incorrect" && (
                            <span className="text-sm text-red-600/60">
                                {loginMutation.error.message}
                            </span>
                        )
                    )}
                </div>
                <Button type="submit">Login</Button>
                <p className="text-sm">
                    <span>Don&apos;t have an account? </span>
                    <Link className="underline" href={"/auth/signup"}>
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
