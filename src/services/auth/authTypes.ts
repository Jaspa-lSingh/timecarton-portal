
import { User } from '@/types';

// Types for service responses
export interface AuthResponse {
  data?: any;
  error?: string;
  message?: string;
}

// Shared state for auth services
export const authState = {
  // Cache the current user to avoid repeated calls to getUser
  currentUserCache: null as User | null,
  // Cache the access token
  currentTokenCache: null as string | null,
};

// Super Admin credentials
export const SUPER_ADMIN = {
  id: '875626',
  email: 'jskamboj521@gmail.com',
  password: 'Kam@8756',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin' as const,
  position: 'Super Administrator',
};
