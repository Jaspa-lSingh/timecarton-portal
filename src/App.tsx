
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminSchedule from "./pages/admin/Schedule";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeSchedule from "./pages/employee/Schedule";
import EmployeeProfile from "./pages/employee/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
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
                <div>Employees Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/time-tracking" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_time_tracking">
                <div>Time Tracking Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payroll" 
            element={
              <ProtectedRoute allowedRole="admin" requiredPermission="manage_payroll">
                <div>Payroll Page (Coming Soon)</div>
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
                <div>Time Tracking Page (Coming Soon)</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/pay" 
            element={
              <ProtectedRoute allowedRole="employee" requiredPermission="view_own_payroll">
                <div>Pay Page (Coming Soon)</div>
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
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
