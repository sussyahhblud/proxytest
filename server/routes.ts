import type { Express } from "express";
import { createServer, type Server } from "http";
import { proxyRequestSchema, type ProxyResponse, type ProxyError } from "@shared/schema";
import * as cheerio from "cheerio";

// Helper to detect if input is a URL or search query
function isUrl(input: string): boolean {
  // Check if it looks like a URL
  if (input.includes("://")) return true;
  if (input.startsWith("localhost")) return true;
  
  // Check if it has a domain extension
  const domainPattern = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  if (domainPattern.test(input)) return true;
  
  // Check if it's an IP address
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/;
  if (ipPattern.test(input)) return true;
  
  return false;
}

// Helper to normalize URL
function normalizeUrl(input: string): string {
  let url = input.trim();
  
  // If it's a search query, convert to Google search
  if (!isUrl(url)) {
    const searchQuery = encodeURIComponent(url);
    return `https://www.google.com/search?q=${searchQuery}`;
  }
  
  // Add protocol if missing
  if (!url.includes("://")) {
    url = "https://" + url;
  }
  
  return url;
}

// SSRF Protection: Block private IPs and localhost
function isPrivateOrLocalhost(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Block localhost variants
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.endsWith(".local")
    ) {
      return true;
    }
    
    // Block private IP ranges
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipPattern);
    
    if (match) {
      const [, a, b, c, d] = match.map(Number);
      
      // 10.0.0.0/8
      if (a === 10) return true;
      
      // 172.16.0.0/12
      if (a === 172 && b >= 16 && b <= 31) return true;
      
      // 192.168.0.0/16
      if (a === 192 && b === 168) return true;
      
      // 169.254.0.0/16 (link-local)
      if (a === 169 && b === 254) return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

// Rewrite URLs in HTML to be absolute and route through proxy
function rewriteHtml(html: string, baseUrl: string): string {
  const $ = cheerio.load(html);
  
  // Helper to make URL absolute
  const makeAbsolute = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (url.startsWith("data:")) return url;
    if (url.startsWith("javascript:")) return "javascript:void(0)";
    if (url.startsWith("#")) return url;
    
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  };
  
  // Rewrite src attributes
  $("[src]").each((_, elem) => {
    const src = $(elem).attr("src");
    const absolute = makeAbsolute(src);
    if (absolute) $(elem).attr("src", absolute);
  });
  
  // Rewrite href attributes
  $("[href]").each((_, elem) => {
    const href = $(elem).attr("href");
    const absolute = makeAbsolute(href);
    if (absolute) $(elem).attr("href", absolute);
  });
  
  // Rewrite srcset attributes
  $("[srcset]").each((_, elem) => {
    const srcset = $(elem).attr("srcset");
    if (srcset) {
      const rewritten = srcset
        .split(",")
        .map((src) => {
          const parts = src.trim().split(/\s+/);
          const url = makeAbsolute(parts[0]);
          return url ? [url, ...parts.slice(1)].join(" ") : src;
        })
        .join(", ");
      $(elem).attr("srcset", rewritten);
    }
  });
  
  // Rewrite action attributes (forms)
  $("[action]").each((_, elem) => {
    const action = $(elem).attr("action");
    const absolute = makeAbsolute(action);
    if (absolute) $(elem).attr("action", absolute);
  });
  
  // Rewrite poster attributes (video)
  $("[poster]").each((_, elem) => {
    const poster = $(elem).attr("poster");
    const absolute = makeAbsolute(poster);
    if (absolute) $(elem).attr("poster", absolute);
  });
  
  // Rewrite CSS url() in style attributes
  $("[style]").each((_, elem) => {
    const style = $(elem).attr("style");
    if (style) {
      const rewritten = style.replace(/url\(['"]?([^'"()]+)['"]?\)/gi, (match, url) => {
        const absolute = makeAbsolute(url);
        return absolute ? `url('${absolute}')` : match;
      });
      $(elem).attr("style", rewritten);
    }
  });
  
  // Inject JavaScript to intercept navigation
  const navigationScript = `
    <script>
      (function() {
        // Intercept all clicks on links
        document.addEventListener('click', function(e) {
          let target = e.target;
          
          // Find the closest anchor tag
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          
          if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
              e.preventDefault();
              
              // Post message to parent window to navigate
              window.parent.postMessage({
                type: 'navigate',
                url: href
              }, '*');
            }
          }
        }, true);
        
        // Intercept form submissions
        document.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const form = e.target;
          const action = form.action;
          const method = form.method.toUpperCase();
          
          if (method === 'GET') {
            const formData = new FormData(form);
            const params = new URLSearchParams(formData);
            const url = action + '?' + params.toString();
            
            window.parent.postMessage({
              type: 'navigate',
              url: url
            }, '*');
          } else {
            // POST forms are more complex - for now just navigate to action
            window.parent.postMessage({
              type: 'navigate',
              url: action
            }, '*');
          }
        }, true);
        
        // Prevent frame-busting
        try {
          Object.defineProperty(window, 'top', {
            get: function() { return window.self; }
          });
          Object.defineProperty(window, 'parent', {
            get: function() { return window.self; }
          });
        } catch (e) {}
      })();
    </script>
  `;
  
  // Inject script before closing body tag, or at the end if no body
  if ($("body").length > 0) {
    $("body").append(navigationScript);
  } else {
    $.root().append(navigationScript);
  }
  
  return $.html();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/proxy - Proxy requests to external websites
  app.post("/api/proxy", async (req, res) => {
    try {
      // Validate request
      const validation = proxyRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        const error: ProxyError = {
          message: "Invalid URL",
          details: validation.error.errors[0]?.message,
        };
        return res.status(400).json(error);
      }
      
      const { url: inputUrl } = validation.data;
      
      // Normalize URL (handle search queries)
      const normalizedUrl = normalizeUrl(inputUrl);
      
      // SSRF Protection
      if (isPrivateOrLocalhost(normalizedUrl)) {
        const error: ProxyError = {
          message: "Access denied",
          details: "Cannot access private or localhost addresses",
        };
        return res.status(403).json(error);
      }
      
      // Fetch the website
      const response = await fetch(normalizedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "DNT": "1",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
        redirect: "follow",
      });
      
      if (!response.ok) {
        const error: ProxyError = {
          message: `Failed to fetch website (${response.status})`,
          details: response.statusText,
        };
        return res.status(response.status).json(error);
      }
      
      // Get content type
      const contentType = response.headers.get("content-type") || "";
      
      // Only process HTML
      if (!contentType.includes("text/html")) {
        const error: ProxyError = {
          message: "Unsupported content type",
          details: `Expected HTML but got ${contentType}`,
        };
        return res.status(415).json(error);
      }
      
      // Get HTML content
      const html = await response.text();
      
      // Rewrite URLs and inject navigation script
      const rewrittenHtml = rewriteHtml(html, response.url);
      
      const proxyResponse: ProxyResponse = {
        content: rewrittenHtml,
        status: response.status,
        contentType: contentType,
        finalUrl: response.url,
      };
      
      res.json(proxyResponse);
    } catch (error) {
      console.error("Proxy error:", error);
      
      const proxyError: ProxyError = {
        message: "Failed to fetch website",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      
      res.status(500).json(proxyError);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
