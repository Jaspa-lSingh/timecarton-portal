
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  HelpCircle, 
  Calendar, 
  Mail,
  CheckCircle2,
  XCircle,
  MessageCircle
} from 'lucide-react';

// Mock data for inquiries and leave requests
const mockInquiries = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'John Doe',
    subject: 'Schedule Clarification',
    message: 'I need clarification on the holiday schedule for December.',
    status: 'pending',
    createdAt: '2024-06-15T09:00:00',
    updatedAt: '2024-06-15T09:00:00'
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Jane Smith',
    subject: 'Payroll Question',
    message: 'My overtime hours seem incorrect on my last paycheck.',
    status: 'replied',
    adminReply: 'We have adjusted your overtime hours. The correction will appear in your next paycheck.',
    createdAt: '2024-06-10T14:00:00',
    updatedAt: '2024-06-12T11:30:00'
  }
];

const mockLeaveRequests = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'John Doe',
    startDate: '2024-07-01T00:00:00',
    endDate: '2024-07-05T00:00:00',
    reason: 'Family vacation',
    status: 'pending',
    createdAt: '2024-06-15T09:00:00',
    updatedAt: '2024-06-15T09:00:00'
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Mike Johnson',
    startDate: '2024-06-25T00:00:00',
    endDate: '2024-06-27T00:00:00',
    reason: 'Medical procedure',
    status: 'approved',
    adminReply: 'Approved. Get well soon!',
    createdAt: '2024-06-10T13:00:00',
    updatedAt: '2024-06-11T10:15:00'
  }
];

const InquiryCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inquiries");
  const [inquiries] = useState(mockInquiries);
  const [leaveRequests] = useState(mockLeaveRequests);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status === filter;
  });
  
  const filteredLeaveRequests = leaveRequests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleOpenResponseDialog = (item: any) => {
    setCurrentItem(item);
    setResponseMessage(item.adminReply || '');
    setIsResponseDialogOpen(true);
  };

  const handleSubmitResponse = () => {
    // In a real app, this would connect to an API
    toast.success(`Response submitted successfully!`);
    setIsResponseDialogOpen(false);
    setResponseMessage('');
  };

  const handleApprove = (id: string, type: 'inquiry' | 'leave') => {
    toast.success(`${type === 'inquiry' ? 'Inquiry' : 'Leave request'} #${id} approved!`);
  };

  const handleReject = (id: string, type: 'inquiry' | 'leave') => {
    toast.success(`${type === 'inquiry' ? 'Inquiry' : 'Leave request'} #${id} rejected!`);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'replied':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Replied</span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Employee Inquiries & Requests</h1>
          <div className="flex gap-2">
            <Input 
              placeholder="Search..." 
              className="w-64"
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="inquiries" className="flex items-center gap-1">
                <HelpCircle size={16} />
                <span>General Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="leave" className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Leave Requests</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <select 
                className="border rounded-md px-2 py-1 text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
          
          <TabsContent value="inquiries" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {filteredInquiries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>EMPLOYEE</TableHead>
                        <TableHead>SUBJECT</TableHead>
                        <TableHead>DATE</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell>#{inquiry.id}</TableCell>
                          <TableCell>{inquiry.employeeName}</TableCell>
                          <TableCell>{inquiry.subject}</TableCell>
                          <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 gap-1"
                                onClick={() => handleOpenResponseDialog(inquiry)}
                              >
                                <MessageCircle size={16} />
                                <span>Reply</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <HelpCircle className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No inquiries found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leave" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {filteredLeaveRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>EMPLOYEE</TableHead>
                        <TableHead>FROM</TableHead>
                        <TableHead>TO</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeaveRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>{formatDate(request.startDate)}</TableCell>
                          <TableCell>{formatDate(request.endDate)}</TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            {request.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApprove(request.id, 'leave')}
                                >
                                  <CheckCircle2 size={16} />
                                  <span>Approve</span>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 gap-1 text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(request.id, 'leave')}
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
                                onClick={() => handleOpenResponseDialog(request)}
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
                    <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">No leave requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'inquiries' ? 'Respond to Inquiry' : 'Respond to Leave Request'}
              </DialogTitle>
              <DialogDescription>
                {currentItem && (
                  <div className="mt-2 space-y-2">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-sm">{currentItem.employeeName}</p>
                      {activeTab === 'inquiries' ? (
                        <>
                          <p className="text-sm font-medium mt-1">{currentItem.subject}</p>
                          <p className="text-sm text-gray-600 mt-1">{currentItem.message}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Dates:</span> {formatDate(currentItem.startDate)} to {formatDate(currentItem.endDate)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{currentItem.reason}</p>
                        </>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted on {format(new Date(currentItem.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                Cancel
              </Button>
              {activeTab === 'leave' && currentItem?.status === 'pending' && (
                <>
                  <Button 
                    type="button"
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50 gap-1"
                    onClick={() => {
                      handleApprove(currentItem.id, 'leave');
                      setIsResponseDialogOpen(false);
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
                      handleReject(currentItem.id, 'leave');
                      setIsResponseDialogOpen(false);
                    }}
                  >
                    <XCircle size={16} />
                    <span>Reject</span>
                  </Button>
                </>
              )}
              <Button type="submit" onClick={handleSubmitResponse}>
                <Mail className="mr-2 h-4 w-4" />
                Send Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default InquiryCenter;
