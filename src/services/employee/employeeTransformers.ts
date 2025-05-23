
import { User } from '@/types';

/**
 * Transform user data from database format to application format
 * @param dbUser User data from database
 * @returns Transformed User object
 */
export const transformUser = (dbUser: any): User => {
  if (!dbUser) {
    console.error('Cannot transform undefined or null user');
    throw new Error('Invalid user data');
  }

  if (!dbUser.id) {
    console.error('User data missing required ID field:', dbUser);
    throw new Error('User data missing required ID field');
  }

  console.log(`Transforming user with ID ${dbUser.id}`);
  
  // Create user object with safe defaults for nullable fields
  return {
    id: dbUser.id,
    email: dbUser.email || '',
    firstName: dbUser.first_name || '',
    lastName: dbUser.last_name || '',
    role: dbUser.role || 'employee',
    employeeId: dbUser.employee_id || '',
    position: dbUser.position || '',
    department: dbUser.department || '',
    hourlyRate: dbUser.hourly_rate || 0,
    phoneNumber: dbUser.phone_number || '',
    avatar: dbUser.avatar_url || '',
    address: {
      street: dbUser.street || '',
      city: dbUser.city || '',
      state: dbUser.state || '',
      country: dbUser.country || '',
      zipCode: dbUser.zip_code || '',
    }
  };
};

/**
 * Transform an array of database users to application user objects
 * @param dbUsers Array of users from database
 * @returns Array of transformed User objects
 */
export const transformUsers = (dbUsers: any[]): User[] => {
  if (!Array.isArray(dbUsers)) {
    console.error('Cannot transform non-array data to users');
    return [];
  }
  
  console.log(`Transforming ${dbUsers.length} users`);
  
  const transformedUsers: User[] = [];
  for (const dbUser of dbUsers) {
    if (dbUser) {
      try {
        const transformedUser = transformUser(dbUser);
        transformedUsers.push(transformedUser);
      } catch (err) {
        console.error(`Error transforming user in batch:`, err);
      }
    }
  }
  
  console.log(`Successfully transformed ${transformedUsers.length} out of ${dbUsers.length} users`);
  return transformedUsers;
};

/**
 * Transform employee data from application format to database format
 * Handle null values and defaults for required fields
 * @param user User data from application
 * @returns Database user object
 */
export const transformToDbUser = (user: Partial<User>): Record<string, any> => {
  // Ensure all required fields have values to prevent database constraint violations
  const dbUser = {
    id: user.id,
    email: user.email || '',
    first_name: user.firstName || '',
    last_name: user.lastName || '',
    role: user.role || 'employee',
    employee_id: user.employeeId || '',
    position: user.position || '',
    department: user.department || '',
    hourly_rate: user.hourlyRate || 0,
    phone_number: user.phoneNumber || '',
    avatar_url: user.avatar || '',
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    country: user.address?.country || '',
    zip_code: user.address?.zipCode || '',
  };

  // Filter out undefined values
  return Object.fromEntries(
    Object.entries(dbUser).filter(([_, value]) => value !== undefined)
  );
};
