//utils/userSession.ts
import { currentUser } from '@clerk/nextjs/server';
import { createClient } from './supabase/server';
import { getUserNamespace } from './pinecone/client';
import { cookies } from 'next/headers';

export async function handleUserSession() {
  const clerkUser = await currentUser();
  const supabase = createClient(cookies());

  if (!clerkUser) throw new Error("No Clerk user found.");

  // Check or create Supabase user
  let { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUser.id);

  if (error) throw error;

  if (!users || users.length === 0) {
    const { data, error: insertError } = await supabase
      .from('users')
      .insert({ 
        clerk_user_id: clerkUser.id, 
        email: clerkUser.emailAddresses[0].emailAddress 
      })
      .select();

    if (insertError) throw insertError;
    users = data!;
  }

  const supabaseUser = users[0];

  // Fetch Pinecone namespace
  const pineconeNamespace = getUserNamespace(clerkUser.id);

  return { supabaseUser, pineconeNamespace };
}

export async function handleUserSessionModded() {
  const clerkUser = await currentUser();
  const supabase = createClient(cookies());
  
  console.log("Clerk User:", clerkUser);
  if (!clerkUser) throw new Error("No Clerk user found.");
  // Check or create Supabase user
  console.log("Supabase Client:", supabase);
}