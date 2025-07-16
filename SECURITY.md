# Security Implementation Guide - 24Hour-ai Chatbot

## Overview
This document outlines the security measures implemented in the 24Hour-ai chatbot application to protect against common vulnerabilities and ensure data integrity.

## Security Features Implemented

### 1. Input Validation with Zod
- **Location**: `utils/validation/schemas.ts`
- **Purpose**: Validate all incoming API requests
- **Features**:
  - Message length limits (1-10,000 characters)
  - Conversation history limits (max 50 messages)
  - Type validation for all fields
  - Parameter constraints (temperature, max_tokens, etc.)

### 2. DOMPurify Sanitization
- **Location**: `utils/security/sanitize.ts`
- **Purpose**: Prevent XSS attacks and sanitize user input
- **Features**:
  - HTML sanitization with allowed tags whitelist
  - Plain text sanitization
  - Control character removal
  - Null byte protection

### 3. Prompt Injection Detection
- **Location**: `utils/security/sanitize.ts`
- **Purpose**: Detect and prevent prompt injection attacks
- **Patterns Detected**:
  - "ignore previous instructions"
  - "forget everything"
  - "system: you are"
  - "[INST]" and similar instruction markers
  - Role manipulation attempts
  - Jailbreak attempts

### 4. Rate Limiting
- **Location**: `utils/security/rateLimit.ts`
- **Purpose**: Prevent abuse and DoS attacks
- **Limits**:
  - Chat API: 30 requests/minute
  - Embeddings: 20 requests/minute
  - Image generation: 10 requests/minute
  - Conversations: 50 requests/minute
  - Default: 100 requests/minute

### 5. Security Middleware
- **Location**: `utils/security/middleware.ts`
- **Purpose**: Centralized security enforcement
- **Features**:
  - Automatic rate limiting
  - Request validation
  - Prompt injection detection
  - Input sanitization
  - Security headers injection

### 6. Supabase RLS Policies
- **Location**: `utils/security/rlsPolicies.sql`
- **Purpose**: Database-level access control
- **Policies**:
  - Users can only access their own conversations
  - Messages are accessible through conversation ownership
  - User profiles are private to each user
  - Session data is user-specific

## API Routes Updated

### Secured Routes
- ✅ `/api/openai/chat` - Chat completions with full security
- ✅ `/api/openai/embeddings` - Text embeddings with validation
- ✅ `/api/conversations` (POST) - Conversation creation with sanitization

### Pending Routes
- `/api/openai/image` - Image generation
- `/api/google/gemini` - Gemini API calls
- `/api/pinecone/*` - Vector database operations
- `/api/conversations/[id]/*` - Conversation management

## Security Headers Applied
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-RateLimit-Remaining: <count>`
- `X-RateLimit-Reset: <timestamp>`

## Implementation Status

### ✅ Completed
- [x] Zod schema validation for API routes
- [x] DOMPurify server-side sanitization utilities
- [x] Prompt injection detection and prevention
- [x] Rate limiting implementation
- [x] Security middleware framework
- [x] RLS policy definitions

### 🔄 In Progress
- [~] Rolling out security middleware to all API routes
- [~] Supabase RLS policy application and verification

### 📋 Next Steps
1. Apply RLS policies to Supabase database
2. Complete security middleware rollout to remaining API routes
3. Test all security measures end-to-end
4. Monitor and adjust rate limits based on usage patterns
5. Implement additional logging for security events

## Usage Examples

### Applying Security Middleware
```typescript
import { withSecurity } from '@/utils/security/middleware';
import { YourSchema } from '@/utils/validation/schemas';

export const POST = withSecurity(
  YourSchema,
  async (req: NextRequest, validatedData) => {
    // Your secure handler logic here
    return NextResponse.json(response);
  }
);
```

### Manual Input Sanitization
```typescript
import { cleanUserInput, detectPromptInjection } from '@/utils/security/sanitize';

const userInput = cleanUserInput(rawInput);
if (detectPromptInjection(userInput)) {
  throw new Error('Security threat detected');
}
```

## Monitoring and Alerts
- Rate limit violations are logged to console
- Prompt injection attempts are blocked and logged
- Failed validations are tracked with detailed error messages
- Security headers are automatically applied to all responses

## Testing Security
1. Test rate limiting by making rapid API calls
2. Attempt prompt injection with known patterns
3. Submit malformed requests to test validation
4. Verify RLS policies prevent unauthorized data access
5. Check security headers in browser developer tools

## Maintenance
- Review and update prompt injection patterns regularly
- Monitor rate limit effectiveness and adjust as needed
- Keep DOMPurify and Zod dependencies updated
- Regularly audit RLS policies for completeness
- Test security measures after any API changes
