
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database.types';

// Export the supabase client
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
