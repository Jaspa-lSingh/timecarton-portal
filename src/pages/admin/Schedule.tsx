
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/layouts/AdminLayout';
import { shiftService } from '@/services/shiftService';
import { employeeService } from '@/services/employeeService';
import { Shift, User } from '@/types';
import { Plus, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const AdminSchedule: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  
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
        // Fetch employees
        const employeeResponse = await employeeService.getEmployees();
        if (employeeResponse.data) {
          setEmployees(employeeResponse.data);
        }
        
        // Fetch shifts for the current week
        if (currentWeek.length > 0) {
          const startDate = formatDate(currentWeek[0]);
          const endDate = formatDate(currentWeek[6]);
          
          const shiftsResponse = await shiftService.getShiftsByDate(startDate, endDate);
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
    
    if (currentWeek.length > 0) {
      fetchData();
    }
  }, [currentWeek]);
  
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
  
  // Get shifts for a specific day and employee
  const getShiftsForDay = (date: Date, employeeId?: string): Shift[] => {
    const dateString = formatDate(date);
    
    return shifts.filter(shift => {
      const shiftDate = shift.startTime.split('T')[0];
      
      if (employeeId && employeeId !== 'all') {
        return shiftDate === dateString && shift.employeeId === employeeId;
      }
      
      return shiftDate === dateString;
    });
  };
  
  // Format time for display
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get employee name by ID
  const getEmployeeName = (id: string): string => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-500">Manage employee work schedules</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button className="flex gap-2 items-center">
              <Plus className="h-4 w-4" />
              <span>Add Shift</span>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Employee
                </label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
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
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Position
                </label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Positions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="barista">Barista</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="cook">Cook</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Location
                </label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="main">Main Store</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="mall">Mall Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
        <div className="bg-white border rounded-lg overflow-hidden">
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
          <div className="grid grid-cols-7 min-h-[600px]">
            {currentWeek.map((date, index) => {
              const dayShifts = getShiftsForDay(date, selectedEmployee !== 'all' ? selectedEmployee : undefined);
              
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
                        className="bg-white p-2 rounded border shadow-sm text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-medium">{getEmployeeName(shift.employeeId)}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            {shift.position}
                          </span>
                          <span 
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              shift.status === 'scheduled' 
                                ? 'bg-green-100 text-green-800' 
                                : shift.status === 'completed' 
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {shift.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {dayShifts.length === 0 && (
                      <div className="h-full flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          className="text-gray-400 h-full w-full flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-md border border-dashed"
                        >
                          <Plus className="h-5 w-5" />
                          <span className="text-xs">Add Shift</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSchedule;
