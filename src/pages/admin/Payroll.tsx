
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, addDays } from 'date-fns';
import { payrollService } from '@/services/payrollService';
import { employeeService } from '@/services/employeeService';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { PayPeriod, PayrollRecord, User } from '@/types';
import { 
  Calendar, 
  DollarSign, 
  Download,
  Clock,
  Check,
  Loader2,
  ChevronDown,
  FileText,
  Plus,
  RefreshCw
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const AdminPayroll: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>('');
  const [isNewPeriodDialogOpen, setIsNewPeriodDialogOpen] = useState(false);
  const [newPeriodData, setNewPeriodData] = useState<Partial<PayPeriod>>({
    startDate: '',
    endDate: '',
    status: 'pending'
  });
  const [openPeriodDetails, setOpenPeriodDetails] = useState<string[]>([]);

  // Fetch pay periods
  const { 
    data: payPeriods = [], 
    isLoading: isLoadingPeriods 
  } = useQuery({
    queryKey: ['payPeriods'],
    queryFn: async () => {
      const response = await payrollService.getPayPeriods();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Fetch employees for reference
  const { 
    data: employees = []
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeeService.getEmployees();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Fetch payroll records by period
  const { 
    data: payrollRecords = [],
    isLoading: isLoadingRecords,
    refetch: refetchRecords
  } = useQuery({
    queryKey: ['payrollRecords', selectedPayPeriod],
    queryFn: async () => {
      if (!selectedPayPeriod) return [];
      
      const response = await payrollService.getPayrollByPeriod(selectedPayPeriod);
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: !!selectedPayPeriod,
  });

  // Create new pay period mutation
  const createPayPeriodMutation = useMutation({
    mutationFn: async (periodData: Partial<PayPeriod>) => {
      const response = await payrollService.createPayPeriod(periodData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payPeriods'] });
      setIsNewPeriodDialogOpen(false);
      resetNewPeriodForm();
      toast({
        title: 'Success',
        description: 'Pay period created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Process payroll mutation
  const processPayrollMutation = useMutation({
    mutationFn: async (periodId: string) => {
      const response = await payrollService.processPayroll(periodId);
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payPeriods'] });
      queryClient.invalidateQueries({ queryKey: ['payrollRecords'] });
      toast({
        title: 'Success',
        description: 'Payroll processing has been initiated',
      });
      
      // Refetch records for the current pay period
      if (selectedPayPeriod) {
        refetchRecords();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Approve payroll records mutation
  const approvePayrollMutation = useMutation({
    mutationFn: async (recordIds: string[]) => {
      const response = await payrollService.approvePayroll(recordIds);
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrollRecords'] });
      toast({
        title: 'Success',
        description: 'Payroll records approved successfully',
      });
      
      // Refetch records for the current pay period
      if (selectedPayPeriod) {
        refetchRecords();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetNewPeriodForm = () => {
    setNewPeriodData({
      startDate: '',
      endDate: '',
      status: 'pending'
    });
  };

  const handleNewPeriodInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPeriodData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePayPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    createPayPeriodMutation.mutate(newPeriodData);
  };

  const handleProcessPayroll = (periodId: string) => {
    if (window.confirm('Are you sure you want to process the payroll for this period?')) {
      processPayrollMutation.mutate(periodId);
    }
  };

  const handleApproveAll = () => {
    if (!selectedPayPeriod) return;
    
    const pendingRecords = payrollRecords
      .filter(record => record.status === 'pending')
      .map(record => record.id);
    
    if (pendingRecords.length === 0) {
      toast({
        title: 'Info',
        description: 'No pending payroll records to approve',
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to approve ${pendingRecords.length} payroll records?`)) {
      approvePayrollMutation.mutate(pendingRecords);
    }
  };

  const togglePeriodDetails = (periodId: string) => {
    setOpenPeriodDetails(prevOpen => 
      prevOpen.includes(periodId)
        ? prevOpen.filter(id => id !== periodId)
        : [...prevOpen, periodId]
    );
    
    // Set the selected pay period for records
    setSelectedPayPeriod(periodId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total payroll amount for a period
  const calculatePeriodTotal = (records: PayrollRecord[]) => {
    return records.reduce((total, record) => total + record.grossPay, 0);
  };

  // Check if all records in a period are approved or paid
  const areAllRecordsProcessed = (records: PayrollRecord[]) => {
    return records.every(record => record.status === 'approved' || record.status === 'paid');
  };

  // Count of pending records
  const pendingRecordsCount = payrollRecords.filter(record => record.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-500">Process and manage employee payroll</p>
          </div>
          
          <Dialog open={isNewPeriodDialogOpen} onOpenChange={setIsNewPeriodDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                <span>Create Pay Period</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Pay Period</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreatePayPeriod} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Start Date
                    </label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newPeriodData.startDate || ''}
                      onChange={handleNewPeriodInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      End Date
                    </label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newPeriodData.endDate || ''}
                      onChange={handleNewPeriodInputChange}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetNewPeriodForm();
                      setIsNewPeriodDialogOpen(false);
                    }}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPayPeriodMutation.isPending}
                  >
                    {createPayPeriodMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Pay Period
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pay Periods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Pay Periods</CardTitle>
              <CardDescription>
                Manage and process payroll for different pay periods
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingPeriods ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                </div>
              ) : payPeriods.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No pay periods found</p>
                  <p className="text-gray-400 text-sm">Create your first pay period to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payPeriods.map(period => (
                    <Collapsible
                      key={period.id}
                      open={openPeriodDetails.includes(period.id)}
                      onOpenChange={() => togglePeriodDetails(period.id)}
                      className="border rounded-md overflow-hidden"
                    >
                      <div className="bg-gray-50 border-b p-4">
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white rounded-md border">
                              <Calendar className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {formatDate(period.startDate)} - {formatDate(period.endDate)}
                              </h3>
                              <div className="text-sm text-gray-500">
                                Pay Period #{period.id}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-4 ${getStatusBadgeClass(period.status)}`}>
                              {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                            </span>
                            <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${openPeriodDetails.includes(period.id) ? 'rotate-180' : ''}`} />
                          </div>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="p-4">
                          <div className="mb-4 flex justify-between items-center">
                            <div>
                              <h4 className="font-medium mb-1">Payroll Details</h4>
                              <p className="text-sm text-gray-500">
                                {period.status === 'completed' ? 'Payroll has been processed and completed' : 
                                 period.status === 'processing' ? 'Payroll is currently being processed' : 
                                 'Process payroll for this period'}
                              </p>
                            </div>
                            
                            <div className="flex space-x-2">
                              {period.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleProcessPayroll(period.id)}
                                  disabled={processPayrollMutation.isPending}
                                >
                                  {processPayrollMutation.isPending && processPayrollMutation.variables === period.id && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  <Clock className="h-4 w-4 mr-2" />
                                  Process Payroll
                                </Button>
                              )}
                              
                              {period.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* Payroll Records */}
                          {isLoadingRecords ? (
                            <div className="flex justify-center py-10">
                              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                            </div>
                          ) : payrollRecords.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-md">
                              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                              <p className="text-gray-500">No payroll records found for this period</p>
                              {period.status === 'pending' && (
                                <p className="text-gray-400 text-sm mt-2">
                                  Process the payroll to generate records
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              <div className="mb-4 flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                  Showing {payrollRecords.length} records
                                </div>
                                
                                {pendingRecordsCount > 0 && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleApproveAll}
                                    disabled={approvePayrollMutation.isPending}
                                  >
                                    {approvePayrollMutation.isPending && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve All ({pendingRecordsCount})
                                  </Button>
                                )}
                              </div>
                              
                              <div className="border rounded-md overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Employee</TableHead>
                                      <TableHead>Regular Hours</TableHead>
                                      <TableHead>Overtime Hours</TableHead>
                                      <TableHead>Gross Pay</TableHead>
                                      <TableHead>Deductions</TableHead>
                                      <TableHead>Net Pay</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {payrollRecords.map(record => (
                                      <TableRow key={record.id}>
                                        <TableCell>
                                          <div className="font-medium">
                                            {getEmployeeName(record.employeeId)}
                                          </div>
                                        </TableCell>
                                        <TableCell>{record.regularHours}</TableCell>
                                        <TableCell>{record.overtimeHours}</TableCell>
                                        <TableCell>${record.grossPay.toFixed(2)}</TableCell>
                                        <TableCell>${record.deductions.toFixed(2)}</TableCell>
                                        <TableCell>${record.netPay.toFixed(2)}</TableCell>
                                        <TableCell>
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              
                              <div className="mt-4 p-4 bg-gray-50 rounded-md flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Total Gross Pay</div>
                                  <div className="text-2xl font-bold">${calculatePeriodTotal(payrollRecords).toFixed(2)}</div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="font-medium">Total Employees</div>
                                  <div className="text-2xl font-bold">{payrollRecords.length}</div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayroll;
