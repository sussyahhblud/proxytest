import { Globe, Lock, Zap } from "lucide-react";

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <Globe className="w-20 h-20 text-primary mx-auto" data-testid="icon-welcome" />
          <h1 className="text-2xl font-semibold text-foreground">
            Unblocked Browser
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Access any website without restrictions. Enter a URL in the address bar above to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Bypass Restrictions</h3>
            <p className="text-xs text-muted-foreground">
              Access blocked websites and content without limitations
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Anonymous Browsing</h3>
            <p className="text-xs text-muted-foreground">
              Browse the web privately through our proxy server
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Fast & Reliable</h3>
            <p className="text-xs text-muted-foreground">
              Optimized proxy technology for smooth browsing
            </p>
          </div>
        </div>

        <div className="pt-8 text-xs text-muted-foreground">
          <p>Try: google.com, wikipedia.org, or any website</p>
        </div>
      </div>
    </div>
  );
}
