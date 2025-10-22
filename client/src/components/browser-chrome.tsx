import { NavigationControls } from "./navigation-controls";
import { AddressBar } from "./address-bar";
import { ThemeToggle } from "./theme-toggle";

interface BrowserChromeProps {
  url: string;
  status: "idle" | "success" | "error";
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onHome: () => void;
}

export function BrowserChrome({
  url,
  status,
  canGoBack,
  canGoForward,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
}: BrowserChromeProps) {
  return (
    <div className="h-14 bg-chrome-surface border-b border-border flex items-center px-4 gap-3">
      <NavigationControls
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={onBack}
        onForward={onForward}
        onRefresh={onRefresh}
        onHome={onHome}
      />
      
      <AddressBar
        url={url}
        status={status}
        onNavigate={onNavigate}
      />
      
      <ThemeToggle />
    </div>
  );
}
