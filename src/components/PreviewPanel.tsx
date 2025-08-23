
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { calculateContrastRatio } from '@/lib/colorUtils';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface PreviewPanelProps {
  primaryColor: string;
  secondaryColor?: string;
}

export function PreviewPanel({ primaryColor, secondaryColor = '#ffffff' }: PreviewPanelProps) {
  const contrastRatio = calculateContrastRatio(primaryColor, secondaryColor);
  const isAAACompliant = contrastRatio >= 7;
  const isAACompliant = contrastRatio >= 4.5;

  return (
  <Card className="p-6 bg-surface shadow-md">
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="live-preview" className="border-0">
          <AccordionTrigger>Live Preview</AccordionTrigger>
          <AccordionContent>
            {/* Sample UI Components */}
            <div className="space-y-4">
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
          <AccordionTrigger>Accessibility Check</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-0 border-t border-border">
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
                    <div className="flex items-center gap-1">
                      {isAAACompliant && (
                        <Badge variant="outline" className="text-xs border-success text-success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          AAA
                        </Badge>
                      )}
                      {isAACompliant && (
                        <Badge variant="outline" className="text-xs border-success text-success">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          AA
                        </Badge>
                      )}
                      {!isAACompliant && (
                        <Badge variant="outline" className="text-xs border-destructive text-destructive">
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
    </Card>
  );
}