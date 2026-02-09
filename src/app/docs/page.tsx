"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Rocket, BookOpen, Settings } from "lucide-react";

export default function DocsPage() {
  const docs = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of the Alex Dashboard and how to get up and running.",
      icon: Rocket,
      href: "/docs/getting-started",
    },
    {
      id: "api-reference",
      title: "API Reference",
      description: "Complete API documentation for all Dashboard endpoints and integrations.",
      icon: BookOpen,
      href: "/docs/api-reference",
    },
    {
      id: "configuration",
      title: "Configuration",
      description: "Setup and configure the Dashboard for your environment.",
      icon: Settings,
      href: "/docs/configuration",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to use the Alex Dashboard and OpenClaw integration.
          </p>
        </div>

        {/* Docs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link key={doc.id} href={doc.href}>
                <div className="bg-card border border-border rounded-lg p-6 hover:bg-accent hover:border-accent transition-colors cursor-pointer h-full flex flex-col">
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{doc.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-4">{doc.description}</p>
                  <Button variant="outline" className="w-full">
                    Read More →
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
