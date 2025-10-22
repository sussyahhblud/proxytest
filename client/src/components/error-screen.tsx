import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorScreenProps {
  message: string;
  details?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message, details, onRetry }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-background px-6">
      <div className="max-w-md text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">{message}</h2>
        {details && (
          <p className="text-sm text-muted-foreground mb-6">{details}</p>
        )}
        {onRetry && (
          <Button 
            onClick={onRetry}
            data-testid="button-retry"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
