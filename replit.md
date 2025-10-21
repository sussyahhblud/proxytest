# Unblocked Proxy Browser

## Overview
A web-based proxy browser application that allows users to access any website while bypassing network restrictions. Built with React, TypeScript, Express, and Tailwind CSS following Chrome/Arc browser design patterns.

## Purpose
Enable unrestricted web browsing through a proxy server that fetches and displays content from any website, helping users bypass network limitations while maintaining a familiar browser interface.

## Current State
**Status**: MVP Complete (October 21, 2025)

The application is fully functional with:
- ✅ Complete browser-like UI with navigation controls
- ✅ Backend proxy server with URL rewriting
- ✅ Dark/Light theme support
- ✅ Navigation history (back/forward/refresh/home)
- ✅ Error handling and loading states
- ✅ Responsive design

## Recent Changes
- **October 21, 2025**: Initial implementation
  - Created complete schema with proxy types and navigation state
  - Built all frontend components following design guidelines
  - Implemented backend proxy endpoint with URL rewriting
  - Added theme provider for dark/light mode switching
  - Integrated frontend with backend API

## Project Architecture

### Frontend Structure (`client/src/`)
- **pages/browser.tsx**: Main browser page with navigation state management
- **components/browser-chrome.tsx**: Top navigation bar with URL input and controls
- **components/loading-overlay.tsx**: Loading state display
- **components/error-screen.tsx**: Error handling with retry functionality
- **components/welcome-screen.tsx**: Initial landing screen
- **components/theme-provider.tsx**: Dark/light theme management
- **App.tsx**: Root application with routing

### Backend Structure (`server/`)
- **routes.ts**: Proxy API endpoint (`POST /api/proxy`)
  - Fetches external websites with proper headers
  - Rewrites relative URLs to absolute URLs
  - Handles errors and invalid content types
  - Returns proxied HTML content

### Shared Types (`shared/schema.ts`)
- `ProxyRequest`: URL validation schema
- `ProxyResponse`: Proxy server response type
- `NavigationState`: Browser history management
- `ProxyStatus`: Loading state type
- `ProxyError`: Error handling type

## How It Works

1. **User enters URL** in the address bar
2. **Frontend validates** and sends URL to `/api/proxy` endpoint
3. **Backend fetches** the website with browser-like headers
4. **URL rewriting** converts all relative URLs to absolute
5. **Content returned** to frontend and displayed in iframe
6. **Navigation history** tracked for back/forward functionality

## Key Features

### Browser Chrome
- Back/Forward navigation buttons
- Refresh and Home buttons
- URL address bar with security indicator (lock icon)
- Theme toggle (dark/light mode)
- Disabled states for unavailable navigation

### Proxy Functionality
- Fetches any HTTP/HTTPS website
- Rewrites ALL URLs in HTML (src, srcset, href, url(), action, poster)
- Preserves HTTP methods (GET/POST) for form submissions
- Forwards query parameters and request bodies
- Proper User-Agent and headers for compatibility
- Frame-busting prevention
- Error handling for failed requests
- SSRF protection (blocks private IPs, localhost, known DNS tricks)

### User Experience
- Welcome screen with feature highlights
- Beautiful loading overlay during fetch
- Comprehensive error screen with retry option
- Toast notifications for status updates
- Smooth transitions and hover states

## Design System

### Colors (Dark Mode Primary)
- Background: `220 15% 8%`
- Card: `220 12% 12%`
- Primary: `220 85% 60%` (blue accent)
- Success: `142 70% 50%` (green for proxy status)
- Error: `0 85% 60%` (red for failures)

### Typography
- Interface: Inter (400, 500, 600, 700)
- URL Bar: JetBrains Mono (monospace)

### Layout
- Fixed chrome height: 64px (h-16)
- Full viewport content area
- Responsive breakpoints for mobile/tablet

## API Endpoints

### POST `/api/proxy`
Proxies requests to external websites

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "content": "<html>...</html>",
  "status": 200,
  "contentType": "text/html",
  "finalUrl": "https://example.com"
}
```

**Error Response:**
```json
{
  "message": "Failed to fetch website",
  "details": "Error details here"
}
```

## Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js native fetch
- **UI Components**: Shadcn UI (custom components)
- **State Management**: React hooks, TanStack Query
- **Build Tool**: Vite

## User Preferences
- Default theme: Dark mode
- Browser-like familiar interface
- Clean, minimal distractions
- Fast, responsive interactions

## Development Notes

### Limitations & Considerations
1. **DNS-based SSRF**: While direct IP-based SSRF is blocked, DNS that resolves to private IPs may bypass validation
2. **Advanced Forms**: File uploads and multipart form data not fully supported - basic GET/POST forms work
3. **JSON APIs**: Complex JSON POST requests may have issues - primarily designed for HTML form submissions
4. **JavaScript-heavy sites**: Some sites may not work perfectly in iframe due to sandbox restrictions
5. **CORS**: Some websites may block iframe embedding
6. **Content Security Policy**: Some sites set strict CSP headers preventing iframe display
7. **Frame-busting**: Some sites actively prevent being loaded in iframes (though we attempt to prevent this)
8. **Login/Auth**: Session cookies and authentication may have limitations across the proxy
9. **WebSockets**: Real-time features will not work through the proxy
10. **Dynamic content**: Sites using heavy JavaScript routing (SPAs) may have navigation issues

### Future Enhancements (Not in MVP)
- Request header customization
- Cookie/session management
- Bookmarks and browsing history persistence
- Tab management for multiple sessions
- Better JavaScript injection for improved compatibility
- Resource caching for faster loads

## Testing
The application should be tested with:
- Simple websites (example.com, wikipedia.org)
- Search engines (google.com, duckduckgo.com)
- News sites
- Static content sites

## Security Considerations
- Iframe sandbox attributes limit malicious code execution
- User-Agent spoofing prevents some bot detection
- No credentials or sensitive data stored
- Client-side only proxy (no persistent logging)
