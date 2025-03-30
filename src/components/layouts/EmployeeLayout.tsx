
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types';
import { 
  Menu, X, Calendar, Clock, DollarSign, 
  User as UserIcon, LogOut, Home, HelpCircle, Repeat
} from 'lucide-react';

const EmployeeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    { path: '/employee/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/employee/schedule', label: 'My Shifts', icon: <Calendar size={20} /> },
    { path: '/employee/time', label: 'Attendance', icon: <Clock size={20} /> },
    { path: '/employee/inquiry', label: 'Inquiry', icon: <HelpCircle size={20} /> },
    { path: '/employee/profile', label: 'Profile', icon: <UserIcon size={20} /> },
    { path: '/employee/pay', label: 'Payroll', icon: <DollarSign size={20} /> },
    { path: '/employee/shift-changes', label: 'Shift Changes', icon: <Repeat size={20} /> },
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
          
          {/* User info */}
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
            
            <div className="flex-1 text-center font-medium text-lg hidden md:block">
              Dashboard Overview
            </div>
            
            <div className="flex items-center ml-auto">
              <div className="hidden md:flex items-center mr-4 text-sm">
                <span className="font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
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

export default EmployeeLayout;
