
import React, { useState, useEffect } from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services';
import { shiftService } from '@/services/shiftService';
import { Shift } from '@/types';

const EmployeeSchedule = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));
  
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoading(true);
      try {
        if (currentUser) {
          const response = await shiftService.getEmployeeShifts(currentUser.id);
          
          if (response.data) {
            // Sort shifts by date
            const sortedShifts = response.data.sort((a, b) => 
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );
            setShifts(sortedShifts);
          }
        }
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShifts();
  }, [currentUser]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return new Date(timeString).toLocaleTimeString(undefined, options);
  };
  
  // Calculate hours between two times
  const calculateHours = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const hours = (endTime - startTime) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Shifts</h1>
          <span className="text-sm text-gray-500">{currentMonth}</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Shifts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : shifts.length > 0 ? (
              <div className="space-y-4">
                {shifts.map(shift => (
                  <div 
                    key={shift.id} 
                    className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">
                        {formatDate(shift.startTime)}
                      </h4>
                      <span 
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {shift.position}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{calculateHours(shift.startTime, shift.endTime)} hours</span>
                      </div>
                      {shift.location && (
                        <div className="text-gray-500">
                          Location: {shift.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md">
                <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">No shifts scheduled for the current period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSchedule;
