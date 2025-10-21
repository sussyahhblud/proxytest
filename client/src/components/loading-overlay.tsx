import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader2 className="w-12 h-12 text-primary animate-spin" data-testid="spinner-loading" />
      <p className="mt-4 text-muted-foreground text-base">Loading website...</p>
    </div>
  );
}
