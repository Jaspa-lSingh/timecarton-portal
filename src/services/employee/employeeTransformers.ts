
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
 * Transform employee data from application format to database format
 * @param user User data from application
 * @returns Database user object
 */
export const transformToDbUser = (user: Partial<User>): Record<string, any> => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role || 'employee',
    employee_id: user.employeeId,
    position: user.position,
    department: user.department,
    hourly_rate: user.hourlyRate,
    phone_number: user.phoneNumber,
    avatar_url: user.avatar,
    street: user.address?.street,
    city: user.address?.city,
    state: user.address?.state,
    country: user.address?.country,
    zip_code: user.address?.zipCode,
  };
};
