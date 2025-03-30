
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { shiftService } from '@/services/shiftService';
import { payrollService } from '@/services/payrollService';
import { authService } from '@/services/authService';
import { Shift, PayrollRecord } from '@/types';
import { Calendar, Clock, DollarSign, AlertCircle, HelpCircle, Repeat } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [recentPayroll, setRecentPayroll] = useState<PayrollRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!currentUser) return;
        
        // Fetch upcoming shifts
        const today = new Date().toISOString().split('T')[0];
        const shiftsResponse = await shiftService.getEmployeeShifts(currentUser.id);
        
        if (shiftsResponse.data) {
          // Filter upcoming shifts
          const upcoming = shiftsResponse.data
            .filter(shift => {
              const shiftDate = new Date(shift.startTime);
              return shiftDate >= new Date();
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 3); // Get only the next 3 shifts
          
          setUpcomingShifts(upcoming);
        }
        
        // Fetch recent payroll
        const payrollResponse = await payrollService.getEmployeePayroll(currentUser.id);
        if (payrollResponse.data && payrollResponse.data.length > 0) {
          // Get most recent payroll record
          setRecentPayroll(payrollResponse.data[0]);
        }
      } catch (error) {
        console.error('Error fetching employee dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
      minute: '2-digit'
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {currentUser?.firstName}
          </h1>
          <p className="text-gray-500">Welcome to your dashboard</p>
        </div>
        
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <Card className="bg-brand-50 border-brand-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-brand-900">Clock In/Out</h3>
                <Clock className="h-5 w-5 text-brand-700" />
              </div>
              <Button className="w-full">Clock In</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">View Schedule</h3>
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employee/schedule">See All Shifts</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Payroll</h3>
                <DollarSign className="h-5 w-5 text-gray-500" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employee/pay">View Pay Stubs</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Time Off</h3>
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employee/inquiry">Request Time Off</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Shift Changes</h3>
                <Repeat className="h-5 w-5 text-gray-500" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employee/shift-changes">Manage Shifts</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Inquiries</h3>
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/employee/inquiry">Submit Inquiry</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading shifts...</p>
              ) : upcomingShifts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingShifts.map(shift => (
                    <div 
                      key={shift.id} 
                      className="border rounded-md p-4"
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
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming shifts scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Pay & Announcements */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Pay</CardTitle>
              </CardHeader>
              <CardContent>
                {recentPayroll ? (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Pay Period:</span>
                      <span className="font-medium">June 1 - June 15, 2023</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Regular Hours:</span>
                      <span className="font-medium">{recentPayroll.regularHours}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Overtime Hours:</span>
                      <span className="font-medium">{recentPayroll.overtimeHours}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Gross Pay:</span>
                      <span className="font-medium">${recentPayroll.grossPay.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Net Pay:</span>
                      <span className="font-bold text-lg">${recentPayroll.netPay.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-4">No recent payroll information</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="font-medium">New Schedule Published</p>
                    <p className="text-sm text-gray-500">The schedule for next week is now available.</p>
                    <p className="text-xs text-gray-400 mt-1">Today, 09:45 AM</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4 py-1">
                    <p className="font-medium">Upcoming Inventory Count</p>
                    <p className="text-sm text-gray-500">All staff please be prepared for inventory count on Friday.</p>
                    <p className="text-xs text-gray-400 mt-1">Yesterday, 03:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
