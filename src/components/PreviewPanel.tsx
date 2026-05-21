import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Settings, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { calculateContrastRatio } from '@/lib/colorUtils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreviewPanelProps {
  primaryColor: string;
  secondaryColor?: string;
}

export function PreviewPanel({ primaryColor, secondaryColor = '#ffffff' }: PreviewPanelProps) {
  const [cvdMode, setCvdMode] = useState<string>('none');
  const contrastRatio = calculateContrastRatio(primaryColor, secondaryColor);
  const isAAACompliant = contrastRatio >= 7;
  const isAACompliant = contrastRatio >= 4.5;

  return (
    <Card className="p-6 bg-surface shadow-md space-y-6">
      {/* CVD Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Eye className="h-3 w-3" />
          Color Vision Simulation
        </label>
        <Select value={cvdMode} onValueChange={setCvdMode}>
          <SelectTrigger className="w-full h-9 bg-surface border-border">
            <SelectValue placeholder="Normal Vision" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Normal Vision</SelectItem>
            <SelectItem value="protanopia">Protanopia (Red Blind)</SelectItem>
            <SelectItem value="deuteranopia">Deuteranopia (Green Blind)</SelectItem>
            <SelectItem value="tritanopia">Tritanopia (Blue Blind)</SelectItem>
            <SelectItem value="achromatopsia">Achromatopsia (Monochrome)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div style={{ filter: cvdMode !== 'none' ? `url(#${cvdMode})` : 'none' }} className="transition-all duration-300">
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="live-preview" className="border-0">
            <AccordionTrigger className="text-lg font-semibold py-2 hover:no-underline text-foreground">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: primaryColor }} 
                />
                Live Preview
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {/* Sample UI Components */}
              <div className="space-y-4 pt-4">
                {/* Primary Button */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Primary Button</p>
                  <Button
                    style={{ 
                      backgroundColor: primaryColor, 
                      borderColor: primaryColor,
                      color: secondaryColor 
                    }}
                    className="hover:opacity-90 transition-opacity"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Primary Action
                  </Button>
                </div>

                {/* Badge */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Badge</p>
                  <Badge 
                    style={{ 
                      backgroundColor: primaryColor, 
                      color: secondaryColor 
                    }}
                    className="text-sm"
                  >
                    <Star className="mr-1 h-3 w-3" />
                    New Feature
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Progress Bar</p>
                  <Progress 
                    value={75} 
                    className="h-3"
                    style={{
                      backgroundColor: '#e5e7eb'
                    }}
                  />
                </div>

                {/* Card with Accent */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Card Component</p>
                  <Card 
                    className="p-4 border-l-4 bg-surface-alt"
                    style={{ borderLeftColor: primaryColor }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: primaryColor + '20' }}
                      >
                        <Settings 
                          className="h-4 w-4"
                          style={{ color: primaryColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">Sample Card</h4>
                        <p className="text-sm text-muted-foreground">
                          This is how your colors look in a card component.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Alert */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Alert Component</p>
                  <Alert 
                    className="border-l-4 bg-surface-alt"
                    style={{ borderLeftColor: primaryColor }}
                  >
                    <AlertCircle 
                      className="h-4 w-4"
                      style={{ color: primaryColor }}
                    />
                    <AlertDescription>
                      Your color scheme creates this visual impact in alerts.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="accessibility-check" className="border-0">
            <AccordionTrigger className="text-lg font-semibold py-2 hover:no-underline text-foreground">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: secondaryColor }} 
                />
                Accessibility Check
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-alt border border-border">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded border border-border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">Contrast Ratio</p>
                        <p className="text-xs text-muted-foreground">
                          Primary vs Background
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {contrastRatio.toFixed(2)}:1
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        {isAAACompliant && (
                          <Badge variant="outline" className="text-xs border-success text-success animate-fade-in">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            AAA
                          </Badge>
                        )}
                        {isAACompliant && (
                          <Badge variant="outline" className="text-xs border-success text-success animate-fade-in">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            AA
                          </Badge>
                        )}
                        {!isAACompliant && (
                          <Badge variant="outline" className="text-xs border-destructive text-destructive animate-fade-in">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Fail
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-alt border border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-4 rounded border border-border bg-surface">
                        <p 
                          className="font-medium"
                          style={{ color: primaryColor, backgroundColor: secondaryColor }}
                        >
                          Sample Text
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Primary on Background</p>
                      </div>
                      <div className="text-center p-4 rounded border border-border">
                        <p 
                          className="font-medium"
                          style={{ color: secondaryColor, backgroundColor: primaryColor }}
                        >
                          Sample Text
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Background on Primary</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* SVG Color Blindness Filters */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0,     0, 0,
                      0.558, 0.442, 0,     0, 0,
                      0,     0.242, 0.758, 0, 0,
                      0,     0,     0,     1, 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0,   0, 0,
                      0.7,   0.3,   0,   0, 0,
                      0,     0.3,   0.7, 0, 0,
                      0,     0,     0,   1, 0"
            />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05,  0,     0, 0,
                      0,    0.433, 0.567, 0, 0,
                      0,    0.475, 0.525, 0, 0,
                      0,    0,     0,     1, 0"
            />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0,
                      0.299, 0.587, 0.114, 0, 0,
                      0.299, 0.587, 0.114, 0, 0,
                      0,     0,     0,     1, 0"
            />
          </filter>
        </defs>
      </svg>
    </Card>
  );
}