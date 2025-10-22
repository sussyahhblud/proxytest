import { ArrowLeft, ArrowRight, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationControlsProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export function NavigationControls({
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onRefresh,
  onHome,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-back"
            onClick={onBack}
            disabled={!canGoBack}
            className="h-9 w-9"
            aria-label="Go back (Ctrl+[)"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Back (Ctrl+[)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-forward"
            onClick={onForward}
            disabled={!canGoForward}
            className="h-9 w-9"
            aria-label="Go forward (Ctrl+])"
          >
            <ArrowRight className="w-[18px] h-[18px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Forward (Ctrl+])</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-refresh"
            onClick={onRefresh}
            className="h-9 w-9"
            aria-label="Refresh (Ctrl+R)"
          >
            <RotateCw className="w-[18px] h-[18px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Refresh (Ctrl+R)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-home"
            onClick={onHome}
            className="h-9 w-9"
            aria-label="Home"
          >
            <Home className="w-[18px] h-[18px]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Home</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
