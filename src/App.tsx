import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSchedule from "./pages/admin/Schedule";
import AdminEmployees from "./pages/admin/Employees";
import AdminEmployeeDetail from "./pages/admin/EmployeeDetail";
import AdminTimeTracking from "./pages/admin/TimeTracking";
import AdminPayroll from "./pages/admin/Payroll";
import AdminInquiryCenter from "./pages/admin/InquiryCenter";
import AdminAttendance from "./pages/admin/Attendance";
import AdminShiftChanges from "./pages/admin/ShiftChanges";
import AdminAnnouncements from "./pages/admin/Announcements";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeSchedule from "./pages/employee/Schedule";
import EmployeeTimeTracking from "./pages/employee/TimeTracking";
import EmployeePayroll from "./pages/employee/Payroll";
import EmployeeProfile from "./pages/employee/Profile";
import ShiftChanges from "./pages/employee/ShiftChanges";
import InquiryCenter from "./pages/employee/Inquiry";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/schedule" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_schedules">
                <AdminSchedule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/employees" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_employees">
                <AdminEmployees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/employees/:id" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_employees">
                <AdminEmployeeDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/time-tracking" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_time_tracking">
                <AdminTimeTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payroll" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_payroll">
                <AdminPayroll />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/inquiry-center" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminInquiryCenter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/attendance" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/shift-changes" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminShiftChanges />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/announcements" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminAnnouncements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_settings">
                <div>Settings Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Employee Routes */}
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/schedule" 
            element={
              <ProtectedRoute allowedRole="employee" requiredPermission="view_own_schedule">
                <EmployeeSchedule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/time" 
            element={
              <ProtectedRoute allowedRole="employee" requiredPermission="view_own_timesheet">
                <EmployeeTimeTracking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/pay" 
            element={
              <ProtectedRoute allowedRole="employee" requiredPermission="view_own_payroll">
                <EmployeePayroll />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/profile" 
            element={
              <ProtectedRoute allowedRole="employee" requiredPermission="update_own_profile">
                <EmployeeProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/shift-changes" 
            element={
              <ProtectedRoute allowedRole="employee">
                <ShiftChanges />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/inquiry" 
            element={
              <ProtectedRoute allowedRole="employee">
                <InquiryCenter />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
