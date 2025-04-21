export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  lastMessagePreview: string;
  unreadCount: number;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
} 