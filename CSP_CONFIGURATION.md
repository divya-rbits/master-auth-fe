# Content Security Policy (CSP) Configuration Guide

## Overview
Content Security Policy (CSP) is an HTTP header that helps prevent XSS attacks by controlling which resources can be loaded and executed on your web application.

## Recommended CSP Headers for Production

### Basic CSP Header
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://td.reversebits.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
```

### Breakdown of Directives

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Only load resources from same origin by default |
| `script-src` | `'self'` | Only execute scripts from same origin |
| `style-src` | `'self' 'unsafe-inline'` | Allow same-origin styles and inline styles (needed for React CSS modules) |
| `img-src` | `'self' data: https:` | Allow same-origin images, data URIs, and HTTPS images |
| `font-src` | `'self'` | Only load fonts from same origin |
| `connect-src` | `'self' https://td.reversebits.com` | API calls only to same origin and your backend |
| `frame-ancestors` | `'none'` | Prevent clickjacking - don't allow framing |
| `base-uri` | `'self'` | Restrict base tag to same origin |
| `form-action` | `'self'` | Forms can only submit to same origin |

### Additional Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Implementation for Your Setup

### Cloudflare Configuration

Since you're using Cloudflare for port forwarding and domain mapping, you have two options:

#### Option 1: Cloudflare Transform Rules (Recommended)

1. Go to Cloudflare Dashboard → Your Domain → Rules → Transform Rules
2. Click "Modify Response Header"
3. Create a new rule with these settings:

**Rule Name**: Add Security Headers

**When incoming requests match**: All incoming requests

**Then**: Set Static Headers

Add these headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://td.reversebits.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';

X-Content-Type-Options: nosniff

X-Frame-Options: DENY

X-XSS-Protection: 1; mode=block

Referrer-Policy: strict-origin-when-cross-origin
```

#### Option 2: Cloudflare Workers (Advanced)

If you need more control, create a Cloudflare Worker:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newResponse = new Response(response.body, response)

  // Add security headers
  newResponse.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://td.reversebits.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  )
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-XSS-Protection', '1; mode=block')
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return newResponse
}
```

---

### Local Server Configuration (Optional)

If you're running a local web server behind Cloudflare, you can also add headers there:

#### Vite Development (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' http://localhost:3001; frame-ancestors 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    }
  }
})
```

#### Express.js Backend
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", "https://td.reversebits.com"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));
```

---

## Testing CSP

### 1. Browser Console
Open DevTools console and check for CSP violations when browsing your site

### 2. Online Tools
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers](https://securityheaders.com/)

### 3. Report-Only Mode (Testing)
Before enforcing, test with report-only mode:
```
Content-Security-Policy-Report-Only: default-src 'self'; ...
```

---

## Troubleshooting

### Issue: Inline styles blocked
**Solution**: Add `'unsafe-inline'` to `style-src` (already included for React CSS modules)

### Issue: External API calls blocked
**Solution**: Add the API domain to `connect-src` directive

### Issue: Images not loading
**Solution**: Add the image source domain to `img-src` or use `https:` to allow all HTTPS images

---

## Notes

- **`'unsafe-inline'` in style-src**: Required for React CSS modules. This is acceptable as React escapes content by default.
- **Cloudflare Free Plan**: Transform Rules are available on all plans including free
- **Testing First**: Use CSP Report-Only mode to test before enforcing
- **Monitor Violations**: Check browser console for CSP violations during testing

---

## Quick Setup Checklist for Cloudflare

1. [ ] Log into Cloudflare Dashboard
2. [ ] Go to your domain → Rules → Transform Rules
3. [ ] Click "Modify Response Header"
4. [ ] Create rule named "Add Security Headers"
5. [ ] Add all security headers listed above
6. [ ] Test using securityheaders.com
7. [ ] Monitor browser console for violations
8. [ ] Adjust CSP if needed based on violations

---

## Do I Need This?

**Short Answer**: Highly recommended but not absolutely required.

**Why It's Good**:
- Adds an extra layer of XSS protection
- Industry best practice
- Easy to set up with Cloudflare (5 minutes)
- No performance impact

**Your Current Protection**:
- ✅ URL validation (blocks malicious redirects)
- ✅ React's automatic escaping (prevents XSS in most cases)
- ✅ No dangerous patterns in code

**CSP Adds**:
- 🛡️ Defense in depth (if other protections fail)
- 🛡️ Prevents inline script execution
- 🛡️ Blocks unauthorized resource loading

**Recommendation**: Set it up via Cloudflare Transform Rules (takes 5 minutes, free tier available)
