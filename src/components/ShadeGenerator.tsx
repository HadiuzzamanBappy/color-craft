import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Copy, Download, Check } from 'lucide-react';
import { generateShades, exportToCssVariables, generateStepNumbers } from '@/lib/colorUtils';
import { useToast } from '@/hooks/use-toast';

interface ShadeGeneratorProps {
  baseColor: string;
}

export function ShadeGenerator({ baseColor }: ShadeGeneratorProps) {
  const [steps, setSteps] = useState([9]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const shades = generateShades(baseColor, (steps[0] + 1) / 2);
  const stepNumbers = generateStepNumbers(shades.length);

  const copyToClipboard = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
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

  const exportCssVariables = () => {
    const cssVars = exportToCssVariables(shades, 'primary');
    const cssContent = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-shades.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "CSS exported!",
      description: "Color shades saved as CSS variables",
    });
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Color Shades</h3>
          <Button
            onClick={exportCssVariables}
            variant="outline"
            size="sm"
            className="border-border hover:bg-surface-alt"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSS
          </Button>
        </div>

        {/* Steps Slider */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Number of shades: {steps[0]}
          </Label>
          <Slider
            value={steps}
            onValueChange={setSteps}
            max={15}
            min={5}
            step={2}
            className="w-full"
          />
        </div>

        {/* Color Shades Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {shades.map((shade, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div
                className="h-20 w-full transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: shade }}
              />
              <div className="p-3 bg-surface">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">
                      {stepNumbers[index]}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {shade}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(shade, index)}
                    className="h-8 w-8 p-0 ml-2 hover:bg-surface-alt"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}