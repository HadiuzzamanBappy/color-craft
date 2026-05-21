import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      className={cn(
        "rounded-xl border border-border bg-surface-alt/50 hover:bg-surface-alt hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-105",
        className
      )}
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
    >
      {/* Render after mount to avoid hydration mismatch */}
      {mounted && current === "dark" ? (
        <Sun className="h-4 w-4 transition-all duration-300 group-hover:rotate-45 group-hover:text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-300 group-hover:-rotate-12 group-hover:text-blue-400" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
