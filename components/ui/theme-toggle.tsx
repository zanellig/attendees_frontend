"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <span className="sr-only">Cambiar tema</span>
        <div className="h-5 w-5 animate-pulse bg-muted-foreground/20 rounded-full" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 relative"
    >
      <span className="sr-only">Cambiar tema</span>
      <Sun
        className={`h-5 w-5 absolute transition-all ${
          theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`h-5 w-5 absolute transition-all ${
          theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </Button>
  );
}
