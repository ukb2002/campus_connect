
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Plus, Search } from "lucide-react";
import { ChatMessage, ChatConversation } from "@/types/models";

// Mock conversation data
const mockConversations: ChatConversation[] = [
  {
    id: "1",
    participants: [
      {
        id: "2",
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
      },
    ],
    lastMessage: {
      id: "101",
      content: "Have you checked the latest resource I shared?",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2023-06-10T14:30:00Z",
      isRead: true,
    },
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "2",
    participants: [
      {
        id: "3",
        name: "Admin User",
        avatar: "https://ui-avatars.com/api/?name=Admin+User",
      },
    ],
    lastMessage: {
      id: "201",
      content: "Please submit your reports by Friday.",
      senderId: "3",
      senderName: "Admin User",
      timestamp: "2023-06-09T16:45:00Z",
      isRead: false,
    },
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: "3",
    name: "Computer Science Group",
    participants: [
      {
        id: "2",
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
      },
      {
        id: "3",
        name: "Admin User",
        avatar: "https://ui-avatars.com/api/?name=Admin+User",
      },
      {
        id: "4",
        name: "Bob Johnson",
        avatar: "https://ui-avatars.com/api/?name=Bob+Johnson",
      },
    ],
    lastMessage: {
      id: "301",
      content: "Meeting rescheduled to 3pm",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2023-06-08T09:15:00Z",
      isRead: false,
    },
    unreadCount: 2,
    isGroup: true,
  },
];

// Mock messages for the first conversation
const mockMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1001",
      content: "Hello! How are you doing today?",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2023-06-10T14:20:00Z",
      isRead: true,
    },
    {
      id: "1002",
      content: "I'm doing well, thank you! How about you?",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2023-06-10T14:25:00Z",
      isRead: true,
    },
    {
      id: "1003",
      content: "I'm good too. Just checking in.",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2023-06-10T14:28:00Z",
      isRead: true,
    },
    {
      id: "1004",
      content: "Have you checked the latest resource I shared?",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2023-06-10T14:30:00Z",
      isRead: true,
    },
  ],
  "2": [
    {
      id: "2001",
      content: "Hello Admin, I have a question about the upcoming events.",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2023-06-09T16:40:00Z",
      isRead: true,
    },
    {
      id: "2002",
      content: "Sure, what's your question?",
      senderId: "3",
      senderName: "Admin User",
      timestamp: "2023-06-09T16:42:00Z",
      isRead: true,
    },
    {
      id: "2003",
      content: "When is the next campus event scheduled?",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2023-06-09T16:44:00Z",
      isRead: true,
    },
    {
      id: "2004",
      content: "Please submit your reports by Friday.",
      senderId: "3",
      senderName: "Admin User",
      timestamp: "2023-06-09T16:45:00Z",
      isRead: false,
    },
  ],
  "3": [
    {
      id: "3001",
      content: "Hi everyone! Welcome to the CS group chat.",
      senderId: "3",
      senderName: "Admin User",
      timestamp: "2023-06-08T09:00:00Z",
      isRead: true,
    },
    {
      id: "3002",
      content: "Hello! Looking forward to our collaboration.",
      senderId: "1",
      senderName: "John Doe",
      timestamp: "2023-06-08T09:05:00Z",
      isRead: true,
    },
    {
      id: "3003",
      content: "We have a meeting scheduled for tomorrow at 2pm.",
      senderId: "4",
      senderName: "Bob Johnson",
      timestamp: "2023-06-08T09:10:00Z",
      isRead: true,
    },
    {
      id: "3004",
      content: "Meeting rescheduled to 3pm",
      senderId: "2",
      senderName: "Jane Smith",
      timestamp: "2023-06-08T09:15:00Z",
      isRead: false,
    },
  ],
};

const Messages = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(
    mockConversations[0]
  );
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockMessages[mockConversations[0].id] || []
  );

  const filteredConversations = conversations.filter((conv) => {
    const name = conv.name || conv.participants[0]?.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    
    // Mark conversation as read
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversation.id
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedConversation || !user) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // Add message to current conversation
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Update last message in conversations list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage }
          : conv
      )
    );
    
    // Clear input
    setMessage("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="flex flex-1 overflow-hidden border rounded-lg bg-white">
        {/* Conversation list sidebar */}
        <div className="w-full sm:w-1/3 md:w-1/4 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-campus-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search conversations" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {filteredConversations.map((conversation) => {
              const name = conversation.name || conversation.participants[0]?.name || "Unknown";
              const avatar = conversation.participants[0]?.avatar;
              
              return (
                <div
                  key={conversation.id}
                  className={`p-3 border-b cursor-pointer hover:bg-campus-gray-50 ${
                    selectedConversation?.id === conversation.id ? "bg-campus-gray-100" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{name}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-campus-blue text-white text-xs rounded-full px-2 py-0.5">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-campus-gray-600 truncate">
                        {conversation.lastMessage?.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="hidden sm:flex flex-col flex-1">
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage 
                    src={
                      selectedConversation.isGroup 
                        ? undefined 
                        : selectedConversation.participants[0]?.avatar
                    } 
                  />
                  <AvatarFallback>
                    {(selectedConversation.name || selectedConversation.participants[0]?.name || "").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedConversation.name || selectedConversation.participants[0]?.name}
                  </p>
                  <p className="text-xs text-campus-gray-500">
                    {selectedConversation.isGroup 
                      ? `${selectedConversation.participants.length} participants` 
                      : "Online"}
                  </p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] flex ${!isOwn && "flex-row"} ${isOwn && "flex-row-reverse"}`}>
                        {!isOwn && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage src={msg.senderAvatar} />
                            <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div>
                          {selectedConversation.isGroup && !isOwn && (
                            <p className="text-xs text-campus-gray-600 mb-1">
                              {msg.senderName}
                            </p>
                          )}
                          
                          <div
                            className={`rounded-lg p-3 ${
                              isOwn
                                ? "bg-campus-blue text-white"
                                : "bg-campus-gray-100 text-campus-gray-900"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          
                          <p className="text-xs text-campus-gray-500 mt-1">
                            {formatTimestamp(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-campus-gray-600">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Message placeholder for mobile view */}
        <div className="flex flex-1 sm:hidden items-center justify-center">
          <div className="text-center p-4">
            <p className="text-campus-gray-600">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
