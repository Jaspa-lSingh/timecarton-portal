
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmployeeLayout from '@/components/layouts/EmployeeLayout';

const ShiftChanges: React.FC = () => {
  const [activeTab, setActiveTab] = useState("cover-up");
  
  return (
    <EmployeeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shift Changes</h1>
        
        <Tabs defaultValue="cover-up" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="cover-up">Cover-Up Shift</TabsTrigger>
            <TabsTrigger value="swap">Swap Shift</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cover-up" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-gray-500 mb-4">No cover-up shifts currently available</p>
                <Button variant="outline">Request Cover-Up</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="swap" className="mt-0">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-gray-500 mb-4">No swap shifts currently available</p>
                <Button variant="outline">Request Swap</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default ShiftChanges;
