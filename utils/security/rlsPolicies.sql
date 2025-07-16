-- RLS Policies for 24Hour-ai Chatbot Security
-- These policies should be applied to your Supabase database

-- Enable RLS on all tables
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "checklist_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSession" ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own conversations" ON "Conversation"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own conversations" ON "Conversation"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own conversations" ON "Conversation"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own conversations" ON "Conversation"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Messages are accessible through conversation ownership
CREATE POLICY "Users can view messages in own conversations" ON "messages"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Conversation" 
            WHERE "Conversation"."id" = "messages"."conversationId" 
            AND "Conversation"."userId" = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert messages in own conversations" ON "messages"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Conversation" 
            WHERE "Conversation"."id" = "messages"."conversationId" 
            AND "Conversation"."userId" = auth.uid()::text
        )
    );

CREATE POLICY "Users can update messages in own conversations" ON "messages"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM "Conversation" 
            WHERE "Conversation"."id" = "messages"."conversationId" 
            AND "Conversation"."userId" = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete messages in own conversations" ON "messages"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "Conversation" 
            WHERE "Conversation"."id" = "messages"."conversationId" 
            AND "Conversation"."userId" = auth.uid()::text
        )
    );

-- Users can only access their own user record
CREATE POLICY "Users can view own profile" ON "users"
    FOR SELECT USING (auth.uid()::text = "clerkId");

CREATE POLICY "Users can update own profile" ON "users"
    FOR UPDATE USING (auth.uid()::text = "clerkId");

-- User sessions are private to each user
CREATE POLICY "Users can view own sessions" ON "UserSession"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own sessions" ON "UserSession"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own sessions" ON "UserSession"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own sessions" ON "UserSession"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Checklist items - restrict based on your business logic
-- For now, allowing read access to all authenticated users
CREATE POLICY "Authenticated users can view checklist items" ON "checklist_items"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can modify checklist items (adjust based on your admin logic)
CREATE POLICY "Admins can modify checklist items" ON "checklist_items"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "users" 
            WHERE "users"."clerkId" = auth.uid()::text 
            AND "users"."email" IN ('admin@24hour-ai.com') -- Replace with your admin emails
        )
    );
