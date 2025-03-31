
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface EmployeeHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeHeader: React.FC<EmployeeHeaderProps> = ({ onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/employees')}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back to Employees
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit size={16} /> Edit
        </Button>
        <Button
          variant="destructive"
          className="flex items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 size={16} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default EmployeeHeader;
