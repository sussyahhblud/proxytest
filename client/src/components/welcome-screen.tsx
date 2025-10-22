import { Globe, Search, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold mb-3 text-foreground">
          Unblocked Proxy Browser
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Access any website without restrictions. Browse freely with multi-tab support and smart search.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border hover-elevate">
            <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-base mb-2 text-foreground">Unrestricted Access</h3>
            <p className="text-sm text-muted-foreground">
              Bypass network limitations and access any website through our secure proxy
            </p>
          </Card>
          
          <Card className="p-6 border hover-elevate">
            <Search className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-base mb-2 text-foreground">Smart Search</h3>
            <p className="text-sm text-muted-foreground">
              Just type keywords and search, or enter full URLs - Google search by default
            </p>
          </Card>
          
          <Card className="p-6 border hover-elevate">
            <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold text-base mb-2 text-foreground">Multi-Tab Browsing</h3>
            <p className="text-sm text-muted-foreground">
              Open multiple tabs, switch between them, and browse just like a real browser
            </p>
          </Card>
        </div>
        
        <p className="mt-8 text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+T</kbd> to open a new tab and start browsing
        </p>
      </div>
    </div>
  );
}
