// utils/security/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from './rateLimit';
import { detectPromptInjection, cleanUserInput } from './sanitize';

/**
 * Security middleware for API routes
 */
export function withSecurity<T extends z.ZodSchema>(
  schema: T,
  handler: (req: NextRequest, validatedData: z.infer<T>) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Extract endpoint path for rate limiting
      const endpoint = new URL(req.url).pathname;
      
      // Check rate limiting
      const rateLimitResult = checkRateLimit(req, endpoint);
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            resetTime: rateLimitResult.resetTime 
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            }
          }
        );
      }
      
      // Parse and validate request body
      const body = await req.json();
      const validationResult = schema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            error: 'Invalid request data',
            details: validationResult.error.errors 
          },
          { status: 400 }
        );
      }
      
      const validatedData = validationResult.data;
      
      // Check for prompt injection in text fields
      if (validatedData.messages) {
        for (const message of validatedData.messages) {
          if (typeof message.content === 'string') {
            if (detectPromptInjection(message.content)) {
              return NextResponse.json(
                { error: 'Potential security threat detected in message content' },
                { status: 400 }
              );
            }
            // Clean the input
            message.content = cleanUserInput(message.content);
          }
        }
      }
      
      // Check other text fields for prompt injection
      if (validatedData.prompt && detectPromptInjection(validatedData.prompt)) {
        return NextResponse.json(
          { error: 'Potential security threat detected in prompt' },
          { status: 400 }
        );
      }
      
      if (validatedData.text && detectPromptInjection(validatedData.text)) {
        return NextResponse.json(
          { error: 'Potential security threat detected in text' },
          { status: 400 }
        );
      }
      
      // Call the actual handler with validated data
      const response = await handler(req, validatedData);
      
      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());
      
      return response;
      
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Authentication middleware (placeholder - integrate with your auth system)
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // TODO: Implement authentication check
    // For now, this is a placeholder
    return handler(req);
  };
}
