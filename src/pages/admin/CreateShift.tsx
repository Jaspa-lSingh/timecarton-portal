
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { employeeService, shiftService } from '@/services';
import { User, Shift } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, Clock, Users, Building, MapPin } from 'lucide-react';

// Define form schema
const shiftFormSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().min(1, "Location is required"),
  requirements: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  assignType: z.enum(['individual', 'department']),
  departmentToAssign: z.string().optional(),
  employees: z.array(z.string()).optional(),
  scheduleType: z.enum(['single_day', 'week', 'month']),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
});

type ShiftFormValues = z.infer<typeof shiftFormSchema>;

const CreateShiftPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [allEmployees, setAllEmployees] = useState<User[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Configure the form
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      startTime: "",
      endTime: "",
      location: "",
      requirements: "",
      department: "",
      position: "",
      notes: "",
      assignType: "individual",
      departmentToAssign: "",
      employees: [],
      scheduleType: "single_day",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
    },
  });

  // Fetch all employees
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeeService.getEmployees();
      if (response.error) throw new Error(response.error);
      return response.data || [];
    },
  });

  // Create shift mutation
  const createShiftMutation = useMutation({
    mutationFn: async (values: ShiftFormValues) => {
      let response;
      
      // Prepare base shift data
      const shiftData: Partial<Shift> = {
        startTime: `${values.startDate}T${values.startTime}:00`,
        endTime: `${values.startDate}T${values.endTime}:00`,
        location: values.location,
        department: values.department,
        position: values.position,
        notes: values.notes,
        requirements: values.requirements,
        status: 'pending',
      };
      
      // Handle different assignment types
      if (values.assignType === 'department' && values.departmentToAssign) {
        // Assign to department
        response = await shiftService.assignShiftToDepartment(shiftData, values.departmentToAssign);
      } else {
        // Assign to selected employees
        if (!selectedEmployees.length) {
          throw new Error("No employees selected for shift assignment");
        }
        
        response = await shiftService.assignShiftToEmployees(shiftData, selectedEmployees);
      }
      
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast({
        title: 'Success',
        description: 'Shift(s) created successfully',
      });
      navigate('/admin/schedule');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Watch for changes to departments and assignment type
  const assignType = form.watch('assignType');
  const departmentFilter = form.watch('department');
  const departmentToAssign = form.watch('departmentToAssign');
  
  // Update employees when department changes
  useEffect(() => {
    setAllEmployees(employees);
    
    if (departmentFilter) {
      const filtered = employees.filter(emp => emp.department === departmentFilter);
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [employees, departmentFilter]);

  // Update selected employees when department to assign changes
  useEffect(() => {
    if (assignType === 'department' && departmentToAssign) {
      const deptEmployees = employees.filter(emp => emp.department === departmentToAssign);
      setSelectedEmployees(deptEmployees.map(emp => emp.id));
    }
  }, [assignType, departmentToAssign, employees]);

  // Get unique departments from employees
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  // Handle form submission
  const onSubmit = (values: ShiftFormValues) => {
    // Set the employees in the form
    form.setValue('employees', selectedEmployees);
    
    // Create shifts based on schedule type
    createShiftMutation.mutate(values);
  };

  // Handle employee selection
  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  // Handle select all employees
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(employee => employee.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Shift</h1>
          <p className="text-gray-500">Create and assign shifts to employees</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shift Details</CardTitle>
            <CardDescription>
              Enter the details for the new shift and assign it to employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                <Input type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduleType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Schedule Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select schedule type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single_day">Single Day</SelectItem>
                                <SelectItem value="week">Weekly</SelectItem>
                                <SelectItem value="month">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch('scheduleType') !== 'single_day' && (
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                <Input type="date" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                <Input type="time" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                <Input type="time" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                              <Input placeholder="Enter location" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter position" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any specific requirements for this shift"
                              {...field}
                              className="h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional notes"
                              {...field}
                              className="h-20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="assignType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="How to assign shifts" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="individual">Individual Employees</SelectItem>
                              <SelectItem value="department">Entire Department</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {assignType === 'department' ? (
                      <FormField
                        control={form.control}
                        name="departmentToAssign"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department to Assign</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept} ({employees.filter(emp => emp.department === dept).length} employees)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <FormLabel>Select Employees</FormLabel>
                          <div className="flex items-center">
                            <Checkbox
                              id="select-all"
                              checked={selectAll}
                              onCheckedChange={handleSelectAll}
                            />
                            <label htmlFor="select-all" className="ml-2 text-sm">
                              Select All
                            </label>
                          </div>
                        </div>
                        
                        <div className="border rounded-md h-[350px] overflow-y-auto p-2">
                          {isLoadingEmployees ? (
                            <div className="h-full flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                          ) : filteredEmployees.length > 0 ? (
                            <div className="space-y-2">
                              {filteredEmployees.map((employee) => (
                                <div
                                  key={employee.id}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md"
                                >
                                  <Checkbox
                                    id={employee.id}
                                    checked={selectedEmployees.includes(employee.id)}
                                    onCheckedChange={() => handleEmployeeSelection(employee.id)}
                                  />
                                  <label htmlFor={employee.id} className="flex items-center cursor-pointer w-full">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                                      {employee.avatar ? (
                                        <img
                                          src={employee.avatar}
                                          alt=""
                                          className="h-full w-full object-cover"
                                        />
                                      ) : (
                                        <span className="font-medium">
                                          {employee.firstName[0]}
                                          {employee.lastName[0]}
                                        </span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {employee.firstName} {employee.lastName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {employee.position || 'No position'}
                                        {employee.department && ` • ${employee.department}`}
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                              No employees found in this department
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {selectedEmployees.length} employee(s) selected
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <CardFooter className="flex justify-between px-0 border-t pt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/admin/schedule')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createShiftMutation.isPending}
                  >
                    {createShiftMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Shift
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateShiftPage;
