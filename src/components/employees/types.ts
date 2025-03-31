
import { User } from '@/types';
import { z } from 'zod';

export const employeeSchema = z.object({
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

export type EmployeeFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  employeeId: string;
  department: string;
  hourlyRate?: number;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

export interface EmployeeFormProps {
  employee: Partial<User>;
  onSubmit: (values: EmployeeFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
}
