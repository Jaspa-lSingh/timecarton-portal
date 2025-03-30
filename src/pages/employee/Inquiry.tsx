
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Eye } from 'lucide-react';
import { toast } from "sonner";

// Mock data
const inquiries = [
  {
    id: "1",
    employee: "jaspal875626@gmail.com",
    subject: "Hello Sir,",
    message: "I can be late little bit",
    status: "Replied",
    adminReply: "okk make sure do not be too much late"
  },
  {
    id: "2",
    employee: "jaspal875626@gmail.com",
    subject: "pay",
    message: "recived",
    status: "Replied",
    adminReply: "ok"
  },
  {
    id: "3",
    employee: "jaspal875626@gmail.com",
    subject: "dfd",
    message: "dfd",
    status: "Replied",
    adminReply: "dfd"
  }
];

const leaveRequests = [
  {
    id: "1",
    startDate: "2024-06-10",
    endDate: "2024-06-12",
    reason: "Family vacation",
    status: "pending"
  },
  {
    id: "2",
    startDate: "2024-07-05",
    endDate: "2024-07-05",
    reason: "Medical appointment",
    status: "approved"
  }
];

const announcements = [
  {
    id: "1",
    title: "Schedule Change",
    message: "There will be a change in the summer schedule starting July 1st.",
    date: "2024-06-01"
  },
  {
    id: "2",
    title: "Staff Meeting",
    message: "Mandatory staff meeting on June 15th at 10 AM.",
    date: "2024-05-28"
  }
];

const InquiryCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inquiries");
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  
  // Form states
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  
  const submitInquiry = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Inquiry submitted successfully!");
    setInquiryDialogOpen(false);
    setSubject('');
    setMessage('');
  };

  const submitLeaveRequest = () => {
    if (!startDate || !endDate || !leaveReason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Leave request submitted successfully!");
    setLeaveDialogOpen(false);
    setStartDate('');
    setEndDate('');
    setLeaveReason('');
  };
  
  const viewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'replied':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Replied</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <EmployeeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Inquiry Center</h1>
        
        <Tabs defaultValue="inquiries" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inquiries" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Inquiries</h2>
              <Button onClick={() => setInquiryDialogOpen(true)}>New Inquiry</Button>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>EMPLOYEE</TableHead>
                      <TableHead>SUBJECT</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>ADMIN REPLY</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>{`#${inquiry.id}`}</TableCell>
                        <TableCell>{inquiry.employee}</TableCell>
                        <TableCell>{inquiry.subject}</TableCell>
                        <TableCell>
                          {getStatusBadge(inquiry.status)}
                        </TableCell>
                        <TableCell>{inquiry.adminReply}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => viewInquiry(inquiry)}
                          >
                            <Eye size={16} />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* New Inquiry Dialog */}
            <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Inquiry</DialogTitle>
                  <DialogDescription>
                    Submit your inquiry to the management team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter subject"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message"
                      rows={5}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInquiryDialogOpen(false)}>Cancel</Button>
                  <Button onClick={submitInquiry}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View Inquiry Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inquiry Details</DialogTitle>
                </DialogHeader>
                {selectedInquiry && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                      <p className="mt-1">{selectedInquiry.subject}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Message</h3>
                      <p className="mt-1">{selectedInquiry.message}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Admin Reply</h3>
                      <p className="mt-1">{selectedInquiry.adminReply || 'No reply yet'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="leave" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Leave Requests</h2>
              <Button onClick={() => setLeaveDialogOpen(true)}>Request Leave</Button>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {leaveRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>START DATE</TableHead>
                        <TableHead>END DATE</TableHead>
                        <TableHead>REASON</TableHead>
                        <TableHead>STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{`#${request.id}`}</TableCell>
                          <TableCell>{formatDate(request.startDate)}</TableCell>
                          <TableCell>{formatDate(request.endDate)}</TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 mb-4">No leave requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leave Request Dialog */}
            <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Leave</DialogTitle>
                  <DialogDescription>
                    Submit a new leave request.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input 
                      id="start-date" 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input 
                      id="end-date" 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea 
                      id="reason" 
                      value={leaveReason} 
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Explain the reason for your leave request"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
                  <Button onClick={submitLeaveRequest}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Announcements</h2>
            </div>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-lg">{announcement.title}</h3>
                          <span className="text-sm text-gray-500">{formatDate(announcement.date)}</span>
                        </div>
                        <p className="text-gray-700">{announcement.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 mb-4">No announcements found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default InquiryCenter;
