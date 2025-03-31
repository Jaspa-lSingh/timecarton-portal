
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface ProfileHeaderProps {
  user: User | null;
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isEditing, onEditClick }) => {
  if (!user) return null;
  
  return (
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
            onClick={onEditClick}
          >
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileHeader;
