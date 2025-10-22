import { z } from "zod";

// Proxy Request/Response Types
export const proxyRequestSchema = z.object({
  url: z.string().min(1, "Please enter a URL or search keywords"),
});

export type ProxyRequest = z.infer<typeof proxyRequestSchema>;

export interface ProxyResponse {
  content: string;
  status: number;
  contentType: string;
  finalUrl: string;
}

export interface ProxyError {
  message: string;
  details?: string;
}

// Tab State Management
export interface TabState {
  id: string;
  title: string;
  url: string;
  loading: boolean;
  error: ProxyError | null;
  history: string[];
  historyIndex: number;
  content: string | null;
}

export type ProxyStatus = "idle" | "loading" | "success" | "error";

// Navigation Actions
export type NavigationAction = "back" | "forward" | "refresh" | "home" | "navigate";
