import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navigation from "@/components/Navigation";
import { Sidebar } from "@/components/Sidebar";

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
            {/* Navigation (top bar) */}
            <Navigation />

            {/* Sidebar (desktop only, hidden on mobile) */}
            <div className="hidden md:block fixed left-0 top-16 w-[200px] h-[calc(100vh-64px)] bg-background border-r border-border">
              <Sidebar />
            </div>

            {/* Main Content */}
            <main className="md:ml-[200px] mt-16 flex flex-col flex-1">
              <div className="flex-1 p-4 md:p-6">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
