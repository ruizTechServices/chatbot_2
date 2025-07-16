// utils/security/sanitize.ts
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'img', 'svg'],
  });
}

/**
 * Sanitize plain text content
 */
export function sanitizeText(text: string): string {
  return purify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Detect potential prompt injection attempts
 */
export function detectPromptInjection(content: string): boolean {
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/i,
    /forget\s+everything/i,
    /system\s*:\s*you\s+are/i,
    /\[INST\]/i,
    /\<\|system\|\>/i,
    /assistant\s*:\s*i\s+will/i,
    /override\s+your\s+instructions/i,
    /jailbreak/i,
    /pretend\s+to\s+be/i,
    /role\s*:\s*system/i,
  ];

  return suspiciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Clean and validate user input
 */
export function cleanUserInput(input: string): string {
  // Remove excessive whitespace
  let cleaned = input.trim().replace(/\s+/g, ' ');
  
  // Remove null bytes and control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Sanitize HTML if present
  cleaned = sanitizeHtml(cleaned);
  
  return cleaned;
}
