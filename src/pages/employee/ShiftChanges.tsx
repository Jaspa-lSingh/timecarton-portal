
import React, { useState } from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Repeat, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const EmployeeShiftChanges = () => {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [swapReason, setSwapReason] = useState<string>("");
  const { toast } = useToast();
  
  const handleRequestSwap = () => {
    // In a real app, this would call an API to create a shift swap request
    toast({
      title: "Shift swap requested",
      description: "Your request has been submitted for approval",
    });
    
    setRequestDialogOpen(false);
    setSelectedShift("");
    setSwapReason("");
  };
  
  // Mock data - would come from API in real app
  const myShifts = [
    { id: "1", date: "April 15, 2025", time: "9:00 AM - 5:00 PM" },
    { id: "2", date: "April 18, 2025", time: "10:00 AM - 6:00 PM" },
    { id: "3", date: "April 21, 2025", time: "8:00 AM - 4:00 PM" },
  ];

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
            <p className="text-gray-500 mb-4">Request to swap shifts with other employees.</p>
            <div className="mt-4">
              <Button onClick={() => setRequestDialogOpen(true)}>Request Shift Swap</Button>
            </div>
            
            {/* Request Dialog */}
            <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Shift Swap</DialogTitle>
                  <DialogDescription>
                    Select which shift you'd like to swap and provide a reason.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="shift">Select Shift</Label>
                    <Select value={selectedShift} onValueChange={setSelectedShift}>
                      <SelectTrigger id="shift">
                        <SelectValue placeholder="Select a shift" />
                      </SelectTrigger>
                      <SelectContent>
                        {myShifts.map(shift => (
                          <SelectItem key={shift.id} value={shift.id}>
                            {shift.date} ({shift.time})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Swap</Label>
                    <textarea 
                      id="reason"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Briefly explain why you need to swap this shift"
                      value={swapReason}
                      onChange={(e) => setSwapReason(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleRequestSwap}
                    disabled={!selectedShift || !swapReason}
                  >
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
