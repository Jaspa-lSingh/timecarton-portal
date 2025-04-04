
import { Shift, ApiResponse, User, ShiftStatus } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services';

/**
 * Service for shift assignment operations
 */
export const shiftAssignmentService = {
  /**
   * Assign a single shift to a specific user
   */
  assignShiftToUser: async (
    userId: string,
    shiftData: Partial<Shift>
  ): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized. Only admins can assign shifts.' };
    }
    
    try {
      // Transform from frontend model to database model
      const dbShift = {
        employee_id: userId,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        position: shiftData.position,
        department: shiftData.department,
        notes: shiftData.notes,
        status: shiftData.status || 'scheduled',
        location: shiftData.location,
        requirements: shiftData.requirements
      };
      
      console.log('Creating shift for user:', userId, dbShift);
      
      const { data, error } = await supabase
        .from('shifts')
        .insert([dbShift])
        .select()
        .single();
      
      if (error) {
        console.error('Error assigning shift to user:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShift(data), 
        message: 'Shift assigned successfully' 
      };
    } catch (error) {
      console.error('Error assigning shift to user:', error);
      return { error: 'Network error when assigning shift' };
    }
  },

  /**
   * Assign the same shift to multiple users at once
   */
  bulkAssignShift: async (
    userIds: string[],
    shiftData: Partial<Shift>
  ): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized. Only admins can assign shifts.' };
    }
    
    if (!userIds.length) {
      return { error: 'No users selected for shift assignment' };
    }
    
    try {
      // Create shift objects for each employee
      const shifts = userIds.map(userId => ({
        employee_id: userId,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        position: shiftData.position,
        department: shiftData.department,
        notes: shiftData.notes,
        status: shiftData.status || 'scheduled',
        location: shiftData.location,
        requirements: shiftData.requirements
      }));
      
      console.log('Bulk assigning shifts to users:', userIds.length);
      
      const { data, error } = await supabase
        .from('shifts')
        .insert(shifts)
        .select();
      
      if (error) {
        console.error('Error bulk assigning shifts:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShifts(data), 
        message: `Successfully assigned shifts to ${userIds.length} users` 
      };
    } catch (error) {
      console.error('Error bulk assigning shifts:', error);
      return { error: 'Network error when assigning shifts' };
    }
  },
  
  /**
   * Get all available employees for shift assignment
   */
  getAvailableEmployees: async (startTime: string, endTime: string): Promise<ApiResponse<User[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // First get all employees
      const { data: employees, error: empError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'employee');
      
      if (empError) {
        console.error('Error fetching employees:', empError);
        return { error: empError.message };
      }
      
      if (!employees || employees.length === 0) {
        return { data: [] };
      }
      
      // Then get all shifts during the time period
      const { data: existingShifts, error: shiftError } = await supabase
        .from('shifts')
        .select('employee_id')
        .or(`start_time.gte.${startTime},end_time.gte.${startTime}`)
        .or(`start_time.lte.${endTime},end_time.lte.${endTime}`);
      
      if (shiftError) {
        console.error('Error checking existing shifts:', shiftError);
        return { error: shiftError.message };
      }
      
      // Filter out employees who already have shifts during this time
      const busyEmployeeIds = new Set(existingShifts?.map(shift => shift.employee_id) || []);
      const availableEmployees = employees.filter(emp => !busyEmployeeIds.has(emp.id));
      
      return { 
        data: availableEmployees.map(transformEmployee),
        message: `${availableEmployees.length} employees available for assignment` 
      };
    } catch (error) {
      console.error('Error checking employee availability:', error);
      return { error: 'Network error when checking employee availability' };
    }
  }
};

// Helper functions to transform database models to frontend models
function transformShift(shift: any): Shift {
  return {
    id: shift.id,
    employeeId: shift.employee_id,
    startTime: shift.start_time,
    endTime: shift.end_time,
    position: shift.position,
    department: shift.department,
    notes: shift.notes,
    status: shift.status as ShiftStatus,
    location: shift.location,
    requirements: shift.requirements
  };
}

function transformShifts(shifts: any[]): Shift[] {
  return shifts.map(transformShift);
}

function transformEmployee(employee: any): User {
  return {
    id: employee.id,
    firstName: employee.first_name || '',
    lastName: employee.last_name || '',
    email: employee.email || '',
    role: employee.role || 'employee',
    employeeId: employee.employee_id || '',
    position: employee.position || '',
    department: employee.department || '',
    hourlyRate: employee.hourly_rate || 0,
    phoneNumber: employee.phone_number || '',
    avatar: employee.avatar_url || '',
    address: {
      street: employee.street || '',
      city: employee.city || '',
      state: employee.state || '',
      country: employee.country || '',
      zipCode: employee.zip_code || ''
    }
  };
}
