
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { payrollService } from '@/services/payrollService';
import { authService } from '@/services/authService';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayPeriod, PayrollRecord } from '@/types';
import { 
  Download, 
  DollarSign, 
  Calendar,
  FileText,
  Loader2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EmployeePayroll: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>('');

  // Fetch pay periods
  const { 
    data: payPeriods = [], 
    isLoading: isLoadingPeriods 
  } = useQuery({
    queryKey: ['employeePayPeriods'],
    queryFn: async () => {
      const response = await payrollService.getPayPeriods();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Fetch payroll records for current user
  const { 
    data: payrollRecords = [],
    isLoading: isLoadingRecords
  } = useQuery({
    queryKey: ['employeePayroll', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      
      const response = await payrollService.getEmployeePayroll(currentUser.id);
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: !!currentUser?.id,
  });

  // Fetch payroll records by period for the employee
  const { 
    data: periodPayrollRecords = [],
    isLoading: isLoadingPeriodRecords
  } = useQuery({
    queryKey: ['employeePeriodPayroll', currentUser?.id, selectedPayPeriod],
    queryFn: async () => {
      if (!currentUser?.id || !selectedPayPeriod) return [];
      
      const response = await payrollService.getPayrollByPeriod(selectedPayPeriod);
      if (response.error) throw new Error(response.error);
      
      // Filter for current employee
      return (response.data || []).filter(record => record.employeeId === currentUser.id);
    },
    enabled: !!currentUser?.id && !!selectedPayPeriod,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get pay period by ID
  const getPayPeriodById = (periodId: string): PayPeriod | undefined => {
    return payPeriods.find(period => period.id === periodId);
  };

  // Calculate total earnings for all time
  const calculateTotalEarnings = () => {
    return payrollRecords
      .filter(record => record.status === 'paid')
      .reduce((total, record) => total + record.netPay, 0);
  };

  // Calculate YTD (Year to Date) earnings
  const calculateYTDEarnings = () => {
    const currentYear = new Date().getFullYear();
    
    return payrollRecords
      .filter(record => {
        const payPeriod = getPayPeriodById(record.payPeriodId);
        if (!payPeriod) return false;
        
        const periodYear = new Date(payPeriod.startDate).getFullYear();
        return periodYear === currentYear && record.status === 'paid';
      })
      .reduce((total, record) => total + record.netPay, 0);
  };

  // Get most recent paycheck
  const getLatestPaycheck = (): PayrollRecord | null => {
    if (payrollRecords.length === 0) return null;
    
    const paidRecords = payrollRecords.filter(record => record.status === 'paid');
    if (paidRecords.length === 0) return null;
    
    // Sort by pay period start date (most recent first)
    return paidRecords.sort((a, b) => {
      const periodA = getPayPeriodById(a.payPeriodId);
      const periodB = getPayPeriodById(b.payPeriodId);
      
      if (!periodA || !periodB) return 0;
      
      return new Date(periodB.startDate).getTime() - new Date(periodA.startDate).getTime();
    })[0];
  };

  const latestPaycheck = getLatestPaycheck();
  const latestPayPeriod = latestPaycheck ? getPayPeriodById(latestPaycheck.payPeriodId) : null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get pay period by ID
  const getPayPeriodById = (periodId: string): PayPeriod | undefined => {
    return payPeriods.find(period => period.id === periodId);
  };

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Pay</h1>
          <p className="text-gray-500">View your payroll information and history</p>
        </div>

        {/* Pay Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500 font-normal">Year-to-Date Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${calculateYTDEarnings().toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500 font-normal">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${calculateTotalEarnings().toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500 font-normal">Latest Paycheck</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {latestPaycheck ? `$${latestPaycheck.netPay.toFixed(2)}` : '—'}
              </div>
              {latestPayPeriod && (
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(latestPayPeriod.startDate)} - {formatDate(latestPayPeriod.endDate)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pay History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pay History</CardTitle>
                <CardDescription>View your payment history and details</CardDescription>
              </div>
              
              <Select
                value={selectedPayPeriod}
                onValueChange={setSelectedPayPeriod}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select pay period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pay Periods</SelectItem>
                  {payPeriods.map(period => (
                    <SelectItem key={period.id} value={period.id}>
                      {formatDate(period.startDate)} - {formatDate(period.endDate)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoadingRecords || isLoadingPeriodRecords ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : (selectedPayPeriod && selectedPayPeriod !== "all" ? periodPayrollRecords : payrollRecords).length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No payroll records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Regular Hours</TableHead>
                      <TableHead>Overtime Hours</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(selectedPayPeriod && selectedPayPeriod !== "all" ? periodPayrollRecords : payrollRecords).map(record => {
                      const payPeriod = getPayPeriodById(record.payPeriodId);
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            {payPeriod ? (
                              <div>
                                <div className="font-medium">
                                  {formatDate(payPeriod.startDate)} - {formatDate(payPeriod.endDate)}
                                </div>
                              </div>
                            ) : (
                              'Unknown Period'
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{record.regularHours}</TableCell>
                          <TableCell>{record.overtimeHours}</TableCell>
                          <TableCell>${record.grossPay.toFixed(2)}</TableCell>
                          <TableCell>${record.deductions.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${record.netPay.toFixed(2)}</TableCell>
                          <TableCell>
                            {record.status === 'paid' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          {/* Pagination (placeholder) */}
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-gray-500">
              Showing {(selectedPayPeriod && selectedPayPeriod !== "all" ? periodPayrollRecords : payrollRecords).length} records
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeePayroll;
