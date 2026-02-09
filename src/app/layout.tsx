import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";
import { PresenceContainer } from "@/components/PresenceContainer";

export const metadata: Metadata = {
  title: "Alex Dashboard",
  description: "Personal assistant dashboard for OpenClaw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <PresenceContainer />
            <main className="flex-1 ml-[200px]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
