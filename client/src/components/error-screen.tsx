import { ShieldAlert, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProxyError } from "@shared/schema";
import { useState } from "react";

interface ErrorScreenProps {
  error: ProxyError;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-8">
      <ShieldAlert className="w-20 h-20 text-destructive mb-6" data-testid="icon-error" />
      
      <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="text-error-title">
        Unable to Load Website
      </h2>
      
      <p className="text-muted-foreground text-center max-w-md mb-6" data-testid="text-error-message">
        {error.message}
      </p>

      <Button
        onClick={onRetry}
        className="gap-2"
        data-testid="button-retry"
      >
        <RotateCw className="w-4 h-4" />
        Try Again
      </Button>

      {error.details && (
        <div className="mt-8 max-w-2xl w-full">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            data-testid="button-toggle-details"
          >
            {showDetails ? "Hide" : "Show"} technical details
          </button>
          
          {showDetails && (
            <div className="mt-3 p-4 bg-secondary rounded-lg border border-border">
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all" data-testid="text-error-details">
                {error.details}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
