
import { User } from '@/types';

// Helper function to transform database model to frontend model
export function transformUser(user: any): User | null {
  if (!user) {
    console.error('Attempted to transform null or undefined user');
    return null;
  }
  
  try {
    console.log('Transforming user:', user);
    
    // Check for required fields
    if (!user.id) {
      console.error('User is missing ID field:', user);
    }
    
    const transformedUser: User = {
      id: user.id || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: (user.role === 'admin' || user.role === 'employee') ? user.role : 'employee',
      employeeId: user.employee_id || '',
      position: user.position || '',
      department: user.department || '',
      hourlyRate: typeof user.hourly_rate === 'number' ? user.hourly_rate : 0,
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
    
    return transformedUser;
  } catch (error) {
    console.error('Error transforming user:', error, user);
    return null;
  }
}

// Helper function to transform database models to frontend models
export function transformUsers(users: any[]): User[] {
  if (!Array.isArray(users)) {
    console.error('Expected users to be an array but got:', typeof users);
    return [];
  }
  
  console.log('Transforming users array of length:', users.length);
  
  const transformed = users
    .map((user, index) => {
      const result = transformUser(user);
      if (!result) {
        console.error(`Failed to transform user at index ${index}:`, user);
      }
      return result;
    })
    .filter((user): user is User => user !== null);
  
  console.log('Number of successfully transformed users:', transformed.length);
  
  return transformed;
}
