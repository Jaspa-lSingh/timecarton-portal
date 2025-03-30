
import { Shift, ApiResponse, ShiftChangeRequest, ShiftCoverRequest } from '@/types';
import { authService } from './authService';

// Base API URL - use the same as other services
const API_URL = import.meta.env.VITE_API_URL || 'https://api.shiftmaster.com/api';

// Shift service
export const shiftService = {
  // Get all shifts
  getAllShifts: async (): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts };
    } catch (error) {
      console.error('Error fetching shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },
  
  // Get shifts for a specific employee
  getEmployeeShifts: async (employeeId: string): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/employee/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch employee shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts };
    } catch (error) {
      console.error('Error fetching employee shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  },
  
  // Get shifts for a specific date or date range
  getShiftsByDate: async (startDate: string, endDate?: string): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      let url = `${API_URL}/shifts/date/${startDate}`;
      
      if (endDate) {
        url += `?endDate=${endDate}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shiftData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to create shift' };
      }
      
      const data = await response.json();
      return { data: data.shift, message: 'Shift created successfully' };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shiftData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to update shift' };
      }
      
      const data = await response.json();
      return { data: data.shift, message: 'Shift updated successfully' };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to delete shift' };
      }
      
      return { message: 'Shift deleted successfully' };
    } catch (error) {
      console.error('Error deleting shift:', error);
      return { error: 'Network error when deleting shift' };
    }
  },

  // Get all shift swap requests
  getShiftSwapRequests: async (): Promise<ApiResponse<ShiftChangeRequest[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/swap-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch shift swap requests' };
      }
      
      const data = await response.json();
      return { data: data.requests };
    } catch (error) {
      console.error('Error fetching shift swap requests:', error);
      return { error: 'Network error when fetching shift swap requests' };
    }
  },

  // Get all shift cover requests
  getShiftCoverRequests: async (): Promise<ApiResponse<ShiftCoverRequest[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/cover-requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch shift cover requests' };
      }
      
      const data = await response.json();
      return { data: data.requests };
    } catch (error) {
      console.error('Error fetching shift cover requests:', error);
      return { error: 'Network error when fetching shift cover requests' };
    }
  },

  // Create a shift swap request
  createShiftSwapRequest: async (requestData: Partial<ShiftChangeRequest>): Promise<ApiResponse<ShiftChangeRequest>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/swap-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to create shift swap request' };
      }
      
      const data = await response.json();
      return { data: data.request, message: 'Shift swap request created successfully' };
    } catch (error) {
      console.error('Error creating shift swap request:', error);
      return { error: 'Network error when creating shift swap request' };
    }
  },

  // Create a shift cover request
  createShiftCoverRequest: async (requestData: Partial<ShiftCoverRequest>): Promise<ApiResponse<ShiftCoverRequest>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }

    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/cover-requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to create shift cover request' };
      }
      
      const data = await response.json();
      return { data: data.request, message: 'Shift cover request created successfully' };
    } catch (error) {
      console.error('Error creating shift cover request:', error);
      return { error: 'Network error when creating shift cover request' };
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
      const token = authService.getToken();
      const endpoint = type === 'swap' ? 'swap-requests' : 'cover-requests';
      
      const response = await fetch(`${API_URL}/shifts/${endpoint}/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to update shift request' };
      }
      
      const data = await response.json();
      return { 
        data: data.request, 
        message: `Request ${status}`
      };
    } catch (error) {
      console.error('Error updating shift request:', error);
      return { error: 'Network error when updating shift request' };
    }
  },
  
  // Approve a shift (employee only)
  approveShift: async (shiftId: string): Promise<ApiResponse<Shift>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/${shiftId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to approve shift' };
      }
      
      const data = await response.json();
      return { data: data.shift, message: 'Shift approved successfully' };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/${shiftId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to cancel shift' };
      }
      
      const data = await response.json();
      return { data: data.shift, message: 'Shift cancelled successfully' };
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
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/bulk-assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shiftData,
          employeeIds
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to assign shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts, message: 'Shifts assigned successfully' };
    } catch (error) {
      console.error('Error assigning shifts:', error);
      return { error: 'Network error when assigning shifts' };
    }
  },
  
  // Assign shift to all employees in a department
  assignShiftToDepartment: async (
    shiftData: Partial<Shift>, 
    department: string
  ): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/department-assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shiftData,
          department
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to assign department shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts, message: `Shifts assigned to ${department} department` };
    } catch (error) {
      console.error('Error assigning department shifts:', error);
      return { error: 'Network error when assigning shifts' };
    }
  },
  
  // Get shifts for a specific department
  getShiftsByDepartment: async (department: string): Promise<ApiResponse<Shift[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/shifts/department/${department}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch department shifts' };
      }
      
      const data = await response.json();
      return { data: data.shifts };
    } catch (error) {
      console.error('Error fetching department shifts:', error);
      return { error: 'Network error when fetching shifts' };
    }
  }
};
