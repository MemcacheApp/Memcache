import { TrpcProvider } from "./utils/trpc-provider";
import "./globals.css";
import { Inter } from "next/font/google";

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
            <body className={inter.className}>
                <TrpcProvider>{children}</TrpcProvider>
            </body>
        </html>
    );
}
