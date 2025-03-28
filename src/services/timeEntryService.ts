
import { TimeEntry, ApiResponse } from '@/types';
import { authService } from './authService';

// Mock time entries data
const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: '2',
    shiftId: '1',
    clockIn: '2023-06-12T09:02:33',
    clockOut: '2023-06-12T17:05:12',
    totalHours: 8.04,
    approved: true,
    notes: 'Regular shift',
  },
  {
    id: '2',
    employeeId: '3',
    shiftId: '2',
    clockIn: '2023-06-12T07:58:44',
    clockOut: '2023-06-12T16:10:05',
    totalHours: 8.19,
    approved: true,
    notes: '',
  },
  {
    id: '3',
    employeeId: '4',
    shiftId: '3',
    clockIn: '2023-06-12T16:01:22',
    clockOut: '2023-06-13T00:08:51',
    totalHours: 8.13,
    approved: true,
    notes: 'Night shift',
  },
  {
    id: '4',
    employeeId: '5',
    shiftId: '4',
    clockIn: '2023-06-12T10:55:18',
    clockOut: '2023-06-12T19:03:25',
    totalHours: 8.14,
    approved: true,
    notes: '',
  },
  {
    id: '5',
    employeeId: '2',
    shiftId: '5',
    clockIn: '2023-06-13T08:57:40',
    clockOut: '2023-06-13T17:10:22',
    totalHours: 8.21,
    approved: false,
    notes: 'Missed lunch break',
  },
  {
    id: '6',
    employeeId: '3',
    shiftId: '6',
    clockIn: '2023-06-13T08:01:15',
    clockOut: '2023-06-13T16:00:02',
    totalHours: 7.98,
    approved: false,
    notes: '',
  },
  {
    id: '7',
    employeeId: '2',
    clockIn: '2023-06-14T09:00:33',
    approved: false,
    notes: 'Currently working',
  },
];

// Time entry service
export const timeEntryService = {
  // Get all time entries
  getAllTimeEntries: async (): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authService.getCurrentUser();
      
      if (user?.role === 'admin') {
        // Admins can see all time entries
        return { data: mockTimeEntries };
      } else {
        // Employees can only see their time entries
        const employeeEntries = mockTimeEntries.filter(entry => entry.employeeId === user?.id);
        return { data: employeeEntries };
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
      return { error: 'Failed to fetch time entries' };
    }
  },
  
  // Get time entries for a specific employee
  getEmployeeTimeEntries: async (employeeId: string): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    const user = authService.getCurrentUser();
    
    // Employees can only view their own time entries
    if (user?.role === 'employee' && user.id !== employeeId) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const entries = mockTimeEntries.filter(entry => entry.employeeId === employeeId);
      return { data: entries };
    } catch (error) {
      console.error('Error fetching employee time entries:', error);
      return { error: 'Failed to fetch time entries' };
    }
  },
  
  // Get time entries for a specific date or date range
  getTimeEntriesByDate: async (startDate: string, endDate?: string): Promise<ApiResponse<TimeEntry[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const user = authService.getCurrentUser();
      let filteredEntries = [...mockTimeEntries];
      
      // Filter by date range
      if (startDate && endDate) {
        filteredEntries = filteredEntries.filter(entry => {
          const entryDate = entry.clockIn.split('T')[0];
          return entryDate >= startDate && entryDate <= endDate;
        });
      } else if (startDate) {
        // Filter by single date
        filteredEntries = filteredEntries.filter(entry => {
          const entryDate = entry.clockIn.split('T')[0];
          return entryDate === startDate;
        });
      }
      
      // Filter by user role
      if (user?.role !== 'admin') {
        filteredEntries = filteredEntries.filter(entry => entry.employeeId === user?.id);
      }
      
      return { data: filteredEntries };
    } catch (error) {
      console.error('Error fetching time entries by date:', error);
      return { error: 'Failed to fetch time entries' };
    }
  },
  
  // Clock in
  clockIn: async (employeeId: string, notes?: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if already clocked in
      const currentUser = authService.getCurrentUser();
      
      if (currentUser?.role === 'employee' && currentUser.id !== employeeId) {
        return { error: 'Not authorized' };
      }
      
      const alreadyClockedIn = mockTimeEntries.some(entry => 
        entry.employeeId === employeeId && !entry.clockOut
      );
      
      if (alreadyClockedIn) {
        return { error: 'Already clocked in' };
      }
      
      // Create new time entry
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        employeeId,
        clockIn: new Date().toISOString(),
        approved: false,
        notes: notes || '',
      };
      
      return { data: newEntry, message: 'Clocked in successfully' };
    } catch (error) {
      console.error('Error clocking in:', error);
      return { error: 'Failed to clock in' };
    }
  },
  
  // Clock out
  clockOut: async (timeEntryId: string, notes?: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if time entry exists
      const timeEntry = mockTimeEntries.find(entry => entry.id === timeEntryId);
      
      if (!timeEntry) {
        return { error: 'Time entry not found' };
      }
      
      const currentUser = authService.getCurrentUser();
      
      if (currentUser?.role === 'employee' && currentUser.id !== timeEntry.employeeId) {
        return { error: 'Not authorized' };
      }
      
      if (timeEntry.clockOut) {
        return { error: 'Already clocked out' };
      }
      
      const clockOutTime = new Date().toISOString();
      const clockInTime = new Date(timeEntry.clockIn).getTime();
      const clockOutTimeMs = new Date(clockOutTime).getTime();
      const totalHours = (clockOutTimeMs - clockInTime) / (1000 * 60 * 60);
      
      // Update time entry
      const updatedEntry: TimeEntry = {
        ...timeEntry,
        clockOut: clockOutTime,
        totalHours: parseFloat(totalHours.toFixed(2)),
        notes: notes ? timeEntry.notes + ' ' + notes : timeEntry.notes,
      };
      
      return { data: updatedEntry, message: 'Clocked out successfully' };
    } catch (error) {
      console.error('Error clocking out:', error);
      return { error: 'Failed to clock out' };
    }
  },
  
  // Approve time entry (admin only)
  approveTimeEntry: async (timeEntryId: string): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if time entry exists
      const timeEntry = mockTimeEntries.find(entry => entry.id === timeEntryId);
      
      if (!timeEntry) {
        return { error: 'Time entry not found' };
      }
      
      // Update time entry
      const updatedEntry: TimeEntry = {
        ...timeEntry,
        approved: true,
      };
      
      return { data: updatedEntry, message: 'Time entry approved successfully' };
    } catch (error) {
      console.error('Error approving time entry:', error);
      return { error: 'Failed to approve time entry' };
    }
  },
  
  // Add manual time entry (admin only)
  addManualTimeEntry: async (entryData: Partial<TimeEntry>): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Validate required fields
      if (!entryData.employeeId || !entryData.clockIn) {
        return { error: 'Employee ID and clock in time are required' };
      }
      
      let totalHours = 0;
      
      if (entryData.clockOut) {
        const clockInTime = new Date(entryData.clockIn).getTime();
        const clockOutTime = new Date(entryData.clockOut).getTime();
        totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
      }
      
      // Create new time entry
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        employeeId: entryData.employeeId,
        shiftId: entryData.shiftId,
        clockIn: entryData.clockIn,
        clockOut: entryData.clockOut,
        totalHours: entryData.clockOut ? parseFloat(totalHours.toFixed(2)) : undefined,
        approved: entryData.approved || false,
        notes: entryData.notes || '',
      };
      
      return { data: newEntry, message: 'Time entry added successfully' };
    } catch (error) {
      console.error('Error adding time entry:', error);
      return { error: 'Failed to add time entry' };
    }
  },
  
  // Edit time entry (admin only)
  editTimeEntry: async (id: string, entryData: Partial<TimeEntry>): Promise<ApiResponse<TimeEntry>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if time entry exists
      const timeEntry = mockTimeEntries.find(entry => entry.id === id);
      
      if (!timeEntry) {
        return { error: 'Time entry not found' };
      }
      
      let totalHours = timeEntry.totalHours;
      
      // Recalculate total hours if clock times changed
      if ((entryData.clockIn || entryData.clockOut) && entryData.clockIn && entryData.clockOut) {
        const clockInTime = new Date(entryData.clockIn).getTime();
        const clockOutTime = new Date(entryData.clockOut).getTime();
        totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
      }
      
      // Update time entry
      const updatedEntry: TimeEntry = {
        ...timeEntry,
        ...entryData,
        totalHours: entryData.clockIn && entryData.clockOut ? parseFloat(totalHours.toFixed(2)) : timeEntry.totalHours,
      };
      
      return { data: updatedEntry, message: 'Time entry updated successfully' };
    } catch (error) {
      console.error('Error updating time entry:', error);
      return { error: 'Failed to update time entry' };
    }
  },
  
  // Delete time entry (admin only)
  deleteTimeEntry: async (id: string): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if time entry exists
      const timeEntry = mockTimeEntries.find(entry => entry.id === id);
      
      if (!timeEntry) {
        return { error: 'Time entry not found' };
      }
      
      return { message: 'Time entry deleted successfully' };
    } catch (error) {
      console.error('Error deleting time entry:', error);
      return { error: 'Failed to delete time entry' };
    }
  },
  
  // Get current clock status
  getCurrentClockStatus: async (employeeId: string): Promise<ApiResponse<{ isClocked: boolean; currentEntry?: TimeEntry }>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentUser = authService.getCurrentUser();
      
      if (currentUser?.role === 'employee' && currentUser.id !== employeeId) {
        return { error: 'Not authorized' };
      }
      
      // Check if currently clocked in
      const currentEntry = mockTimeEntries.find(entry => 
        entry.employeeId === employeeId && !entry.clockOut
      );
      
      return { 
        data: { 
          isClocked: !!currentEntry,
          currentEntry
        } 
      };
    } catch (error) {
      console.error('Error getting clock status:', error);
      return { error: 'Failed to get clock status' };
    }
  }
};
