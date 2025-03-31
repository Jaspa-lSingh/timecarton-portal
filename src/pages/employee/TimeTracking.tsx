import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { timeEntryService } from '@/services/timeEntryService';
import { authService } from '@/services';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TimeEntry } from '@/types';

const EmployeeTimeTracking: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Fetch time entries for current user and selected date
  const {
    data: timeEntries = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['timeEntries', currentUser?.id, selectedDate],
    queryFn: async () => {
      if (!currentUser?.id) return [];

      const startDate = format(selectedDate, 'yyyy-MM-dd');
      const endDate = format(selectedDate, 'yyyy-MM-dd');

      const response = await timeEntryService.getTimeEntriesByDateRange(
        currentUser.id,
        startDate,
        endDate
      );

      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
    enabled: !!currentUser?.id,
  });

  const formatDate = (date: Date): string => {
    return format(date, 'MMM dd, yyyy');
  };

  const formatTime = (dateString: string): string => {
    const date = parseISO(dateString);
    return format(date, 'hh:mm a');
  };

  const calculateDuration = (start: string, end: string): string => {
    const startTime = parseISO(start).getTime();
    const endTime = parseISO(end).getTime();
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    return durationHours.toFixed(2);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-500">Track your work hours and time entries</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Time Entries for {formatDate(selectedDate)}</CardTitle>
              <input
                type="date"
                className="border rounded px-3 py-2"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
              />
            </div>
            <CardDescription>View your time entries for the selected date</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading time entries...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">Error: {error.message}</div>
            ) : timeEntries.length === 0 ? (
              <div className="text-center py-4">No time entries found for this date.</div>
            ) : (
              <div className="space-y-4">
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">
                        {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {calculateDuration(entry.startTime, entry.endTime)} hours
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Notes: {entry.notes || 'No notes'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => refetch()}>Refresh</Button>
          </CardFooter>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTimeTracking;
