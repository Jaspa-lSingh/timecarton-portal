
import { supabase } from '@/lib/supabase';
import { authState, SUPER_ADMIN } from './authTypes';

export const tokenService = {
  // Get authentication token for API requests
  getToken(): string | null {
    // For super admin, we use a special token
    if (authState.currentUserCache?.id === SUPER_ADMIN.id) {
      return authState.currentTokenCache || `super_admin_${Date.now()}`;
    }
    
    if (authState.currentTokenCache) return authState.currentTokenCache;
    
    // If not in cache, try to get it asynchronously
    const getTokenAsync = async (): Promise<string | null> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting token:', error);
          return null;
        }
        
        const token = data.session?.access_token || null;
        // Cache the token
        authState.currentTokenCache = token;
        return token;
      } catch (error) {
        console.error('Get token error:', error);
        return null;
      }
    };
    
    // Start the async operation but return null synchronously
    getTokenAsync();
    return null;
  }
};
