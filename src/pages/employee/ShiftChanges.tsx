
import React from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmployeeShiftChanges = () => {
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Shift Changes</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              <span>Shift Swap Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Request to swap shifts with other employees.</p>
            <div className="mt-4">
              <Button>Request Shift Swap</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your pending shift change requests will appear here.</p>
            <div className="mt-4 p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md">
              <Repeat className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No pending shift change requests</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeShiftChanges;
