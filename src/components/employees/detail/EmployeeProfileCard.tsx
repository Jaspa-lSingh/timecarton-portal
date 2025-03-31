
import React from 'react';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Building, UserCircle } from 'lucide-react';

interface EmployeeProfileCardProps {
  employee: User;
}

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ employee }) => {
  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6 flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-4">
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-brand-100 text-brand-700 text-5xl font-semibold">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-center">
          {employee.firstName} {employee.lastName}
        </h2>
        <p className="text-gray-500 text-center mb-4">{employee.position || 'No Position'}</p>
        
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{employee.phoneNumber || 'No phone number'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-gray-400" />
            <span>{employee.department || 'No department'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UserCircle className="h-4 w-4 text-gray-400" />
            <span>Employee ID: {employee.employeeId || 'Not assigned'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileCard;
