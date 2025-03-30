
import { Shift, ApiResponse, ShiftChangeRequest, ShiftCoverRequest } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { authService } from './authService';

// Shift service
export const shiftService = {
  // Get all shifts
  getAllShifts: async (): Promise<ApiResponse<Shift[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*');
      
      if (error) {
        console.error('Error fetching shifts:', error);
        return { error: error.message };
      }
      
      return { data: transformShifts(data) };
    } catch (error) {
      console.error('Error fetching shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },
  
  // Get shifts for a specific employee
  getEmployeeShifts: async (employeeId: string): Promise<ApiResponse<Shift[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('employee_id', employeeId);
      
      if (error) {
        console.error('Error fetching employee shifts:', error);
        return { error: error.message };
      }
      
      return { data: transformShifts(data) };
    } catch (error) {
      console.error('Error fetching employee shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },
  
  // Get shifts for a specific date or date range
  getShiftsByDate: async (startDate: string, endDate?: string): Promise<ApiResponse<Shift[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      let query = supabase
        .from('shifts')
        .select('*')
        .gte('start_time', startDate);
      
      if (endDate) {
        query = query.lte('start_time', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching shifts by date:', error);
        return { error: error.message };
      }
      
      return { data: transformShifts(data) };
    } catch (error) {
      console.error('Error fetching shifts by date:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },
  
  // Create a new shift (admin only)
  createShift: async (shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Transform from frontend model to database model
      const dbShift = {
        employee_id: shiftData.employeeId,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        position: shiftData.position,
        department: shiftData.department,
        notes: shiftData.notes,
        status: shiftData.status,
        location: shiftData.location,
        requirements: shiftData.requirements
      };
      
      const { data, error } = await supabase
        .from('shifts')
        .insert([dbShift])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating shift:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShift(data), 
        message: 'Shift created successfully' 
      };
    } catch (error) {
      console.error('Error creating shift:', error);
      return { error: 'Network error when creating shift' };
    }
  },
  
  // Update a shift (admin only)
  updateShift: async (id: string, shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Transform from frontend model to database model
      const dbShift = {
        employee_id: shiftData.employeeId,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        position: shiftData.position,
        department: shiftData.department,
        notes: shiftData.notes,
        status: shiftData.status,
        location: shiftData.location,
        requirements: shiftData.requirements
      };
      
      const { data, error } = await supabase
        .from('shifts')
        .update(dbShift)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating shift:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShift(data), 
        message: 'Shift updated successfully' 
      };
    } catch (error) {
      console.error('Error updating shift:', error);
      return { error: 'Network error when updating shift' };
    }
  },
  
  // Delete a shift (admin only)
  deleteShift: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting shift:', error);
        return { error: error.message };
      }
      
      return { message: 'Shift deleted successfully' };
    } catch (error) {
      console.error('Error deleting shift:', error);
      return { error: 'Network error when deleting shift' };
    }
  },

  // Get all shift swap requests
  getShiftSwapRequests: async (): Promise<ApiResponse<ShiftChangeRequest[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('shift_change_requests')
        .select('*');
      
      if (error) {
        console.error('Error fetching shift swap requests:', error);
        return { error: error.message };
      }
      
      return { data: transformShiftChangeRequests(data) };
    } catch (error) {
      console.error('Error fetching shift swap requests:', error);
      return { error: 'Network error when fetching shift swap requests' };
    }
  },

  // Create a shift swap request
  createShiftSwapRequest: async (requestData: Partial<ShiftChangeRequest>): Promise<ApiResponse<ShiftChangeRequest>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      // Transform from frontend model to database model
      const dbRequest = {
        employee_id: requestData.employeeId,
        my_shift_id: requestData.myShiftId,
        target_shift_id: requestData.targetShiftId,
        my_shift_date: requestData.myShiftDate,
        target_shift_date: requestData.targetShiftDate,
        reason: requestData.reason,
        status: requestData.status || 'pending',
        request_date: requestData.requestDate || new Date().toISOString().split('T')[0],
        admin_notes: requestData.adminNotes
      };
      
      const { data, error } = await supabase
        .from('shift_change_requests')
        .insert([dbRequest])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating shift swap request:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShiftChangeRequest(data), 
        message: 'Shift swap request created successfully' 
      };
    } catch (error) {
      console.error('Error creating shift swap request:', error);
      return { error: 'Network error when creating shift swap request' };
    }
  },

  // Update a shift request status (admin only)
  updateShiftRequestStatus: async (
    requestId: string, 
    status: 'approved' | 'rejected'
  ): Promise<ApiResponse<any>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }

    try {
      const { data, error } = await supabase
        .from('shift_change_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating shift request:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShiftChangeRequest(data), 
        message: `Request ${status}`
      };
    } catch (error) {
      console.error('Error updating shift request:', error);
      return { error: 'Network error when updating shift request' };
    }
  },
  
  // Approve a shift (employee only)
  approveShift: async (shiftId: string): Promise<ApiResponse<Shift>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .update({ status: 'approved' })
        .eq('id', shiftId)
        .select()
        .single();
      
      if (error) {
        console.error('Error approving shift:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShift(data), 
        message: 'Shift approved successfully' 
      };
    } catch (error) {
      console.error('Error approving shift:', error);
      return { error: 'Network error when approving shift' };
    }
  },
  
  // Cancel a shift (admin only)
  cancelShift: async (shiftId: string): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .update({ status: 'cancelled' })
        .eq('id', shiftId)
        .select()
        .single();
      
      if (error) {
        console.error('Error cancelling shift:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShift(data), 
        message: 'Shift cancelled successfully' 
      };
    } catch (error) {
      console.error('Error cancelling shift:', error);
      return { error: 'Network error when cancelling shift' };
    }
  },
  
  // Assign shift to multiple employees
  assignShiftToEmployees: async (
    shiftData: Partial<Shift>, 
    employeeIds: string[]
  ): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Create shift objects for each employee
      const shifts = employeeIds.map(employeeId => ({
        employee_id: employeeId,
        start_time: shiftData.startTime,
        end_time: shiftData.endTime,
        position: shiftData.position,
        department: shiftData.department,
        notes: shiftData.notes,
        status: shiftData.status || 'scheduled',
        location: shiftData.location,
        requirements: shiftData.requirements
      }));
      
      const { data, error } = await supabase
        .from('shifts')
        .insert(shifts)
        .select();
      
      if (error) {
        console.error('Error assigning shifts:', error);
        return { error: error.message };
      }
      
      return { 
        data: transformShifts(data), 
        message: 'Shifts assigned successfully' 
      };
    } catch (error) {
      console.error('Error assigning shifts:', error);
      return { error: 'Network error when assigning shifts' };
    }
  },
  
  // Get shifts for a specific department
  getShiftsByDepartment: async (department: string): Promise<ApiResponse<Shift[]>> => {
    if (!await authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('department', department);
      
      if (error) {
        console.error('Error fetching department shifts:', error);
        return { error: error.message };
      }
      
      return { data: transformShifts(data) };
    } catch (error) {
      console.error('Error fetching department shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },

  // Assign shift to a department (admin only)
  assignShiftToDepartment: async (
    shiftData: Partial<Shift>,
    department: string
  ): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }

    try {
      // First, get all employees in the department
      const { data: employees, error: empError } = await supabase
        .from('users')
        .select('id')
        .eq('department', department);

      if (empError) {
        console.error(`Error fetching employees in department ${department}:`, empError);
        return { error: empError.message };
      }

      if (!employees || employees.length === 0) {
        return { error: 'No employees found in the specified department' };
      }

      // Get employee IDs
      const employeeIds = employees.map(emp => emp.id);

      // Use the existing method to assign shifts to these employees
      return await shiftService.assignShiftToEmployees(shiftData, employeeIds);
    } catch (error) {
      console.error(`Error assigning shifts to department ${department}:`, error);
      return { error: 'Network error when assigning shifts to department' };
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
    status: shift.status,
    location: shift.location,
    requirements: shift.requirements
  };
}

function transformShifts(shifts: any[]): Shift[] {
  return shifts.map(transformShift);
}

function transformShiftChangeRequest(request: any): ShiftChangeRequest {
  return {
    id: request.id,
    employeeId: request.employee_id,
    myShiftId: request.my_shift_id,
    targetShiftId: request.target_shift_id,
    myShiftDate: request.my_shift_date,
    targetShiftDate: request.target_shift_date,
    reason: request.reason,
    status: request.status,
    requestDate: request.request_date,
    updatedAt: request.updated_at,
    adminNotes: request.admin_notes
  };
}

function transformShiftChangeRequests(requests: any[]): ShiftChangeRequest[] {
  return requests.map(transformShiftChangeRequest);
}

// ShiftCoverRequest methods are removed as they're not used in the current schema
// If you need them, you can implement them similarly to the ShiftChangeRequest methods
