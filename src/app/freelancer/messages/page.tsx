"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Search, 
  PlusCircle, 
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
  ImageIcon,
  File,
  MessageSquare
} from "lucide-react";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockClients } from '@/lib/mock-data';
import BoringAvatar from "boring-avatars";

// Define message interface
interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  readStatus?: 'read' | 'delivered' | 'sent';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name?: string;
  }[];
}

// Define contact interface - Simplified for only clients
interface Contact {
  id: string;
  name: string;
  email: string;
  avatarColors?: string[]; // Client avatar uses Boring Avatars
  type: 'client'; // Only client type relevant for freelancer
  company?: string;
}

// Define conversation interface - Simplified for only clients
interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactType: 'client'; // Only client type
  avatarColors?: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isActive: boolean;
  messages: Message[];
}

// Define color palettes for client avatars
const avatarColorPalettes = [
  ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
  ["#A0B9C6", "#7A9CA5", "#6C7E8E", "#4B5A72", "#324267"],
  ["#F5BB9C", "#EE9480", "#EB6877", "#D83F87", "#A91CF0"],
  ["#5E7CE2", "#72A1ED", "#7CCAED", "#92F2DA", "#B8F7D4"],
  ["#6FD08C", "#A2E665", "#CAF7CE", "#E2F6D3", "#F9F7D3"]
];

// Generate a consistent color palette for each client
const getClientAvatarColors = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const paletteIndex = hash % avatarColorPalettes.length;
  return avatarColorPalettes[paletteIndex];
};

export default function FreelancerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  // Initialize contacts and conversations from mock data (Clients only)
  useEffect(() => {
    // Create contacts from clients
    const clientContacts: Contact[] = mockClients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      type: 'client',
      company: client.company,
      avatarColors: getClientAvatarColors(client.name) // Add colors for Boring Avatar
    }));

    const allContacts = [...clientContacts];
    
    // Create sample conversations for clients
    const sampleConversations: Conversation[] = allContacts.map((contact, index) => ({
      id: `conv-${contact.type}-${contact.id}`,
      contactId: contact.id,
      contactName: contact.name,
      contactType: contact.type, // Will always be 'client'
      avatarColors: contact.avatarColors, 
      lastMessage: "Thanks for the quick response.", 
      timestamp: new Date(Date.now() - index * 3600000).toISOString(),
      unreadCount: index % 3 === 0 ? 1 : 0,
      isActive: index === 0,
      messages: [
        {
          id: `msg-${index}-1`,
          content: `Hello, I wanted to check in about your project with ${contact.company}.`,
          timestamp: new Date(Date.now() - index * 3600000 - 3600000).toISOString(),
          isOwn: true,
          readStatus: 'read'
        },
        {
          id: `msg-${index}-2`,
          content: "Thanks for checking in. We're really happy with the progress.",
          timestamp: new Date(Date.now() - index * 3600000 - 1800000).toISOString(),
          isOwn: false
        },
        {
          id: `msg-${index}-3`,
          content: "Thanks for the quick response.",
          timestamp: new Date(Date.now() - index * 3600000).toISOString(),
          isOwn: index % 2 === 0
        }
      ]
    }));

    setConversations(sampleConversations);
    if (sampleConversations.length > 0) {
      setActiveConversation(sampleConversations[0]);
    }
  }, []);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      if (isYesterday) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    }
  };

  // Filter conversations by search term
  const filteredConversations = conversations.filter(conversation => {
    if (searchTerm.trim() === "") return true;
    return conversation.contactName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayedConversations = filteredConversations; // Only clients exist

  // Select a conversation
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };

  // Send a message
  const sendMessage = () => {
    if (!activeConversation || newMessage.trim() === "") return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
      readStatus: 'sent',
    };

    const updatedConversation = {
      ...activeConversation,
      lastMessage: newMessage,
      timestamp: new Date().toISOString(),
      messages: [...activeConversation.messages, newMsg]
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );

    setActiveConversation(updatedConversation);
    setNewMessage("");
  };

  // Get read status icon
  const getReadStatusIcon = (status?: 'read' | 'delivered' | 'sent') => {
    if (!status) return null;
    return (
      <div className="text-xs text-gray-500">
        {status === 'read' && <div className="text-blue-500">✓✓</div>}
        {status === 'delivered' && <div>✓✓</div>}
        {status === 'sent' && <div>✓</div>}
      </div>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r flex flex-col bg-white">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Messages</h2>
              <Button size="icon" variant="ghost">
                <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
                type="text" 
                placeholder="Search Clients" 
                className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            </div>
        </div>
        
          <div className="flex-1 overflow-y-auto">
            {displayedConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              <div className="space-y-0.5">
                {displayedConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50",
                      activeConversation?.id === conversation.id && "bg-gray-100 hover:bg-gray-100"
                    )}
                    onClick={() => selectConversation(conversation)}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <BoringAvatar
                          size={40}
                          name={conversation.contactName}
                          variant="marble"
                          colors={conversation.avatarColors || avatarColorPalettes[0]}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate flex items-center gap-1.5">
                          {conversation.contactName}
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 font-normal py-0 h-5">Client</Badge>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(conversation.timestamp)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Client • {mockClients.find(c => c.id === conversation.contactId)?.company || 'Company'}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat header */}
            <div className="border-b p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-purple-200">
                  <BoringAvatar
                    size={40}
                    name={activeConversation.contactName}
                    variant="marble"
                    colors={activeConversation.avatarColors || avatarColorPalettes[0]}
                  />
                </div>
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {activeConversation.contactName}
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 font-normal">Client</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {mockClients.find(c => c.id === activeConversation.contactId)?.company || 'Company'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col",
                    message.isOwn ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.isOwn
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 rounded-bl-none"
                  )}
                >
                    {message.content}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div 
                            key={index}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded",
                              message.isOwn ? "bg-primary-dark" : "bg-gray-200"
                            )}
                          >
                            {attachment.type === 'image' ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <File className="h-4 w-4" />
                            )}
                            <span className="text-sm truncate">{attachment.name || 'Attachment'}</span>
                    </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.isOwn && getReadStatusIcon(message.readStatus)}
                  </div>
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={sendMessage}
                  disabled={newMessage.trim() === ""}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a client conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}