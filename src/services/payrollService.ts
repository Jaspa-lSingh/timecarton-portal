import { PayPeriod, PayrollRecord, ApiResponse } from '@/types';
import { authService } from '@/services';

// Mock pay periods
const mockPayPeriods: PayPeriod[] = [
  {
    id: '1',
    startDate: '2023-06-01',
    endDate: '2023-06-15',
    status: 'completed'
  },
  {
    id: '2',
    startDate: '2023-06-16',
    endDate: '2023-06-30',
    status: 'completed'
  },
  {
    id: '3',
    startDate: '2023-07-01',
    endDate: '2023-07-15',
    status: 'processing'
  },
  {
    id: '4',
    startDate: '2023-07-16',
    endDate: '2023-07-31',
    status: 'pending'
  }
];

// Mock payroll records
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '2',
    payPeriodId: '1',
    regularHours: 75,
    overtimeHours: 5,
    grossPay: 1243.75,
    deductions: 311.25,
    netPay: 932.50,
    status: 'paid'
  },
  {
    id: '2',
    employeeId: '3',
    payPeriodId: '1',
    regularHours: 80,
    overtimeHours: 0,
    grossPay: 1240.00,
    deductions: 310.00,
    netPay: 930.00,
    status: 'paid'
  },
  {
    id: '3',
    employeeId: '4',
    payPeriodId: '1',
    regularHours: 72,
    overtimeHours: 8,
    grossPay: 1224.00,
    deductions: 306.00,
    netPay: 918.00,
    status: 'paid'
  },
  {
    id: '4',
    employeeId: '5',
    payPeriodId: '1',
    regularHours: 78,
    overtimeHours: 2,
    grossPay: 1394.25,
    deductions: 348.56,
    netPay: 1045.69,
    status: 'paid'
  },
  {
    id: '5',
    employeeId: '2',
    payPeriodId: '2',
    regularHours: 80,
    overtimeHours: 8,
    grossPay: 1364.00,
    deductions: 341.00,
    netPay: 1023.00,
    status: 'paid'
  },
  {
    id: '6',
    employeeId: '3',
    payPeriodId: '2',
    regularHours: 80,
    overtimeHours: 0,
    grossPay: 1240.00,
    deductions: 310.00,
    netPay: 930.00,
    status: 'paid'
  },
  {
    id: '7',
    employeeId: '2',
    payPeriodId: '3',
    regularHours: 72,
    overtimeHours: 0,
    grossPay: 1116.00,
    deductions: 279.00,
    netPay: 837.00,
    status: 'approved'
  },
  {
    id: '8',
    employeeId: '3',
    payPeriodId: '3',
    regularHours: 80,
    overtimeHours: 4,
    grossPay: 1302.00,
    deductions: 325.50,
    netPay: 976.50,
    status: 'approved'
  }
];

// Payroll service
export const payrollService = {
  // Get all pay periods
  getPayPeriods: async (): Promise<ApiResponse<PayPeriod[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { data: mockPayPeriods };
    } catch (error) {
      console.error('Error fetching pay periods:', error);
      return { error: 'Failed to fetch pay periods' };
    }
  },
  
  // Get payroll records by pay period
  getPayrollByPeriod: async (periodId: string): Promise<ApiResponse<PayrollRecord[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authService.getCurrentUser();
      let records = mockPayrollRecords.filter(record => record.payPeriodId === periodId);
      
      // If employee, only show their records
      if (user?.role === 'employee') {
        records = records.filter(record => record.employeeId === user.id);
      }
      
      return { data: records };
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      return { error: 'Failed to fetch payroll records' };
    }
  },
  
  // Get payroll records for an employee
  getEmployeePayroll: async (employeeId: string): Promise<ApiResponse<PayrollRecord[]>> => {
    if (!authService.isAuthenticated()) {
      return { error: 'Not authenticated' };
    }
    
    const user = authService.getCurrentUser();
    
    // Employees can only view their own payroll
    if (user?.role === 'employee' && user.id !== employeeId) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = mockPayrollRecords.filter(record => record.employeeId === employeeId);
      return { data: records };
    } catch (error) {
      console.error('Error fetching employee payroll:', error);
      return { error: 'Failed to fetch payroll records' };
    }
  },
  
  // Create a new pay period (admin only)
  createPayPeriod: async (payPeriodData: Partial<PayPeriod>): Promise<ApiResponse<PayPeriod>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      const newPayPeriod: PayPeriod = {
        id: Date.now().toString(),
        startDate: payPeriodData.startDate || '',
        endDate: payPeriodData.endDate || '',
        status: payPeriodData.status || 'pending'
      };
      
      return { data: newPayPeriod, message: 'Pay period created successfully' };
    } catch (error) {
      console.error('Error creating pay period:', error);
      return { error: 'Failed to create pay period' };
    }
  },
  
  // Process payroll for a pay period (admin only)
  processPayroll: async (periodId: string): Promise<ApiResponse<PayrollRecord[]>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock response
      return { message: 'Payroll processing has been initiated' };
    } catch (error) {
      console.error('Error processing payroll:', error);
      return { error: 'Failed to process payroll' };
    }
  },
  
  // Approve payroll records (admin only)
  approvePayroll: async (recordIds: string[]): Promise<ApiResponse<void>> => {
    if (!authService.isAdmin()) {
      return { error: 'Not authorized' };
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return { message: 'Payroll records approved successfully' };
    } catch (error) {
      console.error('Error approving payroll:', error);
      return { error: 'Failed to approve payroll records' };
    }
  }
};
