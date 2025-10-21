import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Home,
  Globe,
  Lock,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface BrowserChromeProps {
  url: string;
  onUrlChange: (url: string) => void;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isSecure: boolean;
  isLoading: boolean;
}

export function BrowserChrome({
  url,
  onUrlChange,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
  canGoBack,
  canGoForward,
  isSecure,
  isLoading,
}: BrowserChromeProps) {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let processedUrl = inputValue.trim();
    
    if (!processedUrl) return;
    
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    onNavigate(processedUrl);
  };

  const handleClear = () => {
    setInputValue("");
    onUrlChange("");
  };

  return (
    <header className="h-16 bg-card border-b border-card-border px-4 flex items-center gap-2 shadow-sm backdrop-blur-sm">
      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(
            "w-9 h-9 transition-colors",
            !canGoBack && "opacity-40 cursor-not-allowed"
          )}
          data-testid="button-back"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onForward}
          disabled={!canGoForward}
          className={cn(
            "w-9 h-9 transition-colors",
            !canGoForward && "opacity-40 cursor-not-allowed"
          )}
          data-testid="button-forward"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onRefresh}
          className={cn(
            "w-9 h-9 transition-colors",
            isLoading && "animate-spin"
          )}
          data-testid="button-refresh"
        >
          <RotateCw className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onHome}
          className="w-9 h-9 transition-colors"
          data-testid="button-home"
        >
          <Home className="w-5 h-5" />
        </Button>
      </div>

      {/* URL Address Bar */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div className="w-full relative flex items-center bg-secondary border border-border rounded-lg h-10 px-4 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {isSecure ? (
              <Lock className="w-4 h-4 text-chart-2" data-testid="icon-secure" />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" data-testid="icon-globe" />
            )}
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Enter URL or search..."
            className="flex-1 bg-transparent outline-none text-sm font-mono text-foreground placeholder:text-muted-foreground"
            data-testid="input-url"
          />

          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 hover-elevate p-1 rounded transition-colors"
              data-testid="button-clear-url"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          className="w-9 h-9 transition-colors"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
