
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isToday } from 'date-fns';
import { timeEntryService } from '@/services/timeEntryService';
import { employeeService } from '@/services/employeeService';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { TimeEntry, User } from '@/types';
import { 
  Clock, 
  UserCheck, 
  Plus,
  Search,
  Check,
  Loader2,
  Calendar,
  FileText,
  Filter,
  X
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TimeTrackingAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TimeEntry>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  // Fetch time entries
  const { 
    data: timeEntries = [], 
    isLoading: isLoadingEntries,
    refetch
  } = useQuery({
    queryKey: ['adminTimeEntries', selectedEmployee, startDate, endDate],
    queryFn: async () => {
      let response;
      if (selectedEmployee) {
        response = await timeEntryService.getEmployeeTimeEntries(selectedEmployee);
      } else {
        response = await timeEntryService.getTimeEntriesByDate(startDate, endDate);
      }
      
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Fetch employees for select dropdown
  const { 
    data: employees = [],
    isLoading: isLoadingEmployees 
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeeService.getEmployees();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Add time entry mutation
  const addEntryMutation = useMutation({
    mutationFn: async (data: Partial<TimeEntry>) => {
      const response = await timeEntryService.addManualTimeEntry(data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeEntries'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Time entry added successfully',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Edit time entry mutation
  const editEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TimeEntry> }) => {
      const response = await timeEntryService.editTimeEntry(id, data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeEntries'] });
      setIsEditDialogOpen(false);
      setEditingEntry(null);
      toast({
        title: 'Success',
        description: 'Time entry updated successfully',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Approve time entry mutation
  const approveEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await timeEntryService.approveTimeEntry(id);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeEntries'] });
      toast({
        title: 'Success',
        description: 'Time entry approved',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete time entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await timeEntryService.deleteTimeEntry(id);
      if (response.error) throw new Error(response.error);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTimeEntries'] });
      toast({
        title: 'Success',
        description: 'Time entry deleted',
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({});
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingEntry) {
      setEditingEntry(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addEntryMutation.mutate(formData);
  };

  const handleEditEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      editEntryMutation.mutate({
        id: editingEntry.id,
        data: editingEntry
      });
    }
  };

  const handleApprove = (id: string) => {
    approveEntryMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteEntryMutation.mutate(id);
    }
  };

  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsEditDialogOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy hh:mm a');
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '—';
    const date = parseISO(dateString);
    return format(date, 'hh:mm a');
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  // Filter time entries based on search
  const filteredEntries = timeEntries.filter(entry => {
    const employeeName = getEmployeeName(entry.employeeId).toLowerCase();
    return employeeName.includes(searchQuery.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
            <p className="text-gray-500">Manage employee time entries and approvals</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                <span>Add Time Entry</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Manual Time Entry</DialogTitle>
                <DialogDescription>
                  Create a time entry for an employee
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddEntry} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="employeeId" className="text-sm font-medium">
                    Employee
                  </label>
                  <Select
                    value={formData.employeeId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, employeeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="clockIn" className="text-sm font-medium">
                      Clock In Time
                    </label>
                    <Input
                      id="clockIn"
                      name="clockIn"
                      type="datetime-local"
                      value={formData.clockIn || ''}
                      onChange={handleAddInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="clockOut" className="text-sm font-medium">
                      Clock Out Time (Optional)
                    </label>
                    <Input
                      id="clockOut"
                      name="clockOut"
                      type="datetime-local"
                      value={formData.clockOut || ''}
                      onChange={handleAddInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleAddInputChange}
                    placeholder="Add any relevant information"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Approved?
                  </label>
                  <Select
                    value={formData.approved ? 'true' : 'false'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, approved: value === 'true' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsAddDialogOpen(false);
                    }}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addEntryMutation.isPending}
                  >
                    {addEntryMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Time Entry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Time Entry Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="employee" className="text-sm font-medium">
                  Employee
                </label>
                <Select
                  value={selectedEmployee || "all"}
                  onValueChange={(value) => setSelectedEmployee(value === "all" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center border rounded-md pl-3">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                className="border-0 focus-visible:ring-0"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>
              View and manage employee time records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingEntries ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-10">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No time entries found for the selected criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="font-medium">{getEmployeeName(entry.employeeId)}</div>
                        </TableCell>
                        <TableCell>{formatDateTime(entry.clockIn)}</TableCell>
                        <TableCell>
                          {entry.clockOut ? formatDateTime(entry.clockOut) : '—'}
                        </TableCell>
                        <TableCell>
                          {entry.totalHours ? `${entry.totalHours.toFixed(2)}` : '—'}
                        </TableCell>
                        <TableCell>
                          {!entry.clockOut ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Active
                            </span>
                          ) : entry.approved ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {entry.notes || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.clockOut && !entry.approved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(entry.id)}
                              className="h-8 w-8 p-0 mr-1 text-green-500"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                            className="h-8 w-8 p-0 mr-1"
                            title="Edit"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            className="h-8 w-8 p-0 text-red-500"
                            title="Delete"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>
              Update the time entry details
            </DialogDescription>
          </DialogHeader>
          
          {editingEntry && (
            <form onSubmit={handleEditEntry} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Employee
                </label>
                <Input
                  value={getEmployeeName(editingEntry.employeeId)}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="editClockIn" className="text-sm font-medium">
                    Clock In Time
                  </label>
                  <Input
                    id="editClockIn"
                    name="clockIn"
                    type="datetime-local"
                    value={editingEntry.clockIn || ''}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="editClockOut" className="text-sm font-medium">
                    Clock Out Time
                  </label>
                  <Input
                    id="editClockOut"
                    name="clockOut"
                    type="datetime-local"
                    value={editingEntry.clockOut || ''}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="editNotes" className="text-sm font-medium">
                  Notes
                </label>
                <Input
                  id="editNotes"
                  name="notes"
                  value={editingEntry.notes || ''}
                  onChange={handleEditInputChange}
                  placeholder="Add any relevant information"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Approved?
                </label>
                <Select
                  value={editingEntry.approved ? 'true' : 'false'}
                  onValueChange={(value) => 
                    setEditingEntry(prev => ({ ...prev!, approved: value === 'true' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingEntry(null);
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editEntryMutation.isPending}
                >
                  {editEntryMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Time Entry
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TimeTrackingAdmin;
