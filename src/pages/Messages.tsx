
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SecureChat from "@/components/chat/SecureChat";
import { AlertCircle, Lock, MessageSquare, Paperclip } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("secure");

  return (
    <div className="container py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Chat Connection Guide</AlertTitle>
        <AlertDescription className="text-amber-700">
          To chat with another device on the same network, both users must be on the
          Messages page. Copy your Peer ID and share it with the other user, then enter their Peer ID to connect.
          Once connected, you can share messages and resources securely.
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="secure" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  Regular chat features are coming soon. For secure communications and resource sharing, please use the Secure Chat tab.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="secure" className="mt-0">
          <div className="h-[700px]">
            <SecureChat />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
