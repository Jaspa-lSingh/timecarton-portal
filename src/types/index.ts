
// User types
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employeeId?: string; // Added employee ID field
  position?: string;
  department?: string; // Added department field
  hourlyRate?: number;
  phoneNumber?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

// Shift types
export type ShiftStatus = 'scheduled' | 'completed' | 'missed' | 'pending' | 'approved' | 'cancelled';

export interface Shift {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  position?: string;
  department?: string; // Added department field
  notes?: string;
  status: ShiftStatus;
  location?: string;
  requirements?: string; // Added requirements field
}

// Shift Change/Request types
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface ShiftChangeRequest {
  id: string;
  employeeId: string;
  myShiftId: string;
  targetShiftId: string;
  myShiftDate: string;
  targetShiftDate: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface ShiftCoverRequest {
  id: string;
  employeeId: string;
  shiftId: string;
  shiftDate: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
  updatedAt: string;
  adminNotes?: string;
}

// Inquiry and Leave Request types
export interface Inquiry {
  id: string;
  employeeId: string;
  subject: string;
  message: string;
  status: RequestStatus | 'replied';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: RequestStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  createdBy: string;
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
  punchInPhoto?: string; // Photo taken at punch-in
  punchOutPhoto?: string; // Photo taken at punch-out
  punchInLocation?: { // Location at punch-in
    lat: number;
    lng: number;
    address?: string;
  };
  punchOutLocation?: { // Location at punch-out
    lat: number;
    lng: number;
    address?: string;
  };
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
