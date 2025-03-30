
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
      getUser: () => {
        console.log('Mock: auth.getUser() called');
        return Promise.resolve({ data: { user: null }, error: null });
      },
      signInWithPassword: () => {
        console.log('Mock: auth.signInWithPassword() called');
        return Promise.resolve({ data: { user: { id: '875626', email: 'jskamboj521@gmail.com' }, session: { access_token: 'mock_token' } }, error: null });
      },
      signUp: () => {
        console.log('Mock: auth.signUp() called');
        return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
      },
      signOut: () => {
        console.log('Mock: auth.signOut() called');
        return Promise.resolve({ error: null });
      },
      getSession: () => {
        console.log('Mock: auth.getSession() called');
        return Promise.resolve({ data: { session: { access_token: 'mock_token' } }, error: null });
      },
    },
    from: (table) => {
      console.log(`Mock: from('${table}') called`);
      return {
        select: () => {
          console.log(`Mock: ${table}.select() called`);
          return {
            eq: () => {
              console.log(`Mock: ${table}.select().eq() called`);
              return Promise.resolve({ data: [], error: new Error('Supabase not configured') });
            },
            single: () => {
              console.log(`Mock: ${table}.select().single() called`);
              return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
            },
          };
        },
        insert: () => {
          console.log(`Mock: ${table}.insert() called`);
          return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
        },
        update: () => {
          console.log(`Mock: ${table}.update() called`);
          return {
            eq: () => {
              console.log(`Mock: ${table}.update().eq() called`);
              return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
            },
          };
        },
        delete: () => {
          console.log(`Mock: ${table}.delete() called`);
          return {
            eq: () => {
              console.log(`Mock: ${table}.delete().eq() called`);
              return Promise.resolve({ error: new Error('Supabase not configured') });
            },
          };
        },
      };
    },
    storage: {
      from: (bucket) => {
        console.log(`Mock: storage.from('${bucket}') called`);
        return {
          upload: () => {
            console.log(`Mock: ${bucket}.upload() called`);
            return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
          },
          getPublicUrl: () => {
            console.log(`Mock: ${bucket}.getPublicUrl() called`);
            return { data: { publicUrl: '' } };
          },
        };
      },
    },
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
    // If using super admin session, return true
    const isSuperAdminSession = localStorage.getItem('superAdminSession') === 'true';
    if (isSuperAdminSession) {
      return true;
    }
    
    // Normal Supabase authentication check
    const { data } = await supabase.auth.getUser();
    return !!data.user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
