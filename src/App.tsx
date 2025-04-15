
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminSchedule from '@/pages/admin/Schedule';
import EmployeesPage from '@/pages/admin/Employees';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import PayrollPage from '@/pages/admin/Payroll';
import AssignShiftsPage from '@/pages/admin/AssignShifts';
import EmployeeDashboard from '@/pages/employee/Dashboard';
import EmployeeSchedule from '@/pages/employee/Schedule';
import EmployeePayroll from '@/pages/employee/Payroll';
import EmployeeProfile from '@/pages/employee/Profile';
import EmployeeInquiry from '@/pages/employee/Inquiry';
import EmployeeShiftChanges from '@/pages/employee/ShiftChanges';
import EmployeeTimeTracking from '@/pages/employee/TimeTracking';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Home />} />
          <Route path="/auth" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="schedule" element={<AdminSchedule />} />
                <Route path="assign-shifts" element={<AssignShiftsPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="payroll" element={<PayrollPage />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Employee Routes */}
          <Route path="/employee/*" element={
            <ProtectedRoute allowedRole="employee">
              <Routes>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="schedule" element={<EmployeeSchedule />} />
                <Route path="time" element={<EmployeeTimeTracking />} />
                <Route path="inquiry" element={<EmployeeInquiry />} />
                <Route path="profile" element={<EmployeeProfile />} />
                <Route path="pay" element={<EmployeePayroll />} />
                <Route path="shift-changes" element={<EmployeeShiftChanges />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
