
import React from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmployeeTimeTracking = () => {
  return (
    <EmployeeLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Time & Attendance</h1>
          <span className="text-sm text-gray-500">Today: {new Date().toLocaleDateString()}</span>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Clock In/Out</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Button className="w-full md:w-auto">Clock In</Button>
              <Button variant="outline" className="w-full md:w-auto">Clock Out</Button>
              <div className="ml-auto text-right">
                <p className="text-sm text-gray-500">Current Status:</p>
                <p className="font-medium">Not Clocked In</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your recent time entries will appear here.</p>
            <div className="mt-4 p-8 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-md">
              <Clock className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeTimeTracking;
