
import { TimeEntry, ApiResponse } from '@/types';
import { authService } from './authService';

// Base API URL - replace with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://api.shiftmaster.com/api';

// Time entry service with real API endpoints
export const timeEntryService = {
  // Get all time entries
  getAllTimeEntries: async (): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch time entries' };
      }
      
      const data = await response.json();
      return { data: data.timeEntries };
    } catch (error) {
      console.error('Error fetching time entries:', error);
      return { error: 'Network error when fetching time entries' };
    }
  },
  
  // Get time entries for a specific employee
  getEmployeeTimeEntries: async (employeeId: string): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries/employee/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch employee time entries' };
      }
      
      const data = await response.json();
      return { data: data.timeEntries };
    } catch (error) {
      console.error('Error fetching employee time entries:', error);
      return { error: 'Network error when fetching time entries' };
    }
  },
  
  // Get time entries for a specific date or date range
  getTimeEntriesByDate: async (startDate: string, endDate?: string): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      let url = `${API_URL}/time-entries/date/${startDate}`;
      
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
        return { error: errorData.message || 'Failed to fetch time entries' };
      }
      
      const data = await response.json();
      return { data: data.timeEntries };
    } catch (error) {
      console.error('Error fetching time entries by date:', error);
      return { error: 'Network error when fetching time entries' };
    }
  },
  
  // Clock in with facial recognition
  clockIn: async (employeeId: string, photoData: string, location: { lat: number, lng: number }, notes?: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/attendance/punch-in`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId,
          photoData, // Base64 encoded image data
          location,
          timestamp: new Date().toISOString(),
          notes
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to clock in' };
      }
      
      const data = await response.json();
      return { data: data.timeEntry, message: 'Clocked in successfully' };
    } catch (error) {
      console.error('Error clocking in:', error);
      return { error: 'Network error when clocking in' };
    }
  },
  
  // Clock out with facial recognition
  clockOut: async (timeEntryId: string, photoData: string, location: { lat: number, lng: number }, notes?: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/attendance/punch-out`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeEntryId,
          photoData, // Base64 encoded image data
          location,
          timestamp: new Date().toISOString(),
          notes
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to clock out' };
      }
      
      const data = await response.json();
      return { data: data.timeEntry, message: 'Clocked out successfully' };
    } catch (error) {
      console.error('Error clocking out:', error);
      return { error: 'Network error when clocking out' };
    }
  },
  
  // Approve time entry (admin only)
  approveTimeEntry: async (timeEntryId: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries/${timeEntryId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to approve time entry' };
      }
      
      const data = await response.json();
      return { data: data.timeEntry, message: 'Time entry approved successfully' };
    } catch (error) {
      console.error('Error approving time entry:', error);
      return { error: 'Network error when approving time entry' };
    }
  },
  
  // Add manual time entry (admin only)
  addManualTimeEntry: async (entryData: Partial<TimeEntry>): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to add time entry' };
      }
      
      const data = await response.json();
      return { data: data.timeEntry, message: 'Time entry added successfully' };
    } catch (error) {
      console.error('Error adding time entry:', error);
      return { error: 'Network error when adding time entry' };
    }
  },
  
  // Edit time entry (admin only)
  editTimeEntry: async (id: string, entryData: Partial<TimeEntry>): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(entryData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to update time entry' };
      }
      
      const data = await response.json();
      return { data: data.timeEntry, message: 'Time entry updated successfully' };
    } catch (error) {
      console.error('Error updating time entry:', error);
      return { error: 'Network error when updating time entry' };
    }
  },
  
  // Delete time entry (admin only)
  deleteTimeEntry: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to delete time entry' };
      }
      
      return { message: 'Time entry deleted successfully' };
    } catch (error) {
      console.error('Error deleting time entry:', error);
      return { error: 'Network error when deleting time entry' };
    }
  },
  
  // Get current clock status
  getCurrentClockStatus: async (employeeId: string): Promise<ApiResponse<{ isClocked: boolean; currentEntry?: TimeEntry }>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/time-entries/status/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to get clock status' };
      }
      
      const data = await response.json();
      return { data: data };
    } catch (error) {
      console.error('Error getting clock status:', error);
      return { error: 'Network error when getting clock status' };
    }
  },
  
  // Get attendance data for employee
  getAttendanceData: async (employeeId: string, period: 'day'|'week'|'month'|'year'): Promise<ApiResponse<any>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_URL}/attendance/${employeeId}?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Failed to fetch attendance data' };
      }
      
      const data = await response.json();
      return { data: data };
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      return { error: 'Network error when fetching attendance data' };
    }
  }
};
