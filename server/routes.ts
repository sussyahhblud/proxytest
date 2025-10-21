import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { proxyRequestSchema } from "@shared/schema";

// Comprehensive private network detection for SSRF prevention
function isPrivateOrLocalhost(hostname: string): boolean {
  // Localhost variations
  if (/^(localhost|127\.\d+\.\d+\.\d+|::1|0\.0\.0\.0)$/i.test(hostname)) {
    return true;
  }

  // Check for numeric IP addresses
  const ipv4Match = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4Match) {
    const [, a, b, c, d] = ipv4Match.map(Number);
    // Private IPv4 ranges
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local)
    if (a === 127) return true; // 127.0.0.0/8 (loopback)
    if (a === 0) return true; // 0.0.0.0/8
  }

  // Check for decimal/hex encoded IPs
  if (/^\d+$/.test(hostname)) {
    const num = parseInt(hostname);
    if (num !== 0) {
      const a = (num >> 24) & 0xff;
      if (a === 10 || a === 127 || a === 0) return true;
    }
  }

  // Private IPv6 ranges
  if (/^(fc00|fd00|fe80):/i.test(hostname)) {
    return true;
  }

  // Check for potential DNS tricks (*.nip.io, *.xip.io, etc. that might resolve to private IPs)
  if (/\.(nip\.io|xip\.io|sslip\.io|localtest\.me)$/i.test(hostname)) {
    return true;
  }

  return false;
}

function isUrlSafe(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Block private networks and localhost
    if (isPrivateOrLocalhost(hostname)) {
      return false;
    }
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint - supports both GET and POST
  const handleProxy = async (req: Request, res: any) => {
    try {
      // Determine if this is the initial JSON request from frontend
      const isJsonRequest = req.body?.url !== undefined && req.get('Content-Type')?.includes('application/json');
      
      let targetUrl: string;
      let requestMethod = 'GET';
      let requestBody: any = undefined;
      
      if (isJsonRequest) {
        // Initial verification request from frontend
        targetUrl = req.body.url;
        requestMethod = 'GET';
      } else {
        // Regular proxy request (could be from iframe navigation or form submission)
        targetUrl = req.query.url as string;
        if (!targetUrl) {
          return res.status(400).send('URL parameter is required');
        }

        // Decode the URL
        targetUrl = decodeURIComponent(targetUrl);
        
        // Get all other query parameters (for GET forms)
        const { url, ...otherParams } = req.query;
        if (Object.keys(otherParams).length > 0) {
          const targetUrlObj = new URL(targetUrl);
          // Append form parameters to target URL
          Object.entries(otherParams).forEach(([key, value]) => {
            targetUrlObj.searchParams.set(key, value as string);
          });
          targetUrl = targetUrlObj.href;
        }

        // Preserve HTTP method for form submissions
        requestMethod = req.method;
        
        // For POST requests, forward the body
        if (req.method === 'POST' && req.body) {
          // Check if it's form data
          if (req.is('application/x-www-form-urlencoded') || req.is('multipart/form-data')) {
            // Convert body object to form data
            const formData = new URLSearchParams();
            Object.entries(req.body).forEach(([key, value]) => {
              formData.append(key, String(value));
            });
            requestBody = formData.toString();
          } else {
            requestBody = req.body;
          }
        }
      }

      // Validate URL
      const result = proxyRequestSchema.safeParse({ url: targetUrl });
      if (!result.success) {
        const errorMsg = 'Invalid URL provided';
        if (isJsonRequest) {
          return res.status(400).json({ message: errorMsg, errors: result.error.issues });
        } else {
          return res.status(400).send(errorMsg);
        }
      }

      targetUrl = result.data.url;

      // Security check
      if (!isUrlSafe(targetUrl)) {
        const errorMsg = 'Access to this URL is not allowed for security reasons';
        if (isJsonRequest) {
          return res.status(403).json({ message: errorMsg });
        } else {
          return res.status(403).send(errorMsg);
        }
      }

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: requestMethod,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow',
      };

      // Add body and content-type for POST requests
      if (requestMethod === 'POST' && requestBody) {
        fetchOptions.body = requestBody;
        // Preserve original Content-Type if available
        const contentType = req.get('Content-Type');
        if (contentType && !contentType.includes('application/json')) {
          (fetchOptions.headers as Record<string, string>)['Content-Type'] = contentType;
        } else {
          (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      // Fetch the external website
      const response = await fetch(targetUrl, fetchOptions);

      if (!response.ok) {
        const errorMsg = `Failed to fetch website: ${response.statusText}`;
        if (isJsonRequest) {
          return res.status(response.status).json({ message: errorMsg, status: response.status });
        } else {
          return res.status(response.status).send(errorMsg);
        }
      }

      const contentType = response.headers.get('content-type') || '';
      
      // Handle different content types
      if (contentType.includes('text/html')) {
        let content = await response.text();
        const finalUrl = response.url;

        // Rewrite ALL URLs to go through proxy
        content = rewriteUrlsToProxy(content, finalUrl);

        if (isJsonRequest) {
          return res.json({
            content,
            status: response.status,
            contentType,
            finalUrl,
          });
        } else {
          res.set('Content-Type', 'text/html');
          return res.send(content);
        }
      } else if (contentType.includes('text/css')) {
        let cssContent = await response.text();
        cssContent = rewriteCssUrls(cssContent, response.url);
        
        res.set('Content-Type', 'text/css');
        return res.send(cssContent);
      } else if (contentType.includes('javascript') || contentType.includes('json')) {
        const content = await response.text();
        res.set('Content-Type', contentType);
        return res.send(content);
      } else if (contentType.startsWith('image/') || contentType.startsWith('video/') || 
                 contentType.startsWith('audio/') || contentType.includes('font') ||
                 contentType.includes('octet-stream')) {
        const buffer = await response.arrayBuffer();
        res.set('Content-Type', contentType);
        return res.send(Buffer.from(buffer));
      } else {
        const content = await response.text();
        res.set('Content-Type', contentType);
        return res.send(content);
      }

    } catch (error) {
      console.error('Proxy error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return res.status(500).json({
        message: "Failed to fetch the website",
        details: errorMessage,
      });
    }
  };

  app.get("/api/proxy", handleProxy);
  app.post("/api/proxy", handleProxy);

  const httpServer = createServer(app);
  return httpServer;
}

// Helper to encode URL for proxy
function encodeProxyUrl(url: string): string {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}

// Rewrite ALL URLs in HTML to go through proxy using proper URL resolution
function rewriteUrlsToProxy(html: string, baseUrl: string): string {
  let modified = html;

  // Helper to convert any URL to proxied URL using proper URL resolution
  const toProxied = (url: string): string => {
    try {
      // Skip special protocols
      if (!url || url.trim() === '' || url.startsWith('data:') || 
          url.startsWith('javascript:') || url.startsWith('mailto:') || 
          url.startsWith('tel:') || url.startsWith('#')) {
        return url;
      }

      // Use proper URL resolution
      const absoluteUrl = new URL(url, baseUrl).href;
      
      // Route through proxy
      return encodeProxyUrl(absoluteUrl);
    } catch {
      // If URL parsing fails, return original
      return url;
    }
  };

  // Rewrite src attributes
  modified = modified.replace(/(<(?:img|script|iframe|frame|embed|source|video|audio)[^>]+\s+src=["'])([^"']+)(["'])/gi, 
    (match, before, url, after) => before + toProxied(url) + after
  );

  // Rewrite srcset attributes for responsive images
  modified = modified.replace(/(<(?:img|source)[^>]+\s+srcset=["'])([^"']+)(["'])/gi,
    (match, before, srcset, after) => {
      // srcset contains comma-separated URLs with optional descriptors
      const rewritten = srcset.split(',').map((item: string) => {
        const parts = item.trim().split(/\s+/);
        const url = parts[0];
        const descriptor = parts.slice(1).join(' ');
        return toProxied(url) + (descriptor ? ' ' + descriptor : '');
      }).join(', ');
      return before + rewritten + after;
    }
  );

  // Rewrite ALL href attributes
  modified = modified.replace(/(<(?:a|link|area)[^>]+\s+href=["'])([^"']+)(["'])/gi,
    (match, before, url, after) => before + toProxied(url) + after
  );

  // Rewrite CSS url() values
  modified = modified.replace(/url\(["']?([^"')]+)["']?\)/gi,
    (match, url) => `url("${toProxied(url)}")`
  );

  // Rewrite action attributes in forms
  modified = modified.replace(/(<form[^>]+\s+action=["'])([^"']+)(["'])/gi,
    (match, before, url, after) => before + toProxied(url) + after
  );

  // Rewrite poster attributes for video
  modified = modified.replace(/(<video[^>]+\s+poster=["'])([^"']+)(["'])/gi,
    (match, before, url, after) => before + toProxied(url) + after
  );

  // Remove base tag if exists
  modified = modified.replace(/<base[^>]*>/gi, '');

  // Frame-busting prevention
  modified = modified.replace(/top\.location/gi, 'self.location');
  modified = modified.replace(/parent\.location/gi, 'self.location');
  modified = modified.replace(/window\.top/gi, 'window.self');
  modified = modified.replace(/top\s*===\s*self/gi, 'true');
  modified = modified.replace(/top\s*!==\s*self/gi, 'false');

  return modified;
}

// Rewrite URLs in CSS files using proper URL resolution
function rewriteCssUrls(css: string, baseUrl: string): string {
  return css.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, url) => {
    try {
      if (url.startsWith('data:') || url.startsWith('#')) {
        return match;
      }

      // Use proper URL resolution
      const absoluteUrl = new URL(url, baseUrl).href;
      const proxiedUrl = encodeProxyUrl(absoluteUrl);
      return `url("${proxiedUrl}")`;
    } catch {
      return match;
    }
  });
}
