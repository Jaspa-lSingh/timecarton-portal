
import React from 'react';
import { User } from '@/types';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Edit2,
  Trash2,
  Building,
  Phone,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface EmployeeTableProps {
  employees: User[];
  isLoading: boolean;
  onEdit: (employee: User) => void;
  onDelete: (id: string) => void;
  error?: string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="flex flex-col items-center justify-center text-red-500 space-y-2">
          <AlertCircle className="h-10 w-10" />
          <h3 className="font-semibold text-lg">Error Loading Employees</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-4 max-w-md">
            <h4 className="font-medium text-amber-700">Setup Steps</h4>
            <ol className="text-sm text-amber-600 mt-1 list-decimal pl-5 space-y-1">
              <li>Go to your Supabase project dashboard</li>
              <li>Create the required database tables (users table)</li>
              <li>Set up RLS policies for accessing data</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering employee table with employees:', employees);
  
  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No employees found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                <Link to={`/admin/employees/${employee.id}`} className="hover:underline">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      {employee.avatar ? (
                        <img
                          src={employee.avatar}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-brand-100 text-brand-700 font-semibold">
                          {employee.firstName?.[0] || ''}
                          {employee.lastName?.[0] || ''}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {employee.firstName || ''} {employee.lastName || ''}
                        {!employee.firstName && !employee.lastName && employee.email ? 
                          <span className="italic">{employee.email}</span> : null}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.email}
                      </div>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{employee.employeeId || 'N/A'}</TableCell>
              <TableCell>{employee.position || 'N/A'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-gray-400" />
                  <span>{employee.department || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    <span>{employee.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{employee.address?.city ? `${employee.address.city}, ${employee.address.state}` : 'N/A'}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(employee)}
                  className="h-8 w-8 p-0 mr-1"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log(`Delete button clicked for employee ID: ${employee.id}`);
                    onDelete(employee.id);
                  }}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
