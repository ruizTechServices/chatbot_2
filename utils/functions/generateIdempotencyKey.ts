///Users/gios_laptop/chatbot_2/utils/functions/generateIdempotencyKey.ts
// Helper function to generate a random idempotency key
export function generateIdempotencyKey() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }