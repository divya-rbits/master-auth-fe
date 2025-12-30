# XSS Protection Testing Guide

## Manual Testing Instructions

### Test 1: Valid URLs (Should Allow)

Open your browser console and test these URLs:

```javascript
// Test in browser console when on localhost:5173 or your dev server
const testValid = [
  'https://td.reversebits.com/dashboard',
  'http://localhost:3000/app',
  'https://app.reversebits.com/home',
  '/dashboard',
  '/success?token=abc123'
];

// Test each one
testValid.forEach(url => {
  console.log(`Testing: ${url}`);
  console.log(`Result: ${window.location.origin}/success?returnUrl=${encodeURIComponent(url)}`);
});
```

**Expected**: All should redirect properly to the specified URL

---

### Test 2: Dangerous Protocols (Should Block)

```javascript
const testDangerous = [
  'javascript:alert("XSS")',
  'data:text/html,<script>alert("XSS")</script>',
  'vbscript:msgbox("XSS")',
  'file:///etc/passwd'
];

// These should all redirect to default: https://td.reversebits.com
```

**Expected**: All should redirect to the default URL, console should show warnings

---

### Test 3: Untrusted Domains (Should Block)

```javascript
const testUntrusted = [
  'https://evil.com/phishing',
  'https://malicious-site.net/steal-data',
  'https://reversebits.co/fake'  // Similar but wrong TLD
];
```

**Expected**: All should redirect to default, console shows domain warnings

---

### Test 4: Edge Cases

```javascript
const testEdgeCases = [
  '',  // Empty string
  null,
  undefined,
  '   ',  // Whitespace
  'not a valid url',
  'JAVASCRIPT:alert(1)',  // Mixed case
  'https://td.reversebits.com@evil.com'  // @ redirect attempt
];
```

**Expected**: All should default to https://td.reversebits.com

---

## Live Testing Steps

### Step 1: Test Login Flow with Valid returnUrl

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/?returnUrl=https://td.reversebits.com/dashboard`
3. Enter master password and login
4. **Expected**: Redirects to `https://td.reversebits.com/dashboard` after 2 seconds

### Step 2: Test Login Flow with Malicious returnUrl

1. Navigate to: `http://localhost:5173/?returnUrl=javascript:alert("XSS")`
2. Enter master password and login
3. **Expected**:
   - Console shows warning: `⚠️ Blocked dangerous protocol in returnUrl`
   - Redirects to default: `https://td.reversebits.com`

### Step 3: Test Login Flow with Untrusted Domain

1. Navigate to: `http://localhost:5173/?returnUrl=https://evil.com/phishing`
2. Enter master password and login
3. **Expected**:
   - Console shows warning: `⚠️ Blocked redirect to untrusted domain: evil.com`
   - Redirects to default: `https://td.reversebits.com`

### Step 4: Test Relative URLs

1. Navigate to: `http://localhost:5173/?returnUrl=/dashboard`
2. Enter master password and login
3. **Expected**: Should work since it's same-origin

---

## Automated Testing (Optional)

If you want to add automated tests later, install a testing framework:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

Then create tests in `src/utils/__tests__/urlValidator.spec.js`

---

## Security Checklist

- [x] No `dangerouslySetInnerHTML` usage
- [x] URL validation implemented
- [x] Dangerous protocols blocked
- [x] Domain whitelist enforced
- [x] Relative URLs allowed (same-origin)
- [x] Console warnings for blocked attempts
- [x] DOMPurify installed for future use
- [ ] CSP headers configured in production
- [ ] Security headers configured in production

---

## Production Deployment Checklist

Before deploying to production:

1. **Configure CSP headers** - See [CSP_CONFIGURATION.md](CSP_CONFIGURATION.md)
2. **Add your production domains** to `src/utils/urlValidator.js` ALLOWED_DOMAINS
3. **Enable HTTPS only** - Update CSP to block HTTP (except localhost)
4. **Test all flows** - Run through the manual tests above
5. **Monitor console** - Check for any unexpected warnings in production

---

## Adding New Allowed Domains

Edit `src/utils/urlValidator.js`:

```javascript
const ALLOWED_DOMAINS = [
  'reversebits.com',
  'td.reversebits.com',
  'your-new-domain.com',  // Add here
  'localhost',
  '127.0.0.1',
  '[::1]'
];
```

Or dynamically at runtime:

```javascript
import { allowDomain } from './utils/urlValidator';

allowDomain('new-trusted-domain.com');
```
