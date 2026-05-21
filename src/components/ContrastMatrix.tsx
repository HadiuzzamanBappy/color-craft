import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ColorShade, NeutralShades, COLOR_ROLE_LABELS } from '@/types/color';
import { calculateContrastRatio } from '@/lib/colorUtils';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface ContrastMatrixProps {
  colors: ColorShade[];
  neutrals: NeutralShades;
}

export function ContrastMatrix({ colors, neutrals }: ContrastMatrixProps) {
  const [customBg, setCustomBg] = useState('#0f172a');

  // Grab representative backgrounds
  const backgrounds = [
    { name: 'White', hex: '#ffffff', desc: 'Standard Light theme' },
    { name: 'Light Gray', hex: neutrals.gray[0] || '#f8f9fa', desc: 'System surface background' },
    { name: 'Dark Gray', hex: neutrals.gray[neutrals.gray.length - 1] || '#212529', desc: 'System card background' },
    { name: 'Pure Black', hex: '#000000', desc: 'High-contrast dark' },
    { name: 'Custom Background', hex: customBg, desc: 'User-defined check', isEditable: true }
  ];

  const getContrastScore = (ratio: number) => {
    if (ratio >= 7) return { label: 'AAA', variant: 'success' as const, color: 'text-success border-success bg-success/10' };
    if (ratio >= 4.5) return { label: 'AA', variant: 'success' as const, color: 'text-success border-success bg-success/10' };
    if (ratio >= 3) return { label: 'AA Large', variant: 'warning' as const, color: 'text-warning border-warning bg-warning/10' };
    return { label: 'Fail', variant: 'destructive' as const, color: 'text-destructive border-destructive bg-destructive/10' };
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Accessibility Contrast Matrix</h3>
        <p className="text-sm text-muted-foreground">
          Compare your system's base brand colors against multiple target background levels to audit readability and WCAG 2.1 guidelines.
        </p>
      </div>

      <Separator />

      {/* Custom Background Setter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-surface-alt rounded-lg border border-border">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Test Custom Background</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={customBg}
              onChange={(e) => setCustomBg(e.target.value)}
              className="w-12 h-10 p-1 border-border"
            />
            <Input
              type="text"
              value={customBg}
              onChange={(e) => setCustomBg(e.target.value)}
              className="flex-1 font-mono text-sm"
              placeholder="#0f172a"
            />
          </div>
        </div>
        <div className="flex flex-col justify-end text-xs text-muted-foreground">
          <p>The matrix below will update in real-time. AAA requires 7.0:1 for normal text, AA requires 4.5:1, and large text/UI components require 3.0:1.</p>
        </div>
      </div>

      {/* Contrast Grid Matrix */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-alt border-b border-border">
              <th className="p-4 font-semibold text-sm text-foreground">Brand Color</th>
              {backgrounds.map((bg, idx) => (
                <th key={idx} className="p-4 font-semibold text-sm text-foreground min-w-[120px]">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm truncate">{bg.name}</p>
                    <p className="text-xs font-mono text-muted-foreground">{bg.isEditable ? customBg : bg.hex}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {colors.map((color) => {
              return (
                <tr key={color.id} className="hover:bg-surface-alt/50 transition-colors">
                  {/* Brand Color Descriptor */}
                  <td className="p-4 flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-md border border-border shadow-sm flex-shrink-0"
                      style={{ backgroundColor: color.color }}
                    />
                    <div>
                      <p className="font-semibold text-sm text-foreground">{color.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{COLOR_ROLE_LABELS[color.role]}</p>
                    </div>
                  </td>

                  {/* Contrast ratios on background options */}
                  {backgrounds.map((bg, idx) => {
                    const bgHex = bg.isEditable ? customBg : bg.hex;
                    const ratio = calculateContrastRatio(color.color, bgHex);
                    const score = getContrastScore(ratio);

                    return (
                      <td key={idx} className="p-4">
                        <div className="space-y-2">
                          {/* Ratio and Compliance badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">
                              {ratio.toFixed(2)}:1
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0.5 font-bold ${score.color}`}
                            >
                              {score.label}
                            </Badge>
                          </div>

                          {/* Visual Sample UI Snippet */}
                          <div 
                            className="p-2 rounded border border-border/40 text-center font-semibold text-xs transition-all duration-300"
                            style={{ 
                              color: color.color, 
                              backgroundColor: bgHex 
                            }}
                          >
                            Aa Text Sample
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {colors.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No active colors to audit</p>
          <p className="text-xs">Add brand colors in the Color System tab to enable accessibility cross-referencing</p>
        </div>
      )}
    </Card>
  );
}
