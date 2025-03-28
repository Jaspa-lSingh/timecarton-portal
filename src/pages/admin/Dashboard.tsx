
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layouts/AdminLayout';
import { employeeService } from '@/services/employeeService';
import { shiftService } from '@/services/shiftService';
import { payrollService } from '@/services/payrollService';
import { User, Shift, PayrollRecord } from '@/types';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [todayShifts, setTodayShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch employees
        const employeeResponse = await employeeService.getEmployees();
        if (employeeResponse.data) {
          setEmployees(employeeResponse.data);
        }
        
        // Fetch today's shifts
        const today = new Date().toISOString().split('T')[0];
        const shiftsResponse = await shiftService.getShiftsByDate(today);
        if (shiftsResponse.data) {
          setTodayShifts(shiftsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Helper to display time in a readable format
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-3xl font-bold">{employees.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Shifts</p>
                <h3 className="text-3xl font-bold">{todayShifts.length}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <h3 className="text-3xl font-bold">3</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Payroll Status</p>
                <h3 className="text-3xl font-bold">Active</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-700" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading shifts...</p>
              ) : todayShifts.length > 0 ? (
                <div className="space-y-4">
                  {todayShifts.map(shift => {
                    const employee = employees.find(emp => emp.id === shift.employeeId);
                    return (
                      <div 
                        key={shift.id} 
                        className="border rounded-md p-3 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-medium">
                            {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                          </h4>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                            <span>•</span>
                            <span>{shift.position}</span>
                          </div>
                        </div>
                        <div>
                          <span 
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              shift.status === 'scheduled' 
                                ? 'bg-blue-100 text-blue-800' 
                                : shift.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No shifts scheduled for today</p>
                  <Button className="mt-2" variant="outline">
                    Schedule a Shift
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="font-medium">Sarah Williams clocked in</p>
                  <p className="text-sm text-gray-500">Today, 09:03 AM</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="font-medium">New shift assigned to John Doe</p>
                  <p className="text-sm text-gray-500">Today, 08:47 AM</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <p className="font-medium">June payroll processing completed</p>
                  <p className="text-sm text-gray-500">Yesterday, 04:23 PM</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <p className="font-medium">Robert Johnson requested time off</p>
                  <p className="text-sm text-gray-500">Yesterday, 02:15 PM</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-1">
                  <p className="font-medium">Jane Smith missed shift</p>
                  <p className="text-sm text-gray-500">June 10, 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
