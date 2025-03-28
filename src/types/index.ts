
// User types
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position?: string;
  hourlyRate?: number;
  phoneNumber?: string;
  avatar?: string;
}

// Shift types
export type ShiftStatus = 'scheduled' | 'completed' | 'missed' | 'pending';

export interface Shift {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  position?: string;
  notes?: string;
  status: ShiftStatus;
  location?: string;
}

// Timesheet types
export interface TimeEntry {
  id: string;
  employeeId: string;
  shiftId?: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  approved: boolean;
  notes?: string;
}

// Payroll types
export interface PayPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'processing' | 'completed';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  payPeriodId: string;
  regularHours: number;
  overtimeHours: number;
  grossPay: number;
  netPay: number;
  deductions: number;
  status: 'pending' | 'approved' | 'paid';
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
