import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Notifications from "@/app/_components/notifications/notifications.client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Suji | Money Manager",
  description: "Money manager",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="h-full w-full">
        <body className={`h-full w-full font-sans ${inter.variable}`}>
          <Notifications />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
