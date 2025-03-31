
import React, { useState } from 'react';
import { User } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmployeeDetailTabsProps {
  employee: User;
}

const EmployeeDetailTabs: React.FC<EmployeeDetailTabsProps> = ({ employee }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <h3 className="font-medium text-lg">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">First Name</h4>
                <p>{employee.firstName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Name</h4>
                <p>{employee.lastName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{employee.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p>{employee.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <h3 className="font-medium text-lg">Employment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Employee ID</h4>
                <p>{employee.employeeId || 'Not assigned'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Department</h4>
                <p>{employee.department || 'Not assigned'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Position</h4>
                <p>{employee.position || 'Not assigned'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Role</h4>
                <p className="capitalize">{employee.role || 'Employee'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <h3 className="font-medium text-lg">Address Information</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Street Address</h4>
                <p>{employee.address?.street || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">City</h4>
                  <p>{employee.address?.city || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">State</h4>
                  <p>{employee.address?.state || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ZIP Code</h4>
                  <p>{employee.address?.zipCode || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Country</h4>
                <p>{employee.address?.country || 'Not provided'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <h3 className="font-medium text-lg">Payroll Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Hourly Rate</h4>
                <p>
                  {employee.hourlyRate 
                    ? `$${parseFloat(employee.hourlyRate.toString()).toFixed(2)}`
                    : 'Not set'}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        {/* The content is now properly managed by TabsContent components inside the Tabs component */}
      </CardContent>
    </Card>
  );
};

export default EmployeeDetailTabs;
