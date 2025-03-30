
import { Shift, ApiResponse, ShiftChangeRequest, ShiftCoverRequest } from '@/types';
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

// Mock shift swap requests
const mockShiftSwapRequests: ShiftChangeRequest[] = [
  {
    id: '1',
    employeeId: '2',
    myShiftId: '5',
    targetShiftId: '7',
    myShiftDate: '2024-06-15T09:00:00',
    targetShiftDate: '2024-06-16T09:00:00',
    reason: 'Family event',
    status: 'pending',
    requestDate: '2024-06-10T14:30:00',
    updatedAt: '2024-06-10T14:30:00'
  },
  {
    id: '2',
    employeeId: '3',
    myShiftId: '6',
    targetShiftId: '8',
    myShiftDate: '2024-07-02T10:00:00',
    targetShiftDate: '2024-07-03T10:00:00',
    reason: 'Medical appointment',
    status: 'approved',
    requestDate: '2024-06-08T11:20:00',
    updatedAt: '2024-06-09T09:15:00'
  }
];

// Mock shift cover requests
const mockShiftCoverRequests: ShiftCoverRequest[] = [
  {
    id: '1',
    employeeId: '2',
    shiftId: '5',
    shiftDate: '2024-06-20T14:00:00',
    reason: 'Personal emergency',
    status: 'pending',
    requestDate: '2024-06-15T10:30:00',
    updatedAt: '2024-06-15T10:30:00'
  },
  {
    id: '2',
    employeeId: '3',
    shiftId: '6',
    shiftDate: '2024-06-22T08:00:00',
    reason: 'Doctor appointment',
    status: 'pending',
    requestDate: '2024-06-16T09:45:00',
    updatedAt: '2024-06-16T09:45:00'
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
  },

  // Get all shift swap requests
  getShiftSwapRequests: async (): Promise<ApiResponse<ShiftChangeRequest[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = authService.getCurrentUser();

      if (user?.role === 'admin') {
        // Admins can see all swap requests
        return { data: mockShiftSwapRequests };
      } else {
        // Employees can see only their swap requests
        const employeeRequests = mockShiftSwapRequests.filter(req => req.employeeId === user?.id);
        return { data: employeeRequests };
      }
    } catch (error) {
      console.error('Error fetching shift swap requests:', error);
      return { error: 'Failed to fetch shift swap requests' };
    }
  },

  // Get all shift cover requests
  getShiftCoverRequests: async (): Promise<ApiResponse<ShiftCoverRequest[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = authService.getCurrentUser();

      if (user?.role === 'admin') {
        // Admins can see all cover requests
        return { data: mockShiftCoverRequests };
      } else {
        // Employees can see only their cover requests
        const employeeRequests = mockShiftCoverRequests.filter(req => req.employeeId === user?.id);
        return { data: employeeRequests };
      }
    } catch (error) {
      console.error('Error fetching shift cover requests:', error);
      return { error: 'Failed to fetch shift cover requests' };
    }
  },

  // Create a shift swap request
  createShiftSwapRequest: async (requestData: Partial<ShiftChangeRequest>): Promise<ApiResponse<ShiftChangeRequest>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = authService.getCurrentUser();

      // Mock response
      const newRequest: ShiftChangeRequest = {
        id: Date.now().toString(),
        employeeId: user?.id || '',
        myShiftId: requestData.myShiftId || '',
        targetShiftId: requestData.targetShiftId || '',
        myShiftDate: requestData.myShiftDate || '',
        targetShiftDate: requestData.targetShiftDate || '',
        reason: requestData.reason || '',
        status: 'pending',
        requestDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { data: newRequest, message: 'Shift swap request created successfully' };
    } catch (error) {
      console.error('Error creating shift swap request:', error);
      return { error: 'Failed to create shift swap request' };
    }
  },

  // Create a shift cover request
  createShiftCoverRequest: async (requestData: Partial<ShiftCoverRequest>): Promise<ApiResponse<ShiftCoverRequest>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = authService.getCurrentUser();

      // Mock response
      const newRequest: ShiftCoverRequest = {
        id: Date.now().toString(),
        employeeId: user?.id || '',
        shiftId: requestData.shiftId || '',
        shiftDate: requestData.shiftDate || '',
        reason: requestData.reason || '',
        status: 'pending',
        requestDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return { data: newRequest, message: 'Shift cover request created successfully' };
    } catch (error) {
      console.error('Error creating shift cover request:', error);
      return { error: 'Failed to create shift cover request' };
    }
  },

  // Update a shift request status (admin only)
  updateShiftRequestStatus: async (
    requestId: string, 
    status: 'approved' | 'rejected', 
    type: 'swap' | 'cover'
  ): Promise<ApiResponse<any>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));

      // Find the request to update
      const requestsArray = type === 'swap' ? mockShiftSwapRequests : mockShiftCoverRequests;
      const existingRequest = requestsArray.find(req => req.id === requestId);

      if (!existingRequest) {
        return { error: 'Request not found' };
      }

      // Update request
      existingRequest.status = status;
      existingRequest.updatedAt = new Date().toISOString();

      return { 
        data: existingRequest, 
        message: `Request ${status}`
      };
    } catch (error) {
      console.error('Error updating shift request:', error);
      return { error: 'Failed to update shift request' };
    }
  }
};
