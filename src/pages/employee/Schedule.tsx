import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isToday, isSameDay, parseISO, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Button } from '@/components/ui/button';
import { shiftService } from '@/services/shiftService';
import { authService } from '@/services';
import { Shift } from '@/types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

const EmployeeSchedule: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    // Generate the current week's dates
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = today.getDate() - currentDay;
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(diff + i);
      weekDates.push(day);
    }
    
    setCurrentWeek(weekDates);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!currentUser) return;
        
        // Fetch shifts for the current week
        if (currentWeek.length > 0) {
          const startDate = formatDate(currentWeek[0]);
          const endDate = formatDate(currentWeek[6]);
          
          const shiftsResponse = await shiftService.getEmployeeShifts(currentUser.id);
          if (shiftsResponse.data) {
            setShifts(shiftsResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentWeek.length > 0 && currentUser) {
      fetchData();
    }
  }, [currentWeek, currentUser]);
  
  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Format date for display
  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Format day name
  const formatDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Go to previous week
  const goToPreviousWeek = () => {
    const newWeek = currentWeek.map(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 7);
      return newDate;
    });
    setCurrentWeek(newWeek);
  };
  
  // Go to next week
  const goToNextWeek = () => {
    const newWeek = currentWeek.map(date => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 7);
      return newDate;
    });
    setCurrentWeek(newWeek);
  };
  
  // Get shifts for a specific day
  const getShiftsForDay = (date: Date): Shift[] => {
    const dateString = formatDate(date);
    
    return shifts.filter(shift => {
      const shiftDate = shift.startTime.split('T')[0];
      return shiftDate === dateString;
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate shift duration in hours
  const calculateDuration = (start: string, end: string): string => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    return durationHours.toFixed(1);
  };
  
  // Get all upcoming shifts
  const getUpcomingShifts = (): Shift[] => {
    const now = new Date();
    
    return shifts
      .filter(shift => new Date(shift.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };
  
  const upcomingShifts = getUpcomingShifts();
  
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-500">View your upcoming work shifts</p>
        </div>
        
        {/* Week Navigation */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline"
            onClick={goToPreviousWeek}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Week</span>
          </Button>
          
          <div className="text-lg font-semibold">
            {currentWeek.length > 0 && (
              <>
                {formatDateDisplay(currentWeek[0])} - {formatDateDisplay(currentWeek[6])}
              </>
            )}
          </div>
          
          <Button 
            variant="outline"
            onClick={goToNextWeek}
            className="flex items-center gap-1"
          >
            <span>Next Week</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Weekly Schedule */}
        <div className="bg-white border rounded-lg overflow-hidden mb-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {currentWeek.map((date, index) => (
              <div 
                key={index} 
                className="p-4 text-center border-r last:border-r-0"
              >
                <div className="font-medium">{formatDayName(date)}</div>
                <div className="text-sm text-gray-500">{formatDateDisplay(date)}</div>
              </div>
            ))}
          </div>
          
          {/* Schedule Content */}
          <div className="grid grid-cols-7 min-h-[300px]">
            {currentWeek.map((date, index) => {
              const dayShifts = getShiftsForDay(date);
              
              return (
                <div 
                  key={index} 
                  className={`p-2 border-r last:border-r-0 min-h-full ${
                    new Date().toDateString() === date.toDateString() ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="space-y-2">
                    {dayShifts.map(shift => (
                      <div 
                        key={shift.id}
                        className="bg-white p-3 rounded border shadow-sm text-sm"
                      >
                        <div className="font-medium text-brand-700">{shift.position}</div>
                        <div className="flex items-center gap-1 mt-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                        </div>
                        {shift.location && (
                          <div className="flex items-center gap-1 mt-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{shift.location}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <span 
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              shift.status === 'scheduled' 
                                ? 'bg-green-100 text-green-800' 
                                : shift.status === 'completed' 
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {dayShifts.length === 0 && (
                      <div className="h-full min-h-[100px] flex items-center justify-center">
                        <p className="text-gray-400 text-sm">No shifts</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingShifts.length > 0 ? (
              <div className="space-y-4">
                {upcomingShifts.map(shift => (
                  <div 
                    key={shift.id}
                    className="border rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                  >
                    <div className="mb-2 md:mb-0">
                      <h3 className="font-medium">{new Date(shift.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                        <span>•</span>
                        <span>{calculateDuration(shift.startTime, shift.endTime)} hours</span>
                      </div>
                      {shift.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span>{shift.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2 md:mb-0"
                      >
                        {shift.position}
                      </span>
                      {shift.status === 'pending' && (
                        <div className="mt-2">
                          <Button size="sm" variant="outline">Request Change</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No upcoming shifts scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSchedule;
