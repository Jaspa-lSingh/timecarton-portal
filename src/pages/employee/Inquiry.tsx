
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
import EmployeeLayout from '@/components/layouts/EmployeeLayout';

// Mock data
const inquiries = [
  {
    id: "#1",
    employee: "jaspal875626@gmail.com",
    subject: "Hello Sir,",
    status: "Replied",
    adminReply: "okk make sure do not be too much late"
  },
  {
    id: "#2",
    employee: "jaspal875626@gmail.com",
    subject: "pay",
    status: "Replied",
    adminReply: "ok"
  },
  {
    id: "#3",
    employee: "jaspal875626@gmail.com",
    subject: "dfd",
    status: "Replied",
    adminReply: "dfd"
  }
];

const InquiryCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("inquiries");
  
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
              <Button>New Inquiry</Button>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>{inquiry.id}</TableCell>
                        <TableCell>{inquiry.employee}</TableCell>
                        <TableCell>{inquiry.subject}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {inquiry.status}
                          </span>
                        </TableCell>
                        <TableCell>{inquiry.adminReply}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leave" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-gray-500 mb-4">No leave requests found</p>
                <Button variant="outline">Request Leave</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-gray-500 mb-4">No announcements found</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default InquiryCenter;
