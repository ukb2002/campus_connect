
import React, { useState, useEffect, useRef } from "react";
import { Send, Lock, Copy, CheckCircle, AlertCircle, Info, Paperclip, Download, X, Image, FileText, FilePieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { encryptMessage, decryptMessage, generateEncryptionKey } from "@/services/encryptionService";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { ResourceFile } from "@/types/models";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import Peer from the PeerJS library
import Peer from "peerjs";

interface Message {
  id: string;
  sender: string;
  content: string;
  encrypted: string;
  timestamp: Date;
  isSelf: boolean;
  resourceLink?: ResourceLink;
}

interface ResourceLink {
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface SharedResource {
  id: string;
  name: string;
  size: number;
  type: string;
  data?: ArrayBuffer;
  url?: string;
  sender: string;
}

const SecureChat: React.FC = () => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [peerConnection, setPeerConnection] = useState<Peer | null>(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [currentPeerId, setCurrentPeerId] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("guide");
  const [connections, setConnections] = useState<Record<string, any>>({});
  const [sharedResources, setSharedResources] = useState<SharedResource[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState<SharedResource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize PeerJS connection when component mounts
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) return;
    
    // Initialize with a random ID or based on user ID if available
    const peer = new Peer(`campus-${authState.user.id}-${Math.floor(Math.random() * 1000000)}`);
    
    // Generate an encryption key
    const key = generateEncryptionKey();
    setEncryptionKey(key);
    
    peer.on("open", (id) => {
      setCurrentPeerId(id);
      toast({
        title: "Chat ready",
        description: "Your secure chat is initialized with peer ID: " + id,
      });
    });
    
    peer.on("connection", (conn) => {
      handleConnection(conn);
    });
    
    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      toast({
        title: "Connection error",
        description: err.message,
        variant: "destructive",
      });
    });
    
    setPeerConnection(peer);
    
    // Clean up on unmount
    return () => {
      if (peer) {
        Object.values(connections).forEach(conn => conn.close());
        peer.destroy();
      }
    };
  }, [authState.isAuthenticated, authState.user]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConnection = (conn: any) => {
    conn.on("open", () => {
      // Store connection
      setConnections(prev => ({ ...prev, [conn.peer]: conn }));
      setConnectionStatus("connected");
      toast({
        title: "Connection established",
        description: `Connected to peer: ${conn.peer}`,
      });
      
      // Send our encryption key
      conn.send({ type: "key-exchange", key: encryptionKey });
    });
    
    conn.on("data", (data: any) => {
      if (data.type === "key-exchange") {
        // Store their encryption key
        setEncryptionKey(data.key);
        toast({
          title: "Encryption key received",
          description: "Secure communication channel established",
        });
      } else if (data.type === "message") {
        receiveMessage(data.message);
      } else if (data.type === "resource") {
        receiveResource(data.resource);
      }
    });
    
    conn.on("close", () => {
      // Remove connection
      setConnections(prev => {
        const newConns = { ...prev };
        delete newConns[conn.peer];
        return newConns;
      });
      
      if (Object.keys(connections).length === 0) {
        setConnectionStatus("disconnected");
      }
      
      toast({
        title: "Connection closed",
        description: `Disconnected from peer: ${conn.peer}`,
      });
    });
  };

  const connectToPeer = () => {
    if (!peerConnection || !remotePeerId) return;
    
    try {
      setConnectionStatus("connecting");
      const conn = peerConnection.connect(remotePeerId);
      handleConnection(conn);
    } catch (error) {
      console.error("Connection error:", error);
      setConnectionStatus("disconnected");
      toast({
        title: "Connection failed",
        description: "Could not connect to the specified peer ID",
        variant: "destructive",
      });
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() && !selectedFile && Object.keys(connections).length === 0) return;
    
    try {
      // Check if there's a file to share
      if (selectedFile) {
        sendFile();
        return;
      }

      const encryptedContent = encryptMessage(inputMessage, encryptionKey);
      
      const messageObj: Message = {
        id: `msg_${Date.now()}`,
        sender: authState.user?.name || "You",
        content: inputMessage,
        encrypted: encryptedContent,
        timestamp: new Date(),
        isSelf: true,
      };
      
      // Add to local messages
      setMessages(prev => [...prev, messageObj]);
      
      // Send to all connected peers
      Object.values(connections).forEach(conn => {
        conn.send({
          type: "message",
          message: {
            ...messageObj,
            isSelf: false,
            sender: authState.user?.name || "Anonymous",
          },
        });
      });
      
      // Clear input
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Could not send encrypted message",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputMessage(`Sharing file: ${e.target.files[0].name}`);
    }
  };

  const sendFile = async () => {
    if (!selectedFile || Object.keys(connections).length === 0) return;

    try {
      const fileBuffer = await selectedFile.arrayBuffer();
      const fileId = `file_${Date.now()}`;
      const fileSize = selectedFile.size;
      const fileName = selectedFile.name;
      const fileType = selectedFile.type;
      
      // Create a URL for the file
      const fileUrl = URL.createObjectURL(selectedFile);
      
      // Create a resource object
      const resource: SharedResource = {
        id: fileId,
        name: fileName,
        size: fileSize,
        type: fileType,
        data: fileBuffer,
        url: fileUrl,
        sender: authState.user?.name || "You",
      };
      
      // Create a message with the file link
      const messageObj: Message = {
        id: `msg_${Date.now()}`,
        sender: authState.user?.name || "You",
        content: `Shared file: ${fileName}`,
        encrypted: encryptMessage(`Shared file: ${fileName}`, encryptionKey),
        timestamp: new Date(),
        isSelf: true,
        resourceLink: {
          name: fileName,
          type: fileType,
          size: fileSize,
        }
      };
      
      // Add file to shared resources
      setSharedResources(prev => [...prev, resource]);
      
      // Add message to chat
      setMessages(prev => [...prev, messageObj]);
      
      // Send to all connected peers
      Object.values(connections).forEach(conn => {
        conn.send({
          type: "resource",
          resource: {
            ...resource,
            sender: authState.user?.name || "Anonymous",
          }
        });
        
        // Also send a message about the shared file
        conn.send({
          type: "message",
          message: {
            ...messageObj,
            isSelf: false,
            sender: authState.user?.name || "Anonymous",
          },
        });
      });
      
      // Clear input and selected file
      setInputMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast({
        title: "File shared",
        description: `Successfully shared ${fileName}`,
      });
    } catch (error) {
      console.error("Error sending file:", error);
      toast({
        title: "File sharing failed",
        description: "Could not share file",
        variant: "destructive",
      });
    }
  };

  const receiveResource = (resource: SharedResource) => {
    try {
      // Create a blob from the file data
      if (resource.data) {
        const blob = new Blob([resource.data]);
        const url = URL.createObjectURL(blob);
        resource.url = url;
      }
      
      // Add to shared resources
      setSharedResources(prev => [...prev, resource]);
      
      toast({
        title: "Resource received",
        description: `Received: ${resource.name} from ${resource.sender}`,
      });
    } catch (error) {
      console.error("Error receiving resource:", error);
      toast({
        title: "Resource error",
        description: "Could not process received resource",
        variant: "destructive",
      });
    }
  };

  const receiveMessage = (message: Message) => {
    try {
      // Decrypt the message
      const decryptedContent = decryptMessage(message.encrypted, encryptionKey);
      
      // Add to messages
      setMessages(prev => [
        ...prev, 
        { 
          ...message, 
          content: decryptedContent,
        }
      ]);
    } catch (error) {
      console.error("Error receiving message:", error);
      toast({
        title: "Message error",
        description: "Could not decrypt incoming message",
        variant: "destructive",
      });
    }
  };

  const copyPeerId = () => {
    if (!currentPeerId) return;
    
    navigator.clipboard.writeText(currentPeerId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Peer ID copied to clipboard",
    });
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };
  
  const viewResource = (resource: SharedResource) => {
    setSelectedResource(resource);
    setShowResourceDialog(true);
  };

  const downloadResource = (resource: SharedResource) => {
    if (!resource.url) return;
    
    const a = document.createElement('a');
    a.href = resource.url;
    a.download = resource.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setInputMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.includes('image')) {
      return <Image className="h-4 w-4" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-4 w-4" />;
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FilePieChart className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  };

  return (
    <Card className="w-full h-full flex flex-col border shadow-md rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-300" />
            <CardTitle className="text-lg font-semibold">End-to-End Encrypted Chat</CardTitle>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="guide">Guide</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="bg-slate-100 p-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected" ? "bg-green-500" : 
                  connectionStatus === "connecting" ? "bg-yellow-500" : "bg-red-500"
                }`}></div>
                <span className="text-sm font-medium">
                  {connectionStatus === "connected" ? "Connected" : 
                   connectionStatus === "connecting" ? "Connecting..." : "Disconnected"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Your ID:</span>
                <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">
                  {currentPeerId || "Initializing..."}
                </code>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={copyPeerId}
                        disabled={!currentPeerId}
                      >
                        {copySuccess ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy your peer ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {connectionStatus !== "connected" && (
              <div className="mt-3 flex gap-2">
                <Input
                  placeholder="Enter peer ID to connect"
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  onClick={connectToPeer} 
                  disabled={!remotePeerId || !currentPeerId || connectionStatus === "connecting"}
                  className="whitespace-nowrap"
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <Spinner className="h-4 w-4 mr-2" /> Connecting...
                    </>
                  ) : "Connect"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="h-[calc(100%-78px)] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <Lock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No messages yet. Start by connecting to a peer.</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.isSelf 
                        ? "bg-campus-blue text-white" 
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs font-semibold">
                        {message.sender}
                      </span>
                      <Lock className="h-3 w-3 opacity-60" />
                    </div>
                    <p className="break-words">{message.content}</p>
                    
                    {message.resourceLink && (
                      <div className="mt-2 p-2 bg-slate-100 bg-opacity-20 rounded flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(message.resourceLink.type)}
                          <span className="text-xs truncate max-w-[120px]">
                            {message.resourceLink.name}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[9px]">
                          {formatFileSize(message.resourceLink.size)}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-right mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-3 bg-white">
          {selectedFile && (
            <div className="w-full mb-2 flex items-center justify-between bg-slate-50 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm truncate">{selectedFile.name}</span>
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(selectedFile.size)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelFileSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex w-full gap-2">
            <Input
              placeholder="Type your encrypted message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
              disabled={connectionStatus !== "connected"}
            />
            
            <Button 
              variant="outline"
              disabled={connectionStatus !== "connected"}
              onClick={() => fileInputRef.current?.click()}
              className="px-3"
            >
              <Paperclip className="h-4 w-4" />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
            </Button>
            
            <Button 
              onClick={sendMessage} 
              disabled={((!inputMessage.trim() && !selectedFile) || connectionStatus !== "connected")}
            >
              <Send className="h-4 w-4 mr-1" /> Send
            </Button>
          </div>
          
          {sharedResources.length > 0 && (
            <div className="w-full mt-3">
              <div className="text-sm font-medium mb-1 flex items-center justify-between">
                <span>Shared Resources</span>
                <Badge variant="outline" className="text-xs">{sharedResources.length}</Badge>
              </div>
              <div className="flex gap-2 overflow-x-auto py-1">
                {sharedResources.map((resource) => (
                  <div 
                    key={resource.id} 
                    className="flex-shrink-0 flex flex-col items-center gap-1 bg-slate-50 p-2 rounded-md border w-[100px]"
                  >
                    <div className="w-full flex justify-center">
                      {getFileIcon(resource.type)}
                    </div>
                    <span className="text-xs text-center truncate w-full" title={resource.name}>
                      {resource.name}
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => viewResource(resource)}
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => downloadResource(resource)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </TabsContent>
      
      <TabsContent value="guide" className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-campus-blue" />
              How to Use Encrypted Chat
            </h3>
            <p className="text-slate-600 mb-4">
              This feature provides end-to-end encrypted communication between two users on the same network.
              All messages are encrypted before being sent over the connection.
            </p>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important privacy information</AlertTitle>
            <AlertDescription>
              Messages are encrypted and can only be decrypted by the participants in the conversation. 
              No messages are stored on servers or persisted after you close the chat.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Step 1: Share your Peer ID</h4>
              <p className="text-slate-600">
                Copy your peer ID and share it with the person you want to chat with.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Step 2: Connect to your peer</h4>
              <p className="text-slate-600">
                Ask your peer for their ID and enter it in the connection field, then click Connect.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Step 3: Start chatting securely</h4>
              <p className="text-slate-600">
                Once connected, you can send messages and share files securely.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Step 4: Share resources</h4>
              <p className="text-slate-600">
                Click the paperclip icon to share files with your peer. Shared files can be viewed or downloaded.
              </p>
            </div>
          </div>
          
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              For maximum security, exchange peer IDs through a different secure channel, not over public networks.
              This is a peer-to-peer connection, so both users must be online simultaneously.
            </AlertDescription>
          </Alert>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="mr-2" 
              onClick={() => setActiveTab("chat")}
            >
              Start Chatting
            </Button>
            
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                onClick={clearChat}
              >
                Clear Chat History
              </Button>
            )}
          </div>
        </div>
      </TabsContent>
      
      {/* Resource Viewer Dialog */}
      <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Resource: {selectedResource?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {selectedResource?.type.includes('image') && selectedResource?.url && (
              <img 
                src={selectedResource.url} 
                alt={selectedResource.name} 
                className="max-h-[400px] mx-auto" 
              />
            )}
            
            {!selectedResource?.type.includes('image') && (
              <div className="p-8 bg-slate-50 rounded-md text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <p>Preview not available for this file type</p>
                <p className="text-sm text-slate-500 mt-1">Download the file to view its contents</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowResourceDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => selectedResource && downloadResource(selectedResource)}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SecureChat;
