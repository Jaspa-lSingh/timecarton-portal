
import { User } from '@/types';

// Helper function to transform database model to frontend model
export function transformUser(user: any): User {
  if (!user) {
    console.error('Attempted to transform null or undefined user');
    return null as unknown as User;
  }
  
  return {
    id: user.id || '',
    email: user.email || '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    role: user.role as 'admin' | 'employee' || 'employee',
    employeeId: user.employee_id || '',
    position: user.position || '',
    department: user.department || '',
    hourlyRate: user.hourly_rate,
    phoneNumber: user.phone_number || '',
    avatar: user.avatar_url || '',
    address: {
      street: user.street || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      zipCode: user.zip_code || ''
    }
  };
}

// Helper function to transform database models to frontend models
export function transformUsers(users: any[]): User[] {
  if (!Array.isArray(users)) {
    console.error('Expected users to be an array but got:', typeof users);
    return [];
  }
  return users.map(transformUser).filter(Boolean);
}
