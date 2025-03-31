
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepartmentFieldProps {
  form: UseFormReturn<any>;  // Using 'any' to support both RegisterFormValues and EmployeeFormValues
}

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "Customer Service",
  "Finance",
  "Human Resources",
  "Operations",
  "Research & Development",
  "Information Technology",
  "Legal",
  "Executive",
  "Other"
];

const DepartmentField: React.FC<DepartmentFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DepartmentField;
