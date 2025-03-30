
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center border rounded-md pl-3">
      <Search className="h-4 w-4 text-gray-400" />
      <Input
        className="border-0 focus-visible:ring-0"
        placeholder="Search employees..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default EmployeeSearch;
