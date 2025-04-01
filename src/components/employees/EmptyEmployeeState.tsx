
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

interface EmptyEmployeeStateProps {
  isFetched: boolean;
  handleRefresh: () => void;
}

const EmptyEmployeeState: React.FC<EmptyEmployeeStateProps> = ({ 
  isFetched,
  handleRefresh 
}) => {
  return (
    <div className="text-center py-10">
      <p className="mb-2 text-lg text-gray-500">No employees found</p>
      <p className="text-sm mb-6 text-gray-400">Try adding employees using the "Add Employee" button above</p>
      
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-md mx-auto max-w-lg">
        <h3 className="font-medium text-blue-700 mb-4 text-lg flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Synchronization Status
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 pb-3 border-b border-blue-100">
            <div className={`mt-1 ${isFetched ? 'text-green-500' : 'text-amber-500'}`}>
              {isFetched ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            <div className="text-left">
              <h4 className="font-medium text-blue-800">Data Fetch Attempt</h4>
              <p className="text-sm text-blue-600">
                {isFetched 
                  ? "Data fetch completed. No employees were found." 
                  : "Data fetch in progress..."}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Debugging Information:</h4>
            <ul className="text-sm text-blue-600 list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Authentication:</span> You are logged in as an admin user
              </li>
              <li>
                <span className="font-medium">Database Connection:</span> Connected to Supabase
              </li>
              <li>
                <span className="font-medium">User Synchronization:</span> Auth users will be synced to the users table on refresh
              </li>
              <li>
                <span className="font-medium">Row Level Security:</span> Ensure your RLS policies allow admin users to view all employees
              </li>
            </ul>
          </div>
          
          <Button onClick={handleRefresh} variant="default" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" /> 
            Sync and Refresh Employees
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyEmployeeState;
