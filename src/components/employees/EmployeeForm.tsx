
import React, { useState } from 'react';
import { User } from '@/types';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DepartmentField from '@/components/forms/DepartmentField';

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  position: z.string().optional(),
  employeeId: z.string().optional(),
  department: z.string().optional(),
  hourlyRate: z.number().optional(),
  phoneNumber: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee: Partial<User>;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
  isSubmitting,
  isUploading,
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      position: employee.position || '',
      employeeId: employee.employeeId || '',
      department: employee.department || '',
      hourlyRate: employee.hourlyRate,
      phoneNumber: employee.phoneNumber || '',
      address: {
        street: employee.address?.street || '',
        city: employee.address?.city || '',
        state: employee.address?.state || '',
        country: employee.address?.country || '',
        zipCode: employee.address?.zipCode || '',
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Toast would be shown by parent component
      return;
    }
    
    setPhotoFile(file);
  };

  const handleFormSubmit = (values: EmployeeFormValues) => {
    onSubmit(values);
    // The parent will handle the photo upload
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DepartmentField form={form} />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <h3 className="text-lg font-medium">Address</h3>
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <FormLabel>Profile Photo</FormLabel>
          <div className="flex items-center space-x-4 mt-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={photoFile ? URL.createObjectURL(photoFile) : employee.avatar} />
              <AvatarFallback>
                {employee.firstName?.[0]}{employee.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Maximum file size: 5MB
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {(isSubmitting || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Employee
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmployeeForm;
