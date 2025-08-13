import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Copy, 
  Download, 
  Palette,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { ColorShade, ColorRole, COLOR_ROLE_LABELS } from '@/types/color';
import { useToast } from '@/hooks/use-toast';
import { generateShades, exportPalette } from '@/lib/colorUtils';

interface ColorSystemManagerProps {
  colors: ColorShade[];
  neutrals: any;
  onAddColor: (color: string, role: ColorRole) => void;
  onUpdateColor: (id: string, updates: Partial<ColorShade>) => void;
  onRemoveColor: (id: string) => void;
  onUpdateColorRole: (id: string, role: ColorRole) => void;
  onUpdateColorName: (id: string, name: string) => void;
  onLockColor: (id: string, locked: boolean) => void;
  onRegenerateShades: (id: string, steps: number) => void;
}

export function ColorSystemManager({
  colors,
  neutrals,
  onAddColor,
  onUpdateColor,
  onRemoveColor,
  onUpdateColorRole,
  onUpdateColorName,
  onLockColor,
  onRegenerateShades
}: ColorSystemManagerProps) {
  const [newColor, setNewColor] = useState('#6366f1');
  const [newColorRole, setNewColorRole] = useState<ColorRole>('custom');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [copiedShade, setCopiedShade] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddColor = () => {
    onAddColor(newColor, newColorRole);
    setNewColor('#6366f1');
    setNewColorRole('custom');
    toast({
      title: "Color added!",
      description: `New ${newColorRole} color added to your palette`,
    });
  };

  const handleCopyShade = async (shade: string, colorName: string, index: number) => {
    try {
      await navigator.clipboard.writeText(shade);
      setCopiedShade(`${colorName}-${index}`);
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

  const handleExport = (format: 'css' | 'scss' | 'tailwind' | 'json') => {
    const content = exportPalette(colors, neutrals, format);
    const mimeType = format === 'json' ? 'application/json' : 'text/plain';
    const fileName = `color-system.${format === 'tailwind' ? 'json' : format}`;
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export complete!",
      description: `Color system exported as ${format.toUpperCase()}`,
    });
  };

  const startEditing = (color: ColorShade) => {
    setEditingId(color.id);
    setEditingName(color.name);
  };

  const saveEditing = () => {
    if (editingId) {
      onUpdateColorName(editingId, editingName);
      setEditingId(null);
      setEditingName('');
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <Card className="p-6 bg-surface border-border shadow-md">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Color System Manager</h3>
            <Badge variant="secondary" className="ml-2">
              {colors.length} colors
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select onValueChange={(value) => handleExport(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="scss">SCSS</SelectItem>
                <SelectItem value="tailwind">Tailwind</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Add New Color */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-surface-alt rounded-lg border border-border">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-12 h-10 p-1 border-border"
              />
              <Input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 font-mono text-sm"
                placeholder="#6366f1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Role</Label>
            <Select value={newColorRole} onValueChange={(value: ColorRole) => setNewColorRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(COLOR_ROLE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex items-end">
            <Button onClick={handleAddColor} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Color
            </Button>
          </div>
        </div>

        <Separator />

        {/* Color List */}
        <div className="space-y-4">
          {colors.map((color) => (
            <div key={color.id} className="group border border-border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Color Header */}
              <div className="p-4 bg-surface-alt border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md border border-border shadow-sm"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="flex items-center gap-2">
                      {editingId === color.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 w-32 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditing();
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={saveEditing}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelEditing}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{color.name}</h4>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditing(color)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {COLOR_ROLE_LABELS[color.role]}
                      </Badge>
                      {color.locked && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="mr-1 h-2 w-2" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={color.role} 
                      onValueChange={(value: ColorRole) => onUpdateColorRole(color.id, value)}
                    >
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COLOR_ROLE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={color.locked}
                        onCheckedChange={(locked) => onLockColor(color.id, locked)}
                        className="scale-75"
                      />
                      {color.locked ? (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Unlock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveColor(color.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Color Shades */}
              <div className="p-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                  {color.shades.map((shade, index) => {
                    const stepNumbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
                    const stepNumber = stepNumbers[index] || (index + 1) * 100;
                    const shadeId = `${color.name}-${index}`;
                    
                    return (
                      <div
                        key={index}
                        className="group/shade relative overflow-hidden rounded-md border border-border hover:shadow-md transition-all duration-200"
                      >
                        <div
                          className="h-16 w-full cursor-pointer"
                          style={{ backgroundColor: shade }}
                          onClick={() => handleCopyShade(shade, color.name, index)}
                        />
                        <div className="p-2 bg-surface">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-foreground">
                                {stepNumber}
                              </p>
                              <p className="text-xs font-mono text-muted-foreground truncate">
                                {shade}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopyShade(shade, color.name, index)}
                              className="h-6 w-6 p-0 opacity-0 group-hover/shade:opacity-100 transition-opacity"
                            >
                              {copiedShade === shadeId ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {colors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No colors in your palette yet</p>
            <p className="text-xs">Add your first color above to get started</p>
          </div>
        )}
      </div>
    </Card>
  );
}