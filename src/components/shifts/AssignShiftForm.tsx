
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addHours, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Users, CalendarIcon } from 'lucide-react';
import { shiftAssignmentService } from '@/services';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

interface AssignShiftFormProps {
  onSuccess?: () => void;
  defaultDate?: Date;
}

const AssignShiftForm = ({ onSuccess, defaultDate = new Date() }: AssignShiftFormProps) => {
  const [startDate, setStartDate] = useState<string>(
    format(defaultDate, "yyyy-MM-dd'T'HH:mm")
  );
  
  const [endDate, setEndDate] = useState<string>(
    format(addHours(defaultDate, 8), "yyyy-MM-dd'T'HH:mm")
  );
  
  const [position, setPosition] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available employees for the selected time period
  const { data: employeesData, isLoading, refetch } = useQuery({
    queryKey: ['availableEmployees', startDate, endDate],
    queryFn: async () => {
      const response = await shiftAssignmentService.getAvailableEmployees(startDate, endDate);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    },
    enabled: !!startDate && !!endDate
  });

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  // Handle employee selection
  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Select all employees
  const selectAllEmployees = () => {
    if (employeesData && employeesData.length > 0) {
      setSelectedEmployees(employeesData.map(emp => emp.id));
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedEmployees([]);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee to assign the shift to",
        variant: "destructive",
      });
      return;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Missing time information",
        description: "Please provide both start and end times for the shift",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare shift data
    const shiftData = {
      startTime: startDate,
      endTime: endDate,
      position,
      department,
      location,
      notes,
      requirements,
      status: 'scheduled',
    };
    
    setIsSubmitting(true);
    
    try {
      // Use bulk assign if multiple employees are selected
      if (selectedEmployees.length > 1) {
        const response = await shiftAssignmentService.bulkAssignShift(selectedEmployees, shiftData);
        
        if (response.error) {
          toast({
            title: "Error assigning shifts",
            description: response.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Shifts assigned",
            description: `Successfully assigned shifts to ${selectedEmployees.length} employees`,
          });
          
          // Reset form
          setSelectedEmployees([]);
          setNotes('');
          setRequirements('');
          
          if (onSuccess) {
            onSuccess();
          }
        }
      } 
      // Use single assign if only one employee is selected
      else if (selectedEmployees.length === 1) {
        const response = await shiftAssignmentService.assignShiftToUser(
          selectedEmployees[0], 
          shiftData
        );
        
        if (response.error) {
          toast({
            title: "Error assigning shift",
            description: response.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Shift assigned",
            description: "Successfully assigned shift to the selected employee",
          });
          
          // Reset form
          setSelectedEmployees([]);
          setNotes('');
          setRequirements('');
          
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (error) {
      console.error('Error during shift assignment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during shift assignment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Assign Shift to Employees
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Shift Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  id="start-time" 
                  type="datetime-local" 
                  className="pl-10"
                  value={startDate}
                  onChange={handleStartDateChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  id="end-time" 
                  type="datetime-local" 
                  className="pl-10"
                  value={endDate}
                  onChange={handleEndDateChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="barista">Barista</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="cook">Cook</SelectItem>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                placeholder="Department"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="main">Main Store</SelectItem>
                    <SelectItem value="downtown">Downtown</SelectItem>
                    <SelectItem value="mall">Mall Location</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Shift Notes</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Any additional information about this shift"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea 
              id="requirements" 
              value={requirements} 
              onChange={(e) => setRequirements(e.target.value)} 
              placeholder="Any specific requirements for this shift"
            />
          </div>

          {/* Employee Selection */}
          <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-medium">Available Employees</h3>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={selectAllEmployees}
                  disabled={isLoading || !employeesData || employeesData.length === 0}
                >
                  Select All
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={clearSelections}
                  disabled={selectedEmployees.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : employeesData && employeesData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {employeesData.map((employee) => (
                  <div 
                    key={employee.id} 
                    className="flex items-center space-x-2 border rounded p-2 hover:bg-gray-50"
                  >
                    <Checkbox 
                      checked={selectedEmployees.includes(employee.id)} 
                      id={`employee-${employee.id}`}
                      onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                    />
                    <Label 
                      htmlFor={`employee-${employee.id}`}
                      className="flex-grow cursor-pointer"
                    >
                      {employee.firstName} {employee.lastName}
                      {employee.position && (
                        <span className="text-xs text-gray-500 block">
                          {employee.position}
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No available employees found for the selected time period.</p>
                <p className="text-sm">Try adjusting the shift times.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {selectedEmployees.length} employees selected
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || selectedEmployees.length === 0}
            className="flex gap-2 items-center"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Assign Shift
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AssignShiftForm;
