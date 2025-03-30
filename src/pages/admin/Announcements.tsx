
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Plus,
  Search,
  Trash2,
  Edit,
  CalendarIcon
} from 'lucide-react';

// Mock announcements data
const mockAnnouncements = [
  {
    id: '1',
    title: 'Holiday Schedule Update',
    content: 'The office will be closed on July 4th for Independence Day. Normal schedule resumes on July 5th.',
    priority: 'high',
    status: 'active',
    audience: 'all',
    createdAt: '2024-06-20T10:30:00',
    expiresAt: '2024-07-10T00:00:00'
  },
  {
    id: '2',
    title: 'New Uniform Policy',
    content: 'Starting next month, all staff members are required to wear company-provided uniforms during working hours.',
    priority: 'medium',
    status: 'active',
    audience: 'all',
    createdAt: '2024-06-15T14:00:00',
    expiresAt: '2024-07-15T00:00:00'
  },
  {
    id: '3',
    title: 'System Maintenance',
    content: 'The time tracking system will be unavailable on Sunday from 2 AM to 5 AM due to scheduled maintenance.',
    priority: 'low',
    status: 'active',
    audience: 'all',
    createdAt: '2024-06-22T09:15:00',
    expiresAt: '2024-06-26T00:00:00'
  }
];

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    audience: 'all',
    expiresAt: ''
  });

  const filteredAnnouncements = announcements.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAnnouncement = () => {
    const createdAt = new Date().toISOString();
    const newItem = {
      id: (announcements.length + 1).toString(),
      ...newAnnouncement,
      status: 'active',
      createdAt
    };
    
    setAnnouncements([newItem, ...announcements]);
    setIsNewDialogOpen(false);
    resetForm();
    toast.success('Announcement created successfully');
  };

  const handleUpdateAnnouncement = () => {
    const updatedAnnouncements = announcements.map(ann => 
      ann.id === selectedAnnouncement.id ? selectedAnnouncement : ann
    );
    
    setAnnouncements(updatedAnnouncements);
    setIsEditDialogOpen(false);
    setSelectedAnnouncement(null);
    toast.success('Announcement updated successfully');
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
      toast.success('Announcement deleted successfully');
    }
  };

  const resetForm = () => {
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      audience: 'all',
      expiresAt: ''
    });
  };

  const editAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getPriorityBadge = (priority: string) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[priority as keyof typeof classes] || ''}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Announcements</h1>
          <Button 
            onClick={() => setIsNewDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Announcement</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>All Announcements</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search announcements..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">No announcements found</p>
                {searchQuery && <p className="text-gray-400 text-sm">Try adjusting your search query</p>}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TITLE</TableHead>
                    <TableHead>PRIORITY</TableHead>
                    <TableHead>CREATED</TableHead>
                    <TableHead>EXPIRES</TableHead>
                    <TableHead>AUDIENCE</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell>{getPriorityBadge(announcement.priority)}</TableCell>
                      <TableCell>{formatDate(announcement.createdAt)}</TableCell>
                      <TableCell>{formatDate(announcement.expiresAt)}</TableCell>
                      <TableCell className="capitalize">{announcement.audience}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => editAnnouncement(announcement)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* New Announcement Dialog */}
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Create an announcement to notify employees
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                  placeholder="Enter announcement title..."
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  rows={5}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                  placeholder="Enter announcement content..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select 
                    value={newAnnouncement.priority}
                    onValueChange={(value) => setNewAnnouncement({...newAnnouncement, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="audience" className="text-sm font-medium">
                    Audience
                  </label>
                  <Select 
                    value={newAnnouncement.audience}
                    onValueChange={(value) => setNewAnnouncement({...newAnnouncement, audience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="full-time">Full-Time Employees</SelectItem>
                      <SelectItem value="part-time">Part-Time Employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="expiresAt" className="text-sm font-medium">
                  Expiry Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="expiresAt"
                    type="date"
                    className="pl-10"
                    value={newAnnouncement.expiresAt}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, expiresAt: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsNewDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleCreateAnnouncement}
                disabled={!newAnnouncement.title || !newAnnouncement.content || !newAnnouncement.expiresAt}
              >
                Create Announcement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Announcement Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
              <DialogDescription>
                Make changes to the announcement
              </DialogDescription>
            </DialogHeader>
            
            {selectedAnnouncement && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="edit-title"
                    value={selectedAnnouncement.title}
                    onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="edit-content" className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id="edit-content"
                    rows={5}
                    value={selectedAnnouncement.content}
                    onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, content: e.target.value})}
                    placeholder="Enter announcement content..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <Select 
                      value={selectedAnnouncement.priority}
                      onValueChange={(value) => setSelectedAnnouncement({...selectedAnnouncement, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="edit-audience" className="text-sm font-medium">
                      Audience
                    </label>
                    <Select 
                      value={selectedAnnouncement.audience}
                      onValueChange={(value) => setSelectedAnnouncement({...selectedAnnouncement, audience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        <SelectItem value="full-time">Full-Time Employees</SelectItem>
                        <SelectItem value="part-time">Part-Time Employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="edit-expiresAt" className="text-sm font-medium">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="edit-expiresAt"
                      type="date"
                      className="pl-10"
                      value={selectedAnnouncement.expiresAt ? selectedAnnouncement.expiresAt.substring(0, 10) : ''}
                      onChange={(e) => setSelectedAnnouncement({...selectedAnnouncement, expiresAt: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedAnnouncement(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleUpdateAnnouncement}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Announcements;
