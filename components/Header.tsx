"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CalendarClock } from "lucide-react";

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/70 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-6 w-6" />
          <span className="text-lg font-semibold">Sistema de Confirmación</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
