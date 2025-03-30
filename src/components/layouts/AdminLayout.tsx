
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types';
import { 
  Menu, 
  X, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Settings, 
  LogOut, 
  BarChart3, 
  HelpCircle,
  ClipboardList,
  RefreshCw,
  MessageSquare,
  Bell,
  User as UserIcon
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user data
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);
  
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
    { path: '/admin/inquiry-center', label: 'Employee Inquiry', icon: <MessageSquare size={20} /> },
    { path: '/admin/attendance', label: 'Attendance', icon: <ClipboardList size={20} /> },
    { path: '/admin/shift-changes', label: 'Shift Changes', icon: <RefreshCw size={20} /> },
    { path: '/admin/announcements', label: 'Announcements', icon: <Bell size={20} /> },
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
      <aside 
        className={`${
          isMobile ? (menuOpen ? 'fixed inset-0 z-50 flex' : 'hidden') : 'block'
        } w-64 bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="flex flex-col h-full">
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
          
          {/* User avatar and info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500">{user?.position}</p>
              </div>
            </div>
          </div>
          
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
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2">
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                <Menu size={24} />
              </Button>
            )}
            
            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              {/* User menu */}
              <div className="hidden md:flex items-center">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <UserIcon size={18} />
                  <span className="font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
                </Button>
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
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
