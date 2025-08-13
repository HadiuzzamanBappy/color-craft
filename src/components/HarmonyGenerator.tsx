import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import {
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateTetradic,
  generateSplitComplementary
} from '@/lib/colorUtils';
import { useToast } from '@/hooks/use-toast';

interface HarmonyGeneratorProps {
  baseColor: string;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary';

const harmonyTypes: Array<{ type: HarmonyType; name: string; description: string }> = [
  { type: 'complementary', name: 'Complementary', description: 'Two opposite colors on the color wheel' },
  { type: 'analogous', name: 'Analogous', description: 'Three adjacent colors on the color wheel' },
  { type: 'triadic', name: 'Triadic', description: 'Three evenly spaced colors on the color wheel' },
  { type: 'tetradic', name: 'Tetradic', description: 'Four colors forming a rectangle on the color wheel' },
  { type: 'split-complementary', name: 'Split Complementary', description: 'Base color plus two adjacent to its complement' }
];

export function HarmonyGenerator({ baseColor }: HarmonyGeneratorProps) {
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('complementary');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const generateHarmony = (type: HarmonyType): string[] => {
    switch (type) {
      case 'complementary':
        return generateComplementary(baseColor);
      case 'analogous':
        return generateAnalogous(baseColor);
      case 'triadic':
        return generateTriadic(baseColor);
      case 'tetradic':
        return generateTetradic(baseColor);
      case 'split-complementary':
        return generateSplitComplementary(baseColor);
      default:
        return [baseColor];
    }
  };

  const harmonyColors = generateHarmony(selectedHarmony);

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
      toast({
        title: "Color copied!",
        description: `${color} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy color to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground">Color Harmonies</h3>

        {/* Harmony Type Selector */}
        <div className="flex flex-wrap gap-2">
          {harmonyTypes.map(({ type, name }) => (
            <Button
              key={type}
              variant={selectedHarmony === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedHarmony(type)}
              className={
                selectedHarmony === type
                  ? "bg-primary text-primary-foreground"
                  : "border-border hover:bg-surface-alt"
              }
            >
              {name}
            </Button>
          ))}
        </div>

        {/* Description */}
        <div className="p-4 rounded-lg bg-surface-alt border border-border">
          <p className="text-sm text-muted-foreground">
            {harmonyTypes.find(h => h.type === selectedHarmony)?.description}
          </p>
        </div>

        {/* Color Harmony Display */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {harmonyColors.map((color, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div
                  className="h-24 w-24 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(color);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-alt/80 hover:bg-surface-alt"
                  >
                    {copiedColor === color ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge variant="secondary" className="text-xs font-mono bg-surface/90 text-foreground">
                    {color}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Harmony Preview Bar */}
          <div className="h-16 rounded-lg overflow-hidden border border-border shadow-sm">
            <div className="flex h-full">
              {harmonyColors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 transition-all duration-500 hover:flex-[1.2] cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}