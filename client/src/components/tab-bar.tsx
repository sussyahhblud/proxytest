import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TabState } from "@shared/schema";

interface TabBarProps {
  tabs: TabState[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

export function TabBar({ tabs, activeTabId, onTabSelect, onTabClose, onNewTab }: TabBarProps) {
  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="h-10 bg-tab-bar border-b border-border flex items-center overflow-x-auto scrollbar-hide">
      <div className="flex items-center h-full">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              data-testid={`tab-${tab.id}`}
              className={cn(
                "group relative flex items-center gap-2 h-full px-3 py-2 cursor-pointer transition-all duration-100",
                "min-w-[120px] max-w-[240px] flex-1",
                "rounded-t-lg",
                isActive 
                  ? "bg-active-tab border-b-2 border-primary opacity-100" 
                  : "bg-inactive-tab opacity-80 hover:bg-tab-hover hover:opacity-100"
              )}
              onClick={() => onTabSelect(tab.id)}
            >
              <span 
                className={cn(
                  "text-sm font-medium truncate flex-1",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tab.title || "New Tab"}
              </span>
              
              <button
                data-testid={`button-close-tab-${tab.id}`}
                onClick={(e) => handleCloseTab(e, tab.id)}
                className={cn(
                  "ml-auto w-4 h-4 rounded-sm flex items-center justify-center",
                  "hover:bg-destructive/10 transition-colors",
                  "opacity-0 group-hover:opacity-100"
                )}
                aria-label={`Close ${tab.title || 'tab'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        
        <Button
          size="icon"
          variant="ghost"
          data-testid="button-new-tab"
          onClick={onNewTab}
          className="h-10 w-10 rounded-none hover:bg-accent/10"
          aria-label="New tab (Ctrl+T)"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
