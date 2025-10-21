import { useState, useEffect } from "react";
import { BrowserChrome } from "@/components/browser-chrome";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ErrorScreen } from "@/components/error-screen";
import { WelcomeScreen } from "@/components/welcome-screen";
import { NavigationState, ProxyError, ProxyStatus } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_HOME = "";

export default function Browser() {
  const { toast } = useToast();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    history: [DEFAULT_HOME],
    currentIndex: 0,
  });
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_HOME);
  const [proxyUrl, setProxyUrl] = useState<string>("");
  const [status, setStatus] = useState<ProxyStatus>("idle");
  const [error, setError] = useState<ProxyError | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const currentUrlFromHistory = navigationState.history[navigationState.currentIndex];

  const loadUrl = async (url: string) => {
    if (!url) {
      setStatus("idle");
      setProxyUrl("");
      setError(null);
      return;
    }

    setStatus("loading");
    setError(null);
    setIsInitialLoad(true);

    try {
      // First verify the URL is accessible
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to load website (${response.status})`);
      }

      // If successful, set the iframe to load via GET
      const encodedUrl = encodeURIComponent(url);
      setProxyUrl(`/api/proxy?url=${encodedUrl}`);
      setStatus("success");
      
      toast({
        title: "Website loaded",
        description: "Successfully connected through proxy",
        duration: 2000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError({
        message: "Could not load the website",
        details: errorMessage,
      });
      setStatus("error");
      setProxyUrl("");
      
      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const navigate = (url: string) => {
    if (url === currentUrlFromHistory) {
      loadUrl(url);
      return;
    }

    const newHistory = navigationState.history.slice(0, navigationState.currentIndex + 1);
    newHistory.push(url);
    
    setNavigationState({
      history: newHistory,
      currentIndex: newHistory.length - 1,
    });
    setCurrentUrl(url);
  };

  const goBack = () => {
    if (navigationState.currentIndex > 0) {
      const newIndex = navigationState.currentIndex - 1;
      setNavigationState({
        ...navigationState,
        currentIndex: newIndex,
      });
      setCurrentUrl(navigationState.history[newIndex]);
    }
  };

  const goForward = () => {
    if (navigationState.currentIndex < navigationState.history.length - 1) {
      const newIndex = navigationState.currentIndex + 1;
      setNavigationState({
        ...navigationState,
        currentIndex: newIndex,
      });
      setCurrentUrl(navigationState.history[newIndex]);
    }
  };

  const refresh = () => {
    if (proxyUrl) {
      // Force reload the iframe
      const iframe = document.querySelector('iframe[data-testid="iframe-content"]') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = proxyUrl;
      }
    } else {
      loadUrl(currentUrlFromHistory);
    }
  };

  const goHome = () => {
    navigate(DEFAULT_HOME);
  };

  const handleIframeLoad = () => {
    if (isInitialLoad && proxyUrl) {
      setIsInitialLoad(false);
      setStatus("success");
    }
  };

  useEffect(() => {
    loadUrl(currentUrlFromHistory);
  }, [currentUrlFromHistory]);

  const canGoBack = navigationState.currentIndex > 0;
  const canGoForward = navigationState.currentIndex < navigationState.history.length - 1;
  const isSecure = currentUrlFromHistory.startsWith("https://");

  return (
    <div className="h-screen flex flex-col bg-background">
      <BrowserChrome
        url={currentUrl}
        onUrlChange={setCurrentUrl}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={goHome}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isSecure={isSecure}
        isLoading={status === "loading"}
      />

      <div className="flex-1 relative overflow-hidden">
        {status === "loading" && isInitialLoad && <LoadingOverlay />}
        
        {status === "error" && error && (
          <ErrorScreen error={error} onRetry={refresh} />
        )}
        
        {status === "idle" && !currentUrlFromHistory && (
          <WelcomeScreen />
        )}

        {proxyUrl && (
          <iframe
            src={proxyUrl}
            onLoad={handleIframeLoad}
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            title="Proxied Content"
            data-testid="iframe-content"
          />
        )}
      </div>
    </div>
  );
}
