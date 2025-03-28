
import { Shift, ApiResponse } from '@/types';
import { authService } from './authService';

// Mock shifts data
const mockShifts: Shift[] = [
  {
    id: '1',
    employeeId: '2',
    startTime: '2023-06-12T09:00:00',
    endTime: '2023-06-12T17:00:00',
    position: 'Barista',
    status: 'completed',
    location: 'Main Store'
  },
  {
    id: '2',
    employeeId: '3',
    startTime: '2023-06-12T08:00:00',
    endTime: '2023-06-12T16:00:00',
    position: 'Barista',
    status: 'completed',
    location: 'Main Store'
  },
  {
    id: '3',
    employeeId: '4',
    startTime: '2023-06-12T16:00:00',
    endTime: '2023-06-13T00:00:00',
    position: 'Server',
    status: 'completed',
    location: 'Main Store'
  },
  {
    id: '4',
    employeeId: '5',
    startTime: '2023-06-12T11:00:00',
    endTime: '2023-06-12T19:00:00',
    position: 'Cook',
    status: 'completed',
    location: 'Main Store'
  },
  {
    id: '5',
    employeeId: '2',
    startTime: '2023-06-13T09:00:00',
    endTime: '2023-06-13T17:00:00',
    position: 'Barista',
    status: 'scheduled',
    location: 'Main Store'
  },
  {
    id: '6',
    employeeId: '3',
    startTime: '2023-06-13T08:00:00',
    endTime: '2023-06-13T16:00:00',
    position: 'Barista',
    status: 'scheduled',
    location: 'Main Store'
  },
  {
    id: '7',
    employeeId: '4',
    startTime: '2023-06-13T16:00:00',
    endTime: '2023-06-14T00:00:00',
    position: 'Server',
    status: 'pending',
    location: 'Main Store'
  },
  {
    id: '8',
    employeeId: '5',
    startTime: '2023-06-13T11:00:00',
    endTime: '2023-06-13T19:00:00',
    position: 'Cook',
    status: 'pending',
    location: 'Main Store'
  }
];

// Function to get current date in format YYYY-MM-DD
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Shift service
export const shiftService = {
  // Get all shifts
  getAllShifts: async (): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authService.getCurrentUser();
      
      if (user?.role === 'admin') {
        // Admins can see all shifts
        return { data: mockShifts };
      } else {
        // Employees can see only their shifts
        const employeeShifts = mockShifts.filter(shift => shift.employeeId === user?.id);
        return { data: employeeShifts };
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      return { error: 'Failed to fetch shifts' };
    }
  },
  
  // Get shifts for a specific employee
  getEmployeeShifts: async (employeeId: string): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = authService.getCurrentUser();
      
      // Admins can see any employee's shifts
      // Employees can only see their own shifts
      if (user?.role === 'admin' || user?.id === employeeId) {
        const employeeShifts = mockShifts.filter(shift => shift.employeeId === employeeId);
        return { data: employeeShifts };
      }
      
      return { error: 'Not authorized to view these shifts' };
    } catch (error) {
      console.error('Error fetching employee shifts:', error);
      return { error: 'Failed to fetch shifts' };
    }
  },
  
  // Get shifts for a specific date or date range
  getShiftsByDate: async (startDate: string, endDate?: string): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = authService.getCurrentUser();
      let filteredShifts = [...mockShifts];
      
      // Filter by date range
      if (startDate && endDate) {
        filteredShifts = filteredShifts.filter(shift => {
          const shiftDate = shift.startTime.split('T')[0];
          return shiftDate >= startDate && shiftDate <= endDate;
        });
      } else if (startDate) {
        // Filter by single date
        filteredShifts = filteredShifts.filter(shift => {
          const shiftDate = shift.startTime.split('T')[0];
          return shiftDate === startDate;
        });
      }
      
      // Filter by user role
      if (user?.role !== 'admin') {
        filteredShifts = filteredShifts.filter(shift => shift.employeeId === user?.id);
      }
      
      return { data: filteredShifts };
    } catch (error) {
      console.error('Error fetching shifts by date:', error);
      return { error: 'Failed to fetch shifts' };
    }
  },
  
  // Create a new shift (admin only)
  createShift: async (shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      const newShift: Shift = {
        id: Date.now().toString(),
        employeeId: shiftData.employeeId || '',
        startTime: shiftData.startTime || '',
        endTime: shiftData.endTime || '',
        position: shiftData.position,
        notes: shiftData.notes,
        status: shiftData.status || 'scheduled',
        location: shiftData.location
      };
      
      return { data: newShift, message: 'Shift created successfully' };
    } catch (error) {
      console.error('Error creating shift:', error);
      return { error: 'Failed to create shift' };
    }
  },
  
  // Update a shift (admin only)
  updateShift: async (id: string, shiftData: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the shift to update
      const existingShift = mockShifts.find(shift => shift.id === id);
      
      if (!existingShift) {
        return { error: 'Shift not found' };
      }
      
      // Mock response
      const updatedShift: Shift = {
        ...existingShift,
        ...shiftData,
        id
      };
      
      return { data: updatedShift, message: 'Shift updated successfully' };
    } catch (error) {
      console.error('Error updating shift:', error);
      return { error: 'Failed to update shift' };
    }
  },
  
  // Delete a shift (admin only)
  deleteShift: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if shift exists
      const shift = mockShifts.find(s => s.id === id);
      
      if (!shift) {
        return { error: 'Shift not found' };
      }
      
      // Mock response
      return { message: 'Shift deleted successfully' };
    } catch (error) {
      console.error('Error deleting shift:', error);
      return { error: 'Failed to delete shift' };
    }
  }
};
