import { Palette, Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

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
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex hover:bg-surface-alt"
            asChild
          >
            <a 
              href="https://github.com/hadiuzzamanbappy/color-craft" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>

      </div>
    </header>
  );
}