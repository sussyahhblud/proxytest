import { useState, useEffect, useCallback } from "react";
import { TabBar } from "@/components/tab-bar";
import { BrowserChrome } from "@/components/browser-chrome";
import { LoadingBar } from "@/components/loading-bar";
import { WelcomeScreen } from "@/components/welcome-screen";
import { LoadingOverlay } from "@/components/loading-overlay";
import { ErrorScreen } from "@/components/error-screen";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { TabState, ProxyResponse, ProxyError } from "@shared/schema";

export default function Browser() {
  const { toast } = useToast();
  const [tabs, setTabs] = useState<TabState[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  // Create a new tab
  const createNewTab = useCallback(() => {
    const newTab: TabState = {
      id: crypto.randomUUID(),
      title: "New Tab",
      url: "",
      loading: false,
      error: null,
      history: [],
      historyIndex: -1,
      content: null,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  // Initialize with one tab
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab();
    }
  }, [tabs.length, createNewTab]);

  // Close a tab
  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const newTabs = prev.filter((tab) => tab.id !== tabId);
      
      // If closing the active tab, switch to another tab
      if (tabId === activeTabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex((tab) => tab.id === tabId);
        const newActiveIndex = Math.max(0, closedIndex - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      }
      
      return newTabs;
    });
  }, [activeTabId]);

  // Fetch content for a URL without modifying history (for back/forward)
  const fetchContent = useCallback(async (url: string, updateHistory: boolean = false) => {
    if (!activeTabId || !url.trim()) return;

    // Set loading state
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              loading: true,
              error: null,
            }
          : tab
      )
    );

    try {
      // Call the proxy API
      const res = await apiRequest("POST", "/api/proxy", { url });
      const response: ProxyResponse = await res.json();
      
      // Extract title from URL or use URL as title
      const title = new URL(response.finalUrl).hostname.replace("www.", "") || "Page";
      
      // Update tab with successful response
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                url: response.finalUrl,
                title,
                loading: false,
                content: response.content,
                error: null,
                // Only update history if this is a new navigation
                ...(updateHistory ? {
                  history: [...tab.history.slice(0, tab.historyIndex + 1), response.finalUrl],
                  historyIndex: tab.historyIndex + 1,
                } : {}),
              }
            : tab
        )
      );
    } catch (error) {
      const proxyError = error as ProxyError;
      
      // Update tab with error
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId
            ? {
                ...tab,
                loading: false,
                error: {
                  message: proxyError.message || "Failed to load page",
                  details: proxyError.details || "Please check the URL and try again",
                },
              }
            : tab
        )
      );
      
      toast({
        title: "Failed to load page",
        description: proxyError.message || "An error occurred",
        variant: "destructive",
      });
    }
  }, [activeTabId, toast]);

  // Navigate to a URL (or search) - adds to history
  const navigate = useCallback(async (url: string) => {
    await fetchContent(url, true);
  }, [fetchContent]);

  // Navigation actions
  const goBack = useCallback(() => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    
    const newIndex = activeTab.historyIndex - 1;
    const newUrl = activeTab.history[newIndex];
    
    // Update index
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, historyIndex: newIndex }
          : tab
      )
    );
    
    // Fetch content without modifying history
    fetchContent(newUrl, false);
  }, [activeTab, activeTabId, fetchContent]);

  const goForward = useCallback(() => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    
    const newIndex = activeTab.historyIndex + 1;
    const newUrl = activeTab.history[newIndex];
    
    // Update index
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, historyIndex: newIndex }
          : tab
      )
    );
    
    // Fetch content without modifying history
    fetchContent(newUrl, false);
  }, [activeTab, activeTabId, fetchContent]);

  const refresh = useCallback(() => {
    if (!activeTab || !activeTab.url) return;
    navigate(activeTab.url);
  }, [activeTab, navigate]);

  const goHome = useCallback(() => {
    if (!activeTab) return;
    
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: "",
              title: "New Tab",
              content: null,
              history: [],
              historyIndex: -1,
              error: null,
            }
          : tab
      )
    );
  }, [activeTab, activeTabId]);

  // Listen for navigation messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle navigation messages
      if (event.data && event.data.type === "navigate" && event.data.url) {
        navigate(event.data.url);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "t") {
        e.preventDefault();
        createNewTab();
      } else if (modKey && e.key === "w") {
        e.preventDefault();
        if (activeTabId && tabs.length > 1) {
          closeTab(activeTabId);
        }
      } else if (modKey && e.key === "r") {
        e.preventDefault();
        refresh();
      } else if (modKey && e.key === "[") {
        e.preventDefault();
        goBack();
      } else if (modKey && e.key === "]") {
        e.preventDefault();
        goForward();
      } else if (modKey && e.key === "l") {
        e.preventDefault();
        // Focus address bar
        const addressBar = document.querySelector('[data-testid="input-address-bar"]') as HTMLInputElement;
        addressBar?.focus();
        addressBar?.select();
      } else if (modKey && e.key === "Tab") {
        e.preventDefault();
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTabId);
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + tabs.length) % tabs.length
          : (currentIndex + 1) % tabs.length;
        setActiveTabId(tabs[nextIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, activeTabId, createNewTab, closeTab, refresh, goBack, goForward]);

  if (tabs.length === 0) {
    return <WelcomeScreen />;
  }

  const canGoBack = activeTab ? activeTab.historyIndex > 0 : false;
  const canGoForward = activeTab
    ? activeTab.historyIndex < activeTab.history.length - 1
    : false;

  return (
    <div className="flex flex-col h-screen">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
        onNewTab={createNewTab}
      />
      
      <BrowserChrome
        url={activeTab?.url || ""}
        status={activeTab?.error ? "error" : activeTab?.content ? "success" : "idle"}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigate={navigate}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={goHome}
      />
      
      <LoadingBar loading={activeTab?.loading || false} />
      
      <div className="flex-1 overflow-hidden" data-testid="content-area">
        {!activeTab?.url && !activeTab?.loading && !activeTab?.error && (
          <WelcomeScreen />
        )}
        
        {activeTab?.loading && (
          <LoadingOverlay message={`Loading ${activeTab.url}...`} />
        )}
        
        {activeTab?.error && (
          <ErrorScreen
            message={activeTab.error.message}
            details={activeTab.error.details}
            onRetry={refresh}
          />
        )}
        
        {activeTab?.content && !activeTab?.loading && !activeTab?.error && (
          <iframe
            key={activeTab.id + "-" + activeTab.url}
            data-testid="iframe-content"
            srcDoc={activeTab.content}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            title={activeTab.title}
          />
        )}
      </div>
    </div>
  );
}
