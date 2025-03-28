import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, isToday, isYesterday, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { timeEntryService } from '@/services/timeEntryService';
import { authService } from '@/services/authService';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { TimeEntry } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TimeTracking: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'week' | 'custom'>('week');
  const [startDate, setStartDate] = useState<string>(format(startOfWeek(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(endOfWeek(new Date()), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState<string>('');
  const [openNotes, setOpenNotes] = useState<boolean>(false);

  useEffect(() => {
    // Set date range based on selection
    const today = new Date();
    
    switch (dateRange) {
      case 'today':
        setStartDate(format(today, 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setStartDate(format(yesterday, 'yyyy-MM-dd'));
        setEndDate(format(yesterday, 'yyyy-MM-dd'));
        break;
      case 'week':
        setStartDate(format(startOfWeek(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfWeek(today), 'yyyy-MM-dd'));
        break;
      // For custom, we keep the existing dates
    }
  }, [dateRange]);

  // Fetch time entries for the employee
  const { 
    data: timeEntries = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['timeEntries', currentUser?.id, startDate, endDate],
    queryFn: async () => {
      if (!currentUser) throw new Error('No user found');
      
      const response = await timeEntryService.getTimeEntriesByDate(startDate, endDate);
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: !!currentUser && !!startDate && !!endDate,
  });

  // Get current clock status
  const { 
    data: clockStatus,
    isLoading: isLoadingStatus,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['clockStatus', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) throw new Error('No user found');
      
      const response = await timeEntryService.getCurrentClockStatus(currentUser.id);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    enabled: !!currentUser,
  });

  // Clock in mutation
  const clockInMutation = useMutation({
    mutationFn: async (noteText: string) => {
      if (!currentUser) throw new Error('No user found');
      
      const response = await timeEntryService.clockIn(currentUser.id, noteText);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have successfully clocked in',
      });
      refetchStatus();
      refetch();
      setNotes('');
      setOpenNotes(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Clock out mutation
  const clockOutMutation = useMutation({
    mutationFn: async (noteText: string) => {
      if (!currentUser || !clockStatus?.currentEntry) {
        throw new Error('No active time entry found');
      }
      
      const response = await timeEntryService.clockOut(clockStatus.currentEntry.id, noteText);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have successfully clocked out',
      });
      refetchStatus();
      refetch();
      setNotes('');
      setOpenNotes(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleClockIn = () => {
    setOpenNotes(true);
  };

  const handleClockOut = () => {
    setOpenNotes(true);
  };

  const submitClockAction = () => {
    if (clockStatus?.isClocked) {
      clockOutMutation.mutate(notes);
    } else {
      clockInMutation.mutate(notes);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy hh:mm a');
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM dd');
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '—';
    const date = parseISO(dateString);
    return format(date, 'hh:mm a');
  };

  const calculateDuration = (start: string, end?: string) => {
    if (!end) return '—';
    
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    
    const hours = Math.floor(durationHours);
    const minutes = Math.round((durationHours - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Group time entries by date
  const entriesByDate: Record<string, TimeEntry[]> = {};
  
  timeEntries.forEach(entry => {
    const date = entry.clockIn.split('T')[0];
    if (!entriesByDate[date]) {
      entriesByDate[date] = [];
    }
    entriesByDate[date].push(entry);
  });

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
            <p className="text-gray-500">Track your work hours and view time history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Clock In/Out Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Clock In/Out</CardTitle>
              <CardDescription>
                Track your working hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStatus ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-lg font-medium mb-2">
                      {clockStatus?.isClocked ? 'Currently Working' : 'Not Clocked In'}
                    </div>
                    {clockStatus?.isClocked && clockStatus.currentEntry && (
                      <div className="text-sm text-gray-500">
                        Started at {formatTime(clockStatus.currentEntry.clockIn)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    {clockStatus?.isClocked ? (
                      <Button 
                        variant="destructive" 
                        size="lg" 
                        className="w-full"
                        onClick={handleClockOut}
                        disabled={clockOutMutation.isPending}
                      >
                        {clockOutMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-5 w-5" />
                        )}
                        Clock Out
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full"
                        onClick={handleClockIn}
                        disabled={clockInMutation.isPending}
                      >
                        {clockInMutation.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-5 w-5" />
                        )}
                        Clock In
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Time Summary</CardTitle>
              <CardDescription>
                Your work hour statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Today's Hours</div>
                  <div className="text-2xl font-bold">
                    {timeEntries
                      .filter(entry => isToday(parseISO(entry.clockIn)) && entry.totalHours)
                      .reduce((total, entry) => total + (entry.totalHours || 0), 0)
                      .toFixed(2)} hrs
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">This Week</div>
                  <div className="text-2xl font-bold">
                    {timeEntries
                      .filter(entry => entry.totalHours)
                      .reduce((total, entry) => total + (entry.totalHours || 0), 0)
                      .toFixed(2)} hrs
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Entries Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Time History</CardTitle>
              <CardDescription>
                View your time entries
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={dateRange}
                onValueChange={(value) => setDateRange(value as any)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {dateRange === 'custom' && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-[150px]"
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-[150px]"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : sortedDates.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No time entries found for the selected period</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDates.map(date => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold mb-2">
                      {formatDate(date)}
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Clock In</TableHead>
                            <TableHead>Clock Out</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {entriesByDate[date].map(entry => (
                            <TableRow key={entry.id}>
                              <TableCell>{formatTime(entry.clockIn)}</TableCell>
                              <TableCell>{formatTime(entry.clockOut)}</TableCell>
                              <TableCell>{calculateDuration(entry.clockIn, entry.clockOut)}</TableCell>
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
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for notes when clocking in/out */}
      <Dialog open={openNotes} onOpenChange={setOpenNotes}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {clockStatus?.isClocked ? 'Clock Out' : 'Clock In'} Notes
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Add notes (optional)
              </label>
              <Input
                id="notes"
                placeholder="Add any relevant information..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenNotes(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitClockAction}
              disabled={clockInMutation.isPending || clockOutMutation.isPending}
            >
              {(clockInMutation.isPending || clockOutMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {clockStatus?.isClocked ? 'Clock Out' : 'Clock In'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EmployeeLayout>
  );
};

export default TimeTracking;
