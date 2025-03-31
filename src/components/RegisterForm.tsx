
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, employeeService } from '@/services';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema, RegisterFormValues } from './forms/RegisterFormSchema';
import UserDetailsFields from './forms/UserDetailsFields';
import PasswordFields from './forms/PasswordFields';
import RoleSelector from './forms/RoleSelector';
import AdditionalInfoFields from './forms/AdditionalInfoFields';
import AddressFields from './forms/AddressFields';
import DepartmentField from './forms/DepartmentField';
import ProfilePhotoUpload from './forms/ProfilePhotoUpload';

const RegisterForm: React.FC<{ adminCreated?: boolean }> = ({ adminCreated = false }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: adminCreated ? 'employee' : 'admin',
      position: '',
      hourlyRate: undefined,
      phoneNumber: '',
      employeeId: '',
      department: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      }
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = values;
      
      const result = await authService.register(userData.email, values.password, userData);
      
      if (result.error) {
        toast({
          title: 'Registration Failed',
          description: result.error,
          variant: 'destructive'
        });
        setIsLoading(false);
      } else {
        // If we have a photo file and the user was created successfully, upload the photo
        if (photoFile && result.data?.id) {
          try {
            console.log("Uploading photo for user:", result.data.id);
            const photoResult = await employeeService.uploadProfilePhoto(result.data.id, photoFile);
            
            if (photoResult.error) {
              console.error("Photo upload failed:", photoResult.error);
              toast({
                title: 'Profile Photo Upload Failed',
                description: photoResult.error,
                variant: 'destructive'
              });
            } else {
              console.log("Photo uploaded successfully:", photoResult.data);
            }
          } catch (photoError) {
            console.error("Error during photo upload:", photoError);
            toast({
              title: 'Profile Photo Upload Error',
              description: 'An error occurred while uploading the profile photo',
              variant: 'destructive'
            });
          }
        }
        
        toast({
          title: 'Registration Successful',
          description: result.message || 'Account created successfully!'
        });
        
        // If admin is creating an employee, stay on the page
        if (adminCreated) {
          form.reset();
          setPhotoFile(null);
        } else {
          // Otherwise redirect to login
          navigate('/login');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {adminCreated ? 'Add New Employee' : 'Create Account'}
          </h1>
          <p className="text-gray-500">
            {adminCreated 
              ? 'Enter employee details to add them to the system'
              : 'Enter your details to create your account'}
          </p>
        </div>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserDetailsFields form={form} />
            <PasswordFields form={form} />
            <RoleSelector form={form} adminCreated={adminCreated} />
            
            <Separator className="my-4" />
            
            <AdditionalInfoFields form={form} />
            <DepartmentField form={form} />
            <AddressFields form={form} />
            <ProfilePhotoUpload onFileSelected={setPhotoFile} />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : adminCreated ? 'Add Employee' : 'Create Account'}
            </Button>
            
            {!adminCreated && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate('/login')}>
                  Already have an account? Log in
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default RegisterForm;
