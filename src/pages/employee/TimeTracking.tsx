
import React, { useState, useEffect } from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Clock, Calendar, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services';

const EmployeeTimeTracking = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{type: string, time: Date}>>([]);
  const { toast } = useToast();
  
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setClockedIn(true);
    setRecentActivity(prev => [{ type: 'Clock In', time: now }, ...prev]);
    
    toast({
      title: "Clocked In",
      description: `Successfully clocked in at ${formatTime(now)}`,
    });
  };
  
  const handleClockOut = () => {
    const now = new Date();
    const duration = clockInTime ? calculateDuration(clockInTime, now) : "Unknown";
    
    setClockedIn(false);
    setClockInTime(null);
    setRecentActivity(prev => [{ type: 'Clock Out', time: now }, ...prev]);
    
    toast({
      title: "Clocked Out",
      description: `Worked for approximately ${duration}`,
    });
  };
  
  // Format time (HH:MM AM/PM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Format date (Day, Month DD)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate duration between two times
  const calculateDuration = (start: Date, end: Date) => {
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Time & Attendance</h1>
          <span className="text-sm text-gray-500">Today: {formatDate(currentTime)}</span>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Clock In/Out</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {clockedIn ? (
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                  onClick={handleClockOut}
                >
                  Clock Out
                </Button>
              ) : (
                <Button 
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  onClick={handleClockIn}
                >
                  Clock In
                </Button>
              )}
              
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">Current Status:</p>
                <p className={`font-medium flex items-center gap-1 justify-end ${clockedIn ? 'text-green-600' : 'text-gray-600'}`}>
                  {clockedIn ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Clocked In ({clockInTime ? formatTime(clockInTime) : ''})</span>
                    </>
                  ) : 'Not Clocked In'}
                </p>
              </div>
            </div>
            
            {clockedIn && clockInTime && (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
                <p className="text-sm text-green-700">
                  You've been clocked in for: {calculateDuration(clockInTime, currentTime)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-full ${activity.type === 'Clock In' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Clock className={`h-4 w-4 ${activity.type === 'Clock In' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <span className="font-medium">{activity.type}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(activity.time)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md">
                <Clock className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTimeTracking;
