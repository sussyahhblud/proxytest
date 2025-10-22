import { useState, useEffect, KeyboardEvent } from "react";
import { Lock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressBarProps {
  url: string;
  status: "idle" | "success" | "error";
  onNavigate: (url: string) => void;
}

export function AddressBar({ url, status, onNavigate }: AddressBarProps) {
  const [inputValue, setInputValue] = useState(url);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onNavigate(inputValue);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="relative flex items-center flex-1 h-10 bg-chrome-surface rounded-lg px-3 gap-2">
      <Circle 
        className={cn(
          "w-2 h-2 rounded-full shrink-0",
          status === "success" && "fill-success text-success",
          status === "error" && "fill-destructive text-destructive",
          status === "idle" && "fill-muted-foreground text-muted-foreground"
        )}
      />
      
      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        data-testid="input-address-bar"
        placeholder="Search or enter URL"
        aria-label="Enter URL or search"
        className="flex-1 bg-transparent outline-none text-sm font-mono text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
