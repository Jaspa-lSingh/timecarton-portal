
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

// Initialize the Supabase client with fallback values for development
// In production, these should be set as actual environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client for development if credentials are missing
let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your environment variables.');
  
  // Create a mock client that doesn't throw errors but logs operations
  const mockClient = {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      }),
    }),
  };
  
  // @ts-ignore - This is a mock implementation
  supabase = mockClient;
} else {
  // Create the real Supabase client if credentials are available
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// This will avoid the TypeScript error in authService.ts
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getUser();
    return !!data.user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

