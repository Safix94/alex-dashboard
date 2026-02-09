"use client";

import { useState, useEffect } from "react";

interface UsageData {
  tokens: number;
  cost: number;
  model: string;
}

export function UsageDisplay() {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/alex/usage");
        if (res.ok) {
          const data = await res.json();
          setUsage(data);
        }
      } catch {
        // Silently fail — usage display is non-critical
      }
    };

    fetchUsage();
    const interval = setInterval(fetchUsage, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!usage) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
      <span title="Tokens used">
        🪙 {usage.tokens?.toLocaleString() ?? "—"}
      </span>
      <span className="text-border">|</span>
      <span title="Cost">
        💰 €{typeof usage.cost === "number" ? usage.cost.toFixed(3) : "—"}
      </span>
    </div>
  );
}
