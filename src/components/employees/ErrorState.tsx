
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: Error | string;
  handleRefresh: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, handleRefresh }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <div className="p-6">
      <div className="text-center py-10">
        <div className="flex flex-col items-center justify-center text-red-500 space-y-2">
          <AlertCircle className="h-10 w-10" />
          <h2 className="text-xl font-bold mb-2">Error loading employees</h2>
          <p className="mb-4">{errorMessage}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-4 max-w-md mx-auto">
          <h3 className="font-medium text-amber-700 mb-2">Troubleshooting steps:</h3>
          <ol className="text-sm text-amber-600 list-decimal pl-5 space-y-1 text-left">
            <li>Check that your Supabase database has the users table properly set up</li>
            <li>Verify that Row Level Security (RLS) policies allow you to view all users</li>
            <li>Confirm you're properly authenticated with admin privileges</li>
          </ol>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="mt-6">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
