// utils/security/rateLimit.ts
import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory rate limit store (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting configuration
 */
const RATE_LIMITS = {
  '/api/openai/chat': { requests: 30, windowMs: 60000 }, // 30 requests per minute
  '/api/openai/embeddings': { requests: 20, windowMs: 60000 }, // 20 requests per minute
  '/api/openai/image': { requests: 10, windowMs: 60000 }, // 10 requests per minute
  '/api/google/gemini': { requests: 30, windowMs: 60000 }, // 30 requests per minute
  '/api/conversations': { requests: 50, windowMs: 60000 }, // 50 requests per minute
  default: { requests: 100, windowMs: 60000 }, // Default: 100 requests per minute
};

/**
 * Get client identifier for rate limiting
 */
function getClientId(req: NextRequest): string {
  // Try to get user ID from session/auth
  const userId = req.headers.get('x-user-id');
  if (userId) return `user:${userId}`;
  
  // Fall back to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const directIp = req.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0] : directIp || 'unknown';
  return `ip:${ip}`;
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(req: NextRequest, endpoint: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const clientId = getClientId(req);
  const key = `${clientId}:${endpoint}`;
  const now = Date.now();
  
  // Get rate limit config for this endpoint
  const config = RATE_LIMITS[endpoint as keyof typeof RATE_LIMITS] || RATE_LIMITS.default;
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.requests - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: config.requests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up expired entries every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);
