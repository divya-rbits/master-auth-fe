/**
 * Content Sanitization Utility
 * Provides safe HTML sanitization for user-generated content
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {Object} config - Optional DOMPurify configuration
 * @returns {string} - Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (dirty, config = {}) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    ...config
  };

  return DOMPurify.sanitize(dirty, defaultConfig);
};

/**
 * Sanitizes text content - strips all HTML tags
 * Use this when you only want plain text with no HTML
 * @param {string} dirty - The potentially unsafe string
 * @returns {string} - Plain text with all HTML removed
 */
export const sanitizeText = (dirty) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitizes rich content (allows more HTML tags)
 * Use for user-generated content that needs formatting
 * @param {string} dirty - The potentially unsafe HTML string
 * @returns {string} - Sanitized HTML with safe formatting tags
 */
export const sanitizeRichContent = (dirty) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'b', 'i', 'em', 'strong', 'u', 's', 'del',
      'a',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false
  });
};

/**
 * Configures DOMPurify with hooks and custom settings
 * Call this once during app initialization if needed
 */
export const configureSanitizer = () => {
  // Add hook to enforce target="_blank" rel="noopener noreferrer" on all links
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

/**
 * Usage Examples:
 *
 * // For plain text (strips all HTML)
 * const safeText = sanitizeText(userInput);
 *
 * // For basic formatted content
 * const safeHtml = sanitizeHtml(userContent);
 *
 * // For rich user content (blogs, comments, etc.)
 * const safeRichContent = sanitizeRichContent(userArticle);
 *
 * // In React component (when you absolutely must use dangerouslySetInnerHTML)
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 *
 * // Note: React escapes text content by default, so you typically don't need
 * // sanitization unless you're using dangerouslySetInnerHTML
 */

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeRichContent,
  configureSanitizer
};
