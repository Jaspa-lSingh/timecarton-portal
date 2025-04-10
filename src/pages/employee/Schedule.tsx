
import React from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeeSchedule = () => {
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Shifts</h1>
          <span className="text-sm text-gray-500">April 2025</span>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Shifts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your upcoming shifts will appear here.</p>
            <div className="mt-4 p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md">
              <Calendar className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No shifts scheduled for the current period</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeSchedule;
