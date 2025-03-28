
import React, { useState } from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [user, setUser] = useState<User | null>(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    position: user?.position || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const result = await authService.updateProfile(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      
      if (result.error) {
        toast({
          title: 'Update Failed',
          description: result.error,
          variant: 'destructive'
        });
      } else if (result.data) {
        setUser(result.data);
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.'
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      position: user?.position || '',
    });
    setIsEditing(false);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <EmployeeLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-2xl bg-brand-100 text-brand-700">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                <CardDescription>{user.position}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-medium">{user.phoneNumber || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Role</span>
                <span className="text-sm font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Hourly Rate</span>
                <span className="text-sm font-medium">
                  {user.hourlyRate ? `$${user.hourlyRate.toFixed(2)}` : 'Not set'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              {!isEditing && (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* Profile Edit Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Profile' : 'Profile Details'}</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Update your personal information'
                  : 'View your personal information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={!isEditing ? 'bg-gray-50' : ''}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Account Information</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                  <div>
                    <span className="text-sm text-gray-500">Role</span>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Hourly Rate</span>
                    <p className="font-medium">
                      {user.hourlyRate ? `$${user.hourlyRate.toFixed(2)}` : 'Not set'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Contact your administrator to update these details.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Profile;
