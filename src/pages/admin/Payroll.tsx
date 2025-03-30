
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { payrollService } from '@/services/payrollService';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { 
  Calendar, 
  Plus,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data for pay periods
const mockPayPeriods = [
  {
    id: '1',
    startDate: '2024-05-31',
    endDate: '2024-06-14',
    status: 'completed',
    periodNumber: 1
  },
  {
    id: '2',
    startDate: '2024-06-15',
    endDate: '2024-06-29',
    status: 'completed',
    periodNumber: 2
  },
  {
    id: '3',
    startDate: '2024-06-30',
    endDate: '2024-07-14',
    status: 'processing',
    periodNumber: 3
  },
  {
    id: '4',
    startDate: '2024-07-15',
    endDate: '2024-07-30',
    status: 'pending',
    periodNumber: 4
  }
];

const AdminPayroll: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast: uiToast } = useToast();
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<string>('');
  const [isNewPeriodDialogOpen, setIsNewPeriodDialogOpen] = useState(false);
  const [newPeriodData, setNewPeriodData] = useState({
    startDate: '',
    endDate: '',
    status: 'pending'
  });
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

  const { 
    data: payPeriods = mockPayPeriods, 
    isLoading: isLoadingPeriods 
  } = useQuery({
    queryKey: ['payPeriods'],
    queryFn: async () => {
      try {
        const response = await payrollService.getPayPeriods();
        return response.data || mockPayPeriods;
      } catch (error) {
        return mockPayPeriods; // Fallback to mock data if API fails
      }
    },
  });

  const createPayPeriodMutation = useMutation({
    mutationFn: async (periodData: any) => {
      const response = await payrollService.createPayPeriod(periodData);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payPeriods'] });
      setIsNewPeriodDialogOpen(false);
      resetNewPeriodForm();
      toast.success('Pay period created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const processPayrollMutation = useMutation({
    mutationFn: async (periodId: string) => {
      const response = await payrollService.processPayroll(periodId);
      if (response.error) throw new Error(response.error);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payPeriods'] });
      toast.success('Payroll processing has been initiated');
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
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

  const togglePeriodExpand = (periodId: string) => {
    setExpandedPeriod(expandedPeriod === periodId ? null : periodId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                      value={newPeriodData.startDate}
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
                      value={newPeriodData.endDate}
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

        <Card>
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
                  <div 
                    key={period.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => togglePeriodExpand(period.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Calendar size={24} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {formatDate(period.startDate)} - {formatDate(period.endDate)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Pay Period #{period.periodNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(period.status)}`}>
                          {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                        </span>
                        <ChevronDown 
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            expandedPeriod === period.id ? 'transform rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </div>
                    
                    {expandedPeriod === period.id && (
                      <div className="border-t p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">
                            {period.status === 'pending' 
                              ? 'This pay period is pending processing.'
                              : period.status === 'processing'
                              ? 'This pay period is currently being processed.'
                              : 'This pay period has been processed and completed.'}
                          </p>
                          
                          {period.status === 'pending' && (
                            <Button
                              onClick={() => processPayrollMutation.mutate(period.id)}
                              disabled={processPayrollMutation.isPending}
                            >
                              {processPayrollMutation.isPending && processPayrollMutation.variables === period.id && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Generate Payroll
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayroll;
