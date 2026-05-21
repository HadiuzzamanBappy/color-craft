import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { hexToRgb, generateShades, generateStepNumbers } from '@/lib/colorUtils';
interface NeutralColorPanelProps {
  neutrals: {
    white: string[];
    black: string[];
    gray: string[];
  };
  onUpdateNeutrals: (whiteBase: string, blackBase: string, grayBase: string) => void;
}

export function NeutralColorPanel({ neutrals, onUpdateNeutrals }: NeutralColorPanelProps) {
  const [copiedShade, setCopiedShade] = useState<string | null>(null);
  const { toast } = useToast();

  // Base inputs for neutrals with persistence
  const [whiteBase, setWhiteBase] = useState<string>(() => {
    return localStorage.getItem('color-craft-neutral-white') || '#ffffff';
  });
  const [blackBase, setBlackBase] = useState<string>(() => {
    return localStorage.getItem('color-craft-neutral-black') || '#000000';
  });
  const [grayBase, setGrayBase] = useState<string>(() => {
    return localStorage.getItem('color-craft-neutral-gray') || '#808080';
  });

  useEffect(() => {
    localStorage.setItem('color-craft-neutral-white', whiteBase);
    localStorage.setItem('color-craft-neutral-black', blackBase);
    localStorage.setItem('color-craft-neutral-gray', grayBase);
    onUpdateNeutrals(whiteBase, blackBase, grayBase);
  }, [whiteBase, blackBase, grayBase, onUpdateNeutrals]);

  const alphaPercents = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80];
  const toRgba = (hex: string, alpha: number) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const whiteAlphaShades = alphaPercents.map((p) => toRgba(whiteBase, p / 100));
  const blackAlphaShades = alphaPercents.map((p) => toRgba(blackBase, p / 100));
  const grayShades = generateShades(grayBase, 5); // 100-900 (9 steps)

  const handleCopyShade = async (shade: string, type: string, index: number) => {
    try {
      await navigator.clipboard.writeText(shade);
      setCopiedShade(`${type}-${index}`);
      setTimeout(() => setCopiedShade(null), 2000);
      toast({
        title: "Color copied!",
        description: `${shade} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy color to clipboard",
        variant: "destructive",
      });
    }
  };

  const exportNeutralCss = () => {
    let css = ':root\n{\n';

    // White opacity 8-80%
    whiteAlphaShades.forEach((shade, idx) => {
      const pct = alphaPercents[idx];
      css += `  --white-${pct}: ${shade};\n`;
    });

    // Black opacity 8-80%
    blackAlphaShades.forEach((shade, idx) => {
      const pct = alphaPercents[idx];
      css += `  --black-${pct}: ${shade};\n`;
    });

    // Gray 100-900
    const graySteps = [100,200,300,400,500,600,700,800,900];
    grayShades.forEach((shade, idx) => {
      css += `  --gray-${graySteps[idx]}: ${shade};\n`;
    });

    css += '}';
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neutral-colors.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Neutrals exported!",
      description: "Neutral colors saved as CSS variables",
    });
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Neutral Colors</h3>
            <Badge variant="secondary" className="ml-2">
              System Colors
            </Badge>
          </div>
          <Button
            onClick={exportNeutralCss}
            variant="outline"
            size="sm"
            className="border-border hover:bg-surface-alt"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSS
          </Button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-alt rounded-lg border border-border">
          <div className="space-y-2">
            <Label className="text-sm font-medium">White base</Label>
            <div className="flex gap-2">
              <Input type="color" value={whiteBase} onChange={(e)=>setWhiteBase(e.target.value)} className="w-12 h-10 p-1 border-border" />
              <Input type="text" value={whiteBase} onChange={(e)=>setWhiteBase(e.target.value)} className="flex-1 font-mono text-xs" />
            </div>
            <p className="text-xs text-muted-foreground">Opacity steps: 8–80%</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Black base</Label>
            <div className="flex gap-2">
              <Input type="color" value={blackBase} onChange={(e)=>setBlackBase(e.target.value)} className="w-12 h-10 p-1 border-border" />
              <Input type="text" value={blackBase} onChange={(e)=>setBlackBase(e.target.value)} className="flex-1 font-mono text-xs" />
            </div>
            <p className="text-xs text-muted-foreground">Opacity steps: 8–80%</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gray base</Label>
            <div className="flex gap-2">
              <Input type="color" value={grayBase} onChange={(e)=>setGrayBase(e.target.value)} className="w-12 h-10 p-1 border-border" />
              <Input type="text" value={grayBase} onChange={(e)=>setGrayBase(e.target.value)} className="flex-1 font-mono text-xs" />
            </div>
            <p className="text-xs text-muted-foreground">Shades: 100–900</p>
          </div>
        </div>

        {/* Neutral Color Groups */}
        <div className="space-y-6">
          {/* White Opacity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground capitalize">white opacity</h4>
              <Badge variant="outline" className="text-xs">{alphaPercents.length} steps</Badge>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {whiteAlphaShades.map((shade, index) => {
                const pct = alphaPercents[index];
                const shadeId = `white-${pct}`;
                return (
                  <div key={index} className="group relative overflow-hidden rounded-md border border-border hover:shadow-md transition-all duration-200">
                    <div className="h-16 w-full cursor-pointer" style={{ backgroundColor: shade }} onClick={() => handleCopyShade(shade, 'white', index)} />
                    <div className="p-2 bg-surface">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground">{pct}%</p>
                          <p className="text-xs font-mono text-muted-foreground truncate">{shade}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleCopyShade(shade, 'white', index)} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedShade === shadeId ? (<Check className="h-3 w-3 text-success" />) : (<Copy className="h-3 w-3" />)}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Black Opacity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground capitalize">black opacity</h4>
              <Badge variant="outline" className="text-xs">{alphaPercents.length} steps</Badge>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {blackAlphaShades.map((shade, index) => {
                const pct = alphaPercents[index];
                const shadeId = `black-${pct}`;
                return (
                  <div key={index} className="group relative overflow-hidden rounded-md border border-border hover:shadow-md transition-all duration-200">
                    <div className="h-16 w-full cursor-pointer" style={{ backgroundColor: shade }} onClick={() => handleCopyShade(shade, 'black', index)} />
                    <div className="p-2 bg-surface">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground">{pct}%</p>
                          <p className="text-xs font-mono text-muted-foreground truncate">{shade}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleCopyShade(shade, 'black', index)} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedShade === shadeId ? (<Check className="h-3 w-3 text-success" />) : (<Copy className="h-3 w-3" />)}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gray Shades */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground capitalize">gray shades</h4>
              <Badge variant="outline" className="text-xs">9 steps</Badge>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {grayShades.map((shade, index) => {
                const graySteps = [100,200,300,400,500,600,700,800,900];
                const stepNumber = graySteps[index];
                const shadeId = `gray-${index}`;
                return (
                  <div key={index} className="group relative overflow-hidden rounded-md border border-border hover:shadow-md transition-all duration-200">
                    <div className="h-16 w-full cursor-pointer" style={{ backgroundColor: shade }} onClick={() => handleCopyShade(shade, 'gray', index)} />
                    <div className="p-2 bg-surface">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground">{stepNumber}</p>
                          <p className="text-xs font-mono text-muted-foreground truncate">{shade}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleCopyShade(shade, 'gray', index)} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedShade === shadeId ? (<Check className="h-3 w-3 text-success" />) : (<Copy className="h-3 w-3" />)}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Usage Example */}
        <div className="p-4 bg-surface-alt rounded-lg border border-border">
          <h5 className="text-sm font-medium text-foreground mb-2">Usage Example</h5>
          <div className="text-xs font-mono text-muted-foreground space-y-1">
            <div>CSS: <span className="text-primary">color: var(--gray-600);</span></div>
            <div>Tailwind: <span className="text-primary">text-gray-600</span></div>
            <div>SCSS: <span className="text-primary">color: $gray-600;</span></div>
          </div>
        </div>
      </div>
    </Card>
  );
}