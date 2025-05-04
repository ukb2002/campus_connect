
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecureChat from "@/components/chat/SecureChat";
import { Lock, MessageSquare, Shield } from "lucide-react";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("regular");

  return (
    <div className="container py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <Tabs defaultValue="regular" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="regular" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Regular Chat
          </TabsTrigger>
          <TabsTrigger value="secure" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Secure Chat
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Campus Chat
              </CardTitle>
              <CardDescription>
                Chat with other members of your campus community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 border rounded-md p-8 text-center">
                <p className="text-slate-500">
                  Regular chat features are coming soon. For secure communications, please use the Secure Chat tab.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="secure" className="mt-0">
          <div className="h-[600px]">
            <SecureChat />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
