
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { 
  ClipboardList, 
  Search, 
  CheckCircle, 
  XCircle,
  Clock,
  Calendar
} from 'lucide-react';

// Mock attendance data
const mockAttendanceData = [
  {
    id: '1',
    employeeId: '2',
    employeeName: 'John Doe',
    date: '2024-06-15',
    clockIn: '2024-06-15T08:55:00',
    clockOut: '2024-06-15T17:05:00',
    scheduledStart: '2024-06-15T09:00:00',
    scheduledEnd: '2024-06-15T17:00:00',
    status: 'on-time',
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Jane Smith',
    date: '2024-06-15',
    clockIn: '2024-06-15T09:15:00',
    clockOut: '2024-06-15T17:00:00',
    scheduledStart: '2024-06-15T09:00:00',
    scheduledEnd: '2024-06-15T17:00:00',
    status: 'late',
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Mike Johnson',
    date: '2024-06-15',
    clockIn: '2024-06-15T08:50:00',
    clockOut: '2024-06-15T16:45:00',
    scheduledStart: '2024-06-15T09:00:00',
    scheduledEnd: '2024-06-15T17:00:00',
    status: 'early-departure',
  },
  {
    id: '4',
    employeeId: '5',
    employeeName: 'Sarah Williams',
    date: '2024-06-15',
    scheduledStart: '2024-06-15T09:00:00',
    scheduledEnd: '2024-06-15T17:00:00',
    status: 'absent',
  },
];

const Attendance: React.FC = () => {
  const [attendance] = useState(mockAttendanceData);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = 
      searchQuery === '' || 
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.includes(searchQuery);
    
    const matchesDate = record.date === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'h:mm a');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'on-time':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} /> On Time
        </span>;
      case 'late':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} /> Late
        </span>;
      case 'early-departure':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock size={12} /> Early Departure
        </span>;
      case 'absent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle size={12} /> Absent
        </span>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Attendance Tracking</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search employee..." 
                className="w-64 pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
            <Button variant="outline" className="gap-2">
              <Calendar size={16} />
              <span>View Reports</span>
            </Button>
          </div>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {filteredAttendance.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>EMPLOYEE</TableHead>
                    <TableHead>SCHEDULED START</TableHead>
                    <TableHead>SCHEDULED END</TableHead>
                    <TableHead>CLOCK IN</TableHead>
                    <TableHead>CLOCK OUT</TableHead>
                    <TableHead>HOURS</TableHead>
                    <TableHead>STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record) => {
                    // Calculate hours worked (if clocked in/out)
                    let hoursWorked = '—';
                    if (record.clockIn && record.clockOut) {
                      const clockInTime = new Date(record.clockIn).getTime();
                      const clockOutTime = new Date(record.clockOut).getTime();
                      const diffHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);
                      hoursWorked = diffHours.toFixed(2);
                    }
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeName}</TableCell>
                        <TableCell>{formatTime(record.scheduledStart)}</TableCell>
                        <TableCell>{formatTime(record.scheduledEnd)}</TableCell>
                        <TableCell>{formatTime(record.clockIn)}</TableCell>
                        <TableCell>{formatTime(record.clockOut)}</TableCell>
                        <TableCell>{hoursWorked}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <ClipboardList className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No attendance records found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Attendance;
