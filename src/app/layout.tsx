import { TrpcProvider } from "./utils/trpc-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import classNames from "classnames";
import { Sidebar } from "./components";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Memcache",
    description: "Memcache web app",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={classNames(inter.className, "bg-muted")}>
                <TrpcProvider>
                    <Sidebar />
                    <div className="ml-64 flex flex-col items-center">
                        <main className="w-full max-w-6xl p-8">{children}</main>
                    </div>
                </TrpcProvider>
            </body>
        </html>
    );
}
