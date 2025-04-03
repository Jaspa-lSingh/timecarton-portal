
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { AssignShiftForm } from '@/components/shifts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AssignShiftsPage = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Optionally navigate back to the schedule page after successful assignment
    // navigate('/admin/schedule');
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate('/admin/schedule')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assign Shifts</h1>
            <p className="text-gray-500">Assign shifts to employees</p>
          </div>
        </div>
        
        <AssignShiftForm onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
  );
};

export default AssignShiftsPage;
