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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
import { ColorShade, ColorRole, COLOR_ROLE_LABELS, NeutralShades } from '@/types/color';
import { useToast } from '@/hooks/use-toast';
import { generateShades, exportPalette, generateStepNumbers } from '@/lib/colorUtils';

type ExportFormat = 'css' | 'scss' | 'tailwind-hex' | 'tailwind-var' | 'tailwind-v4' | 'json';

interface ColorSystemManagerProps {
  colors: ColorShade[];
  neutrals: NeutralShades;
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
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);
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

  const handleDownloadCode = () => {
    const content = exportPalette(colors, neutrals, exportFormat);
    let extension = 'css';
    let mimeType = 'text/css';
    
    if (exportFormat === 'scss') {
      extension = 'scss';
      mimeType = 'text/x-scss';
    } else if (exportFormat === 'tailwind-hex' || exportFormat === 'tailwind-var') {
      extension = 'json';
      mimeType = 'application/json';
    } else if (exportFormat === 'tailwind-v4') {
      extension = 'css';
      mimeType = 'text/css';
    } else if (exportFormat === 'json') {
      extension = 'json';
      mimeType = 'application/json';
    }
    
    const fileName = `color-system.${exportFormat === 'tailwind-hex' || exportFormat === 'tailwind-var' ? 'tailwind.json' : exportFormat === 'tailwind-v4' ? 'tailwind-v4.css' : extension}`;
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
      title: "File downloaded!",
      description: `Saved color system variables to ${fileName}`,
    });
  };

  const handleCopyCode = async () => {
    try {
      const content = exportPalette(colors, neutrals, exportFormat);
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Code copied!",
        description: "Variables copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy variables to clipboard",
        variant: "destructive",
      });
    }
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
            <Button
              onClick={() => setExportOpen(true)}
              variant="outline"
              size="sm"
              className="border-border hover:bg-surface-alt flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Export Code
            </Button>
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
                    const stepNumbers = generateStepNumbers(color.shades.length);
                    const stepNumber = stepNumbers[index];
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

      {/* Export Developer Code Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] flex flex-col bg-surface border-border p-6 shadow-2xl overflow-hidden rounded-xl">
          <DialogHeader className="shrink-0 pb-2">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Download className="h-5 w-5 text-primary" />
              Export Developer Code
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              Use these premium export configurations to integrate your custom generated color palette and neutrals straight into your codebase.
            </DialogDescription>
          </DialogHeader>

          {/* Formats Layout */}
          <div className="flex flex-col md:flex-row gap-4 my-3 overflow-hidden flex-1 min-h-[300px]">
            {/* Format Selector Menu */}
            <div className="flex md:flex-col gap-1.5 w-full md:w-52 overflow-x-auto md:overflow-x-visible shrink-0 pb-2 md:pb-0 scrollbar-none">
              {[
                { id: 'css', label: 'CSS Variables', desc: 'Plain CSS custom properties' },
                { id: 'scss', label: 'SCSS Variables', desc: 'Variables for Sass styling' },
                { id: 'tailwind-hex', label: 'Tailwind v3 (Hex)', desc: 'Pure hex config extension' },
                { id: 'tailwind-var', label: 'Tailwind v3 (Var)', desc: 'Dynamic CSS variables mapping' },
                { id: 'tailwind-v4', label: 'Tailwind v4 (@theme)', desc: 'Modern CSS-first theme config' },
                { id: 'json', label: 'JSON Schema', desc: 'Raw palette configurations' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setExportFormat(fmt.id as ExportFormat);
                    setCopied(false);
                  }}
                  className={`text-left px-3.5 py-3 rounded-lg border transition-all duration-200 flex flex-col gap-0.5 shrink-0 md:shrink ${
                    exportFormat === fmt.id
                      ? 'bg-primary/10 border-primary text-primary font-medium shadow-sm'
                      : 'bg-surface-alt/50 border-border text-foreground hover:bg-surface-alt hover:border-muted-foreground/35'
                  }`}
                >
                  <span className="text-xs font-semibold">{fmt.label}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">{fmt.desc}</span>
                </button>
              ))}
            </div>

            {/* Code Block & Guidelines */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-zinc-950 rounded-xl border border-border overflow-hidden relative group">
              {/* Copy and Download Buttons */}
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0 text-white">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                  {exportFormat.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={handleCopyCode}
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownloadCode}
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/10"
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Code Scrollable */}
              <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-zinc-100 bg-zinc-950 select-text leading-relaxed select-all">
                <code>{exportPalette(colors, neutrals, exportFormat)}</code>
              </pre>
            </div>
          </div>

          {/* Guidelines / Tips */}
          <div className="p-4 bg-surface-alt rounded-lg border border-border text-xs text-muted-foreground shrink-0 space-y-1">
            <h5 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Integration Guide:
            </h5>
            <p className="pl-3 leading-relaxed text-muted-foreground">
              {exportFormat === 'css' && "Paste this inside your global CSS file (like index.css or App.css) inside the :root selector. To use a color, write: color: var(--primary-500);"}
              {exportFormat === 'scss' && "Save this inside a variables sheet (e.g. _colors.scss) and import it in your styles. Reference them with $name-step, e.g. color: $primary-500;"}
              {exportFormat === 'tailwind-hex' && "Merge this extend block inside your tailwind.config.js under theme.extend.colors. This makes them instantly accessible as utility classes like bg-primary-500 or text-white-8."}
              {exportFormat === 'tailwind-var' && "First, add the CSS variables snippet to your global CSS. Then merge this map under theme.extend.colors. This preserves live runtime changes while keeping standard utility class syntax!"}
              {exportFormat === 'tailwind-v4' && "Tailwind CSS v4 uses a modern CSS-first configurations approach. Paste this block directly inside your main CSS file alongside @import 'tailwindcss';. Tailwind automatically converts them to utility classes!"}
              {exportFormat === 'json' && "This matches standard semantic schemas and allows integrating your color system with generic token platforms, headless design pipelines, or custom builders."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}