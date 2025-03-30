
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './RegisterFormSchema';

interface RoleSelectorProps {
  form: UseFormReturn<RegisterFormValues>;
  adminCreated: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ form, adminCreated }) => {
  if (adminCreated) {
    return null; // Don't render if admin is creating a user
  }

  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <FormControl>
            <RadioGroup 
              value={field.value} 
              onValueChange={field.onChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employee" id="employee" />
                <Label htmlFor="employee" className="cursor-pointer">Employee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin" className="cursor-pointer">Administrator</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RoleSelector;
