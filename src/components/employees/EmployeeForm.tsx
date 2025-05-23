
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PersonalInfoFields from './form/PersonalInfoFields';
import EmploymentFields from './form/EmploymentFields';
import AddressFields from './form/AddressFields';
import PhotoUpload from './form/PhotoUpload';
import FormActions from './form/FormActions';
import { employeeSchema, EmployeeFormProps, EmployeeFormValues } from './types';

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
      hourlyRate: employee.hourlyRate || 0,
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
    console.log('Form values being submitted:', values);
    
    // Ensure required fields are present with defaults
    const completeValues = {
      ...values,
      // Set defaults for any potentially missing fields to avoid database constraint issues
      firstName: values.firstName || '',
      lastName: values.lastName || '',
      email: values.email || '',
      position: values.position || '',
      employeeId: values.employeeId || '',
      department: values.department || '',
      hourlyRate: values.hourlyRate || 0,
      phoneNumber: values.phoneNumber || '',
      address: {
        street: values.address?.street || '',
        city: values.address?.city || '',
        state: values.address?.state || '',
        country: values.address?.country || '',
        zipCode: values.address?.zipCode || '',
      }
    };
    
    // Pass the photo file to be handled by the parent component
    onSubmit(completeValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
        <PersonalInfoFields form={form} />
        <EmploymentFields form={form} />
        <AddressFields form={form} />
        <Separator />
        <PhotoUpload 
          employee={employee}
          photoFile={photoFile}
          onPhotoChange={handleFileChange}
        />
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
        />
      </form>
    </Form>
  );
};

export default EmployeeForm;
