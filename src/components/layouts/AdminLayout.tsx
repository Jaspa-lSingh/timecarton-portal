
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Calendar, Users, DollarSign, Clock, Settings, LogOut, BarChart3 } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = () => {
    authService.logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out'
    });
    navigate('/login');
  };
  
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/admin/schedule', label: 'Schedule', icon: <Calendar size={20} /> },
    { path: '/admin/employees', label: 'Employees', icon: <Users size={20} /> },
    { path: '/admin/time-tracking', label: 'Time Tracking', icon: <Clock size={20} /> },
    { path: '/admin/payroll', label: 'Payroll', icon: <DollarSign size={20} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile unless menu is open */}
      <aside 
        className={`${
          isMobile ? (menuOpen ? 'fixed inset-0 z-50 flex' : 'hidden') : 'block'
        } w-64 bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-1 rounded">
                <Clock size={24} />
              </div>
              <h1 className="text-xl font-bold">ShiftMaster</h1>
            </div>
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <X size={24} />
              </Button>
            )}
          </div>
          
          {/* Sidebar content */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => isMobile && setMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <Menu size={24} />
              </Button>
            )}
            
            <div className="flex items-center ml-auto">
              <div className="hidden md:flex items-center mr-4 text-sm">
                <span className="font-medium text-gray-700">Admin User</span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Log Out</span>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
