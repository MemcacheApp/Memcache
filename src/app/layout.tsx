import { TrpcProvider } from "./utils/trpc-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import classNames from "classnames";
import { Sidebar } from "../../ui/components";

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
                <TrpcProvider>{children}</TrpcProvider>
            </body>
        </html>
    );
}
