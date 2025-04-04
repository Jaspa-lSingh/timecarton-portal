
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="assign-shifts" element={<AssignShiftsPage />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="payroll" element={<PayrollPage />} />
          </Routes>
        </ProtectedRoute>} />
        
        {/* Employee Routes */}
        <Route path="/employee" element={<ProtectedRoute allowedRole="employee">
          <Routes>
            {/* Add employee-specific routes here */}
            <Route path="dashboard" element={<div>Employee Dashboard</div>} />
          </Routes>
        </ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
