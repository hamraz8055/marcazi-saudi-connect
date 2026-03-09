import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, RotateCw, Check, AlertTriangle } from "lucide-react";
import { tour360Providers, validateTourUrl } from "@/lib/propertyData";

interface VirtualTourSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const VirtualTourSection: React.FC<VirtualTourSectionProps> = ({
  value,
  onChange,
}) => {
  const [showProviders, setShowProviders] = useState(false);
  const validationState = validateTourUrl(value);

  const handleUrlChange = (url: string) => {
    onChange(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCw className="h-5 w-5" />
          360° Virtual Tour (Optional)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Give buyers an immersive virtual walkthrough of your property
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tour-url">Paste your 360° tour link below:</Label>
          <Input
            id="tour-url"
            type="url"
            placeholder="https://..."
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          {validationState === "valid" && (
            <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              Valid tour link
            </div>
          )}
          {validationState === "warning" && (
            <div className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              This provider may not be supported. Tour preview may not display correctly.
            </div>
          )}
        </div>

        <Collapsible open={showProviders} onOpenChange={setShowProviders}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            ℹ️ Accepted providers
            <ChevronDown className={`h-4 w-4 transition-transform ${showProviders ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 max-h-32 overflow-y-auto">
              {tour360Providers.map((provider) => (
                <div key={provider} className="truncate">
                  {provider}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};