/**
 * URL Validation Utility
 * Prevents open redirect vulnerabilities by validating returnUrl parameters
 */

import { config } from '../config/constants';

/**
 * List of allowed domains for returnUrl redirects
 * Add your trusted domains here
 */
const ALLOWED_DOMAINS = [
  'reversebits.com',
  'td.reversebits.com',
  'localhost',
  '127.0.0.1',
  '[::1]'
];

/**
 * Checks if a URL's hostname matches allowed domains
 * @param {string} hostname - The hostname to check
 * @returns {boolean} - Whether the hostname is allowed
 */
const isAllowedDomain = (hostname) => {
  if (!hostname) return false;

  // Check exact matches
  if (ALLOWED_DOMAINS.includes(hostname)) {
    return true;
  }

  // Check subdomain matches (e.g., app.reversebits.com matches reversebits.com)
  return ALLOWED_DOMAINS.some(domain => {
    if (domain.includes('.')) {
      return hostname.endsWith('.' + domain) || hostname === domain;
    }
    return false;
  });
};

/**
 * Validates a returnUrl to prevent open redirect vulnerabilities
 * @param {string} url - The URL to validate
 * @param {string} defaultUrl - Fallback URL if validation fails
 * @returns {string} - The validated URL or default URL
 */
export const validateReturnUrl = (url, defaultUrl = 'https://td.reversebits.com') => {
  // If no URL provided, return default
  if (!url || typeof url !== 'string') {
    return defaultUrl;
  }

  // Trim whitespace
  url = url.trim();

  // Reject empty strings
  if (url.length === 0) {
    return defaultUrl;
  }

  try {
    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
    const lowerUrl = url.toLowerCase();

    if (dangerousProtocols.some(protocol => lowerUrl.startsWith(protocol))) {
      console.warn('⚠️ Blocked dangerous protocol in returnUrl:', url);
      return defaultUrl;
    }

    // Parse the URL
    let parsedUrl;

    // Handle relative URLs (same origin)
    if (url.startsWith('/')) {
      // Relative URL - safe to use as-is since it's same-origin
      return url;
    }

    // Handle absolute URLs
    parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.warn('⚠️ Blocked invalid protocol in returnUrl:', parsedUrl.protocol);
      return defaultUrl;
    }

    // Validate hostname against whitelist
    if (!isAllowedDomain(parsedUrl.hostname)) {
      console.warn('⚠️ Blocked redirect to untrusted domain:', parsedUrl.hostname);
      return defaultUrl;
    }

    // URL is valid
    return url;

  } catch (error) {
    // Invalid URL format
    console.warn('⚠️ Invalid URL format in returnUrl:', url);
    return defaultUrl;
  }
};

/**
 * Adds a domain to the allowed domains list
 * Use this to dynamically allow additional domains
 * @param {string} domain - Domain to allow
 */
export const allowDomain = (domain) => {
  if (domain && !ALLOWED_DOMAINS.includes(domain)) {
    ALLOWED_DOMAINS.push(domain);
  }
};

/**
 * Gets the current list of allowed domains
 * @returns {string[]} - Array of allowed domains
 */
export const getAllowedDomains = () => {
  return [...ALLOWED_DOMAINS];
};
