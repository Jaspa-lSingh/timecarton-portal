
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from "sonner";

// Mock shift requests data
const mockSwapRequests = [
  {
    id: '1',
    employeeId: '2',
    myShiftDate: '2024-06-15T09:00:00',
    targetShiftDate: '2024-06-16T09:00:00',
    reason: 'Family event',
    status: 'pending'
  },
  {
    id: '2',
    employeeId: '2',
    myShiftDate: '2024-07-02T10:00:00',
    targetShiftDate: '2024-07-03T10:00:00',
    reason: 'Medical appointment',
    status: 'approved'
  }
];

const mockCoverRequests = [
  {
    id: '3',
    employeeId: '2',
    shiftDate: '2024-06-20T14:00:00',
    reason: 'Personal emergency',
    status: 'pending'
  },
  {
    id: '4',
    employeeId: '3',
    shiftDate: '2024-06-22T08:00:00',
    reason: 'Doctor appointment',
    status: 'pending'
  }
];

const ShiftChanges: React.FC = () => {
  const [activeTab, setActiveTab] = useState("cover-up");
  const [swapRequests] = useState(mockSwapRequests);
  const [coverRequests] = useState(mockCoverRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState<'swap' | 'cover'>('cover');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy - h:mm a');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const handleSubmitRequest = () => {
    // In a real app, this would connect to an API
    toast.success(`${requestType === 'swap' ? 'Swap' : 'Cover-up'} request submitted successfully!`);
    setIsDialogOpen(false);
    setReason('');
    setDate('');
    setTargetDate('');
  };

  const handleOpenRequestDialog = (type: 'swap' | 'cover') => {
    setRequestType(type);
    setIsDialogOpen(true);
  };

  return (
    <EmployeeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shift Changes</h1>
        
        <Tabs defaultValue="cover-up" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="cover-up">Cover-Up Shift</TabsTrigger>
            <TabsTrigger value="swap">Swap Shift</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cover-up" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cover-Up Requests</h2>
              <Button onClick={() => handleOpenRequestDialog('cover')}>Request Cover-Up</Button>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {coverRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>DATE & TIME</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coverRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>{formatDate(request.shiftDate)}</TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 mb-4">No cover-up requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="swap" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shift Swap Requests</h2>
              <Button onClick={() => handleOpenRequestDialog('swap')}>Request Swap</Button>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {swapRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>MY SHIFT</TableHead>
                        <TableHead>TARGET SHIFT</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {swapRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>{formatDate(request.myShiftDate)}</TableCell>
                          <TableCell>{formatDate(request.targetShiftDate)}</TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 mb-4">No swap requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Request Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{requestType === 'swap' ? 'Request Shift Swap' : 'Request Cover-Up'}</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit your request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shift-date" className="text-right">
                  {requestType === 'swap' ? 'My Shift' : 'Shift Date'}
                </Label>
                <Input
                  id="shift-date"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {requestType === 'swap' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target-date" className="text-right">
                    Target Shift
                  </Label>
                  <Input
                    id="target-date"
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitRequest}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </EmployeeLayout>
  );
};

export default ShiftChanges;
