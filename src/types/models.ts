
export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroup: boolean;
  name?: string;
}

export interface ResourceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  fileUrl?: string; // URL to the actual file for viewing
  uploadedBy: {
    id: string;
    name: string;
  };
  uploadedAt: string;
  downloads: number;
  isPublic: boolean;
  category?: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
  relatedUserId?: string;
}
