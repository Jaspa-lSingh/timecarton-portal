
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from 'date-fns';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarRange,
  Calendar,
  Search
} from 'lucide-react';

// Mock shift requests data
const mockSwapRequests = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'John Doe',
    myShiftDate: '2024-06-15T09:00:00',
    myShiftTime: '9:00 AM - 5:00 PM',
    targetShiftDate: '2024-06-16T09:00:00',
    targetShiftTime: '9:00 AM - 5:00 PM',
    reason: 'Family event',
    status: 'pending',
    requestDate: '2024-06-10T14:30:00'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Jane Smith',
    myShiftDate: '2024-07-02T10:00:00',
    myShiftTime: '10:00 AM - 6:00 PM',
    targetShiftDate: '2024-07-03T10:00:00',
    targetShiftTime: '10:00 AM - 6:00 PM',
    reason: 'Medical appointment',
    status: 'approved',
    adminNotes: 'Approved as requested',
    requestDate: '2024-06-25T11:20:00'
  }
];

const mockCoverRequests = [
  {
    id: '3',
    employeeId: '2',
    employeeName: 'John Doe',
    shiftDate: '2024-06-20T14:00:00',
    shiftTime: '2:00 PM - 10:00 PM',
    reason: 'Personal emergency',
    status: 'pending',
    requestDate: '2024-06-15T08:45:00'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Mike Johnson',
    shiftDate: '2024-06-22T08:00:00',
    shiftTime: '8:00 AM - 4:00 PM',
    reason: 'Doctor appointment',
    status: 'rejected',
    adminNotes: 'No available coverage',
    requestDate: '2024-06-17T16:30:00'
  }
];

const ShiftChanges: React.FC = () => {
  const [activeTab, setActiveTab] = useState("swap");
  const [swapRequests] = useState(mockSwapRequests);
  const [coverRequests] = useState(mockCoverRequests);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSwapRequests = swapRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = 
      searchQuery === '' || 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });
  
  const filteredCoverRequests = coverRequests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = 
      searchQuery === '' || 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.includes(searchQuery);
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleOpenDetailDialog = (request: any) => {
    setCurrentRequest(request);
    setAdminNotes(request.adminNotes || '');
    setIsDetailDialogOpen(true);
  };

  const handleApprove = (id: string, type: 'swap' | 'cover') => {
    // In a real app, this would connect to an API
    toast.success(`${type === 'swap' ? 'Shift swap' : 'Cover'} request #${id} approved!`);
    setIsDetailDialogOpen(false);
  };

  const handleReject = (id: string, type: 'swap' | 'cover') => {
    toast.success(`${type === 'swap' ? 'Shift swap' : 'Cover'} request #${id} rejected!`);
    setIsDetailDialogOpen(false);
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

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shift Change Management</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search employee or ID..." 
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="swap" className="flex items-center gap-1">
                <RefreshCw size={16} />
                <span>Shift Swap Requests</span>
              </TabsTrigger>
              <TabsTrigger value="cover" className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Cover Requests</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <select 
                className="border rounded-md px-2 py-1 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <TabsContent value="swap" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {filteredSwapRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>EMPLOYEE</TableHead>
                        <TableHead>CURRENT SHIFT</TableHead>
                        <TableHead>TARGET SHIFT</TableHead>
                        <TableHead>REQUEST DATE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSwapRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(request.myShiftDate)}</span>
                              <span className="text-xs text-gray-500">{request.myShiftTime}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatDate(request.targetShiftDate)}</span>
                              <span className="text-xs text-gray-500">{request.targetShiftTime}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(request.requestDate)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            {request.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(request.id, 'swap')}
                                >
                                  <CheckCircle2 size={16} />
                                  <span>Approve</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(request.id, 'swap')}
                                >
                                  <XCircle size={16} />
                                  <span>Reject</span>
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={() => handleOpenDetailDialog(request)}
                              >
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <RefreshCw className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No swap requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cover" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {filteredCoverRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>EMPLOYEE</TableHead>
                        <TableHead>SHIFT DATE</TableHead>
                        <TableHead>SHIFT TIME</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCoverRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>{formatDate(request.shiftDate)}</TableCell>
                          <TableCell>{request.shiftTime}</TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            {request.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(request.id, 'cover')}
                                >
                                  <CheckCircle2 size={16} />
                                  <span>Approve</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(request.id, 'cover')}
                                >
                                  <XCircle size={16} />
                                  <span>Reject</span>
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={() => handleOpenDetailDialog(request)}
                              >
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Clock className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No cover requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'swap' ? 'Shift Swap Request Details' : 'Cover Request Details'}
              </DialogTitle>
              <DialogDescription>
                {currentRequest && (
                  <div className="mt-2 space-y-2">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-sm">{currentRequest.employeeName}</p>
                      {activeTab === 'swap' ? (
                        <>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-gray-500">Current Shift:</p>
                              <p className="text-sm">{formatDate(currentRequest.myShiftDate)}</p>
                              <p className="text-xs text-gray-600">{currentRequest.myShiftTime}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Target Shift:</p>
                              <p className="text-sm">{formatDate(currentRequest.targetShiftDate)}</p>
                              <p className="text-xs text-gray-600">{currentRequest.targetShiftTime}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Shift:</span> {formatDate(currentRequest.shiftDate)}
                          </p>
                          <p className="text-xs text-gray-600">{currentRequest.shiftTime}</p>
                        </>
                      )}
                      <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Reason:</span> {currentRequest.reason}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Requested on {format(new Date(currentRequest.requestDate), 'MMM dd, yyyy')}
                      </p>
                      
                      {(currentRequest.status === 'approved' || currentRequest.status === 'rejected') && currentRequest.adminNotes && (
                        <div className="mt-2 p-2 bg-gray-100 rounded">
                          <p className="text-xs text-gray-500">Admin Notes:</p>
                          <p className="text-sm">{currentRequest.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            {currentRequest?.status === 'pending' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this request..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="flex justify-end gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                {currentRequest?.status === 'pending' ? 'Cancel' : 'Close'}
              </Button>
              
              {currentRequest?.status === 'pending' && (
                <>
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50 gap-1"
                    onClick={() => {
                      handleApprove(
                        currentRequest.id, 
                        activeTab === 'swap' ? 'swap' : 'cover'
                      );
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve</span>
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 gap-1"
                    onClick={() => {
                      handleReject(
                        currentRequest.id, 
                        activeTab === 'swap' ? 'swap' : 'cover'
                      );
                    }}
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ShiftChanges;
