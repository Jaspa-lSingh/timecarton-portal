
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  isUploading,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || isUploading}
      >
        {(isSubmitting || isUploading) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Update Employee
      </Button>
    </div>
  );
};

export default FormActions;
