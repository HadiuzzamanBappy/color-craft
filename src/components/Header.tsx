import { Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">ColorCraft</h1>
            <p className="text-xs text-muted-foreground">Professional Color Generator</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            {/* Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggle />
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-foreground font-medium text-xs rounded-md shadow-lg">
                <p>Toggle light/dark mode</p>
              </TooltipContent>
            </Tooltip>

            {/* GitHub */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border border-border bg-surface-alt/50 hover:bg-surface-alt hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-105"
                  asChild
                >
                  <a 
                    href="https://github.com/HadiuzzamanBappy/color-craft" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub Repository"
                  >
                    <Github className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-foreground font-medium text-xs rounded-md shadow-lg">
                <p>GitHub Repository</p>
              </TooltipContent>
            </Tooltip>

            {/* Support */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border border-border bg-surface-alt/50 hover:bg-surface-alt hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all duration-300 group shadow-sm hover:shadow-md hover:scale-105"
                  asChild
                >
                  <a 
                    href="https://www.picodevs.com/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Get Support"
                  >
                    <Heart className="h-4 w-4 transition-all duration-300 group-hover:animate-pulse group-hover:text-red-500" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-popover border border-border text-foreground font-medium text-xs rounded-md shadow-lg">
                <p>Support & Contact</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </div>
    </header>
  );
}