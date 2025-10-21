import { z } from "zod";

// Proxy Request/Response types
export const proxyRequestSchema = z.object({
  url: z.string().url(),
});

export type ProxyRequest = z.infer<typeof proxyRequestSchema>;

export interface ProxyResponse {
  content: string;
  status: number;
  contentType: string;
  finalUrl: string;
}

// Navigation history
export interface NavigationState {
  history: string[];
  currentIndex: number;
}

// Proxy status
export type ProxyStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProxyError {
  message: string;
  details?: string;
  status?: number;
}
