"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Send,
  File,
  MessageSquare
} from "lucide-react";
import { FolderIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockAgencyMembers } from '@/lib/mock-data';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Define contact interface that can be either team member or client
interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: 'team' | 'client' | 'project-group';
  role?: string;
  company?: string;
  avatarColors?: string[];
}

// Define conversation interface
interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactType: 'team' | 'client' | 'project-group';
  avatarSrc: string;
  avatarColors?: string[];
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isActive: boolean;
  messages: Message[];
}

// Generate avatar URL for team members using DiceBear with micah style
const getTeamMemberAvatar = (name: string) => {
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  return `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`;
};

// --- Start of Mock Data Augmentation (Add this near existing mock data imports) ---
// Assume we know the current client ID
const currentClientId = 'c1'; 

// Augment Project interface and data
interface Project {
  id: string;
  title: string;
  client: string; // Original client name
  clientId: string; // Add client ID for easier lookup
  assignedTeamMemberIds: string[]; // Add assigned team members
}

const mockProjects: Project[] = [
  { id: "p1", title: "Website Redesign", client: "Acme Corp", clientId: "c1", assignedTeamMemberIds: ["1", "2", "4"] }, // Ali, Zeynep, Sercan
  { id: "p2", title: "Mobile App Development", client: "TechStart", clientId: "c2", assignedTeamMemberIds: ["1", "3", "4"] }, // Ali, Ahmet, Sercan
  { id: "p3", title: "Brand Identity Package", client: "GreenLife", clientId: "c3", assignedTeamMemberIds: ["1", "5"] },      // Ali, Yusuf
  { id: "p4", title: "Marketing Campaign", client: "InnovateTech", clientId: "c4", assignedTeamMemberIds: ["3", "6"] },      // Ahmet, Emre
  { id: "p5", title: "E-commerce Platform", client: "Acme Corp", clientId: "c1", assignedTeamMemberIds: ["4", "6"] },      // Sercan, Emre (Client c1's second project)
  { id: "p6", title: "Annual Report Design", client: "Global Finance", clientId: "c5", assignedTeamMemberIds: ["2", "3"] }       // Zeynep, Ahmet
];
// --- End of Mock Data Augmentation ---

export default function MessagesPage() {
  // Create contacts list from team members and clients
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Initialize contacts and conversations from mock data
  useEffect(() => {
      // 1. Find projects for the current client
      const clientProjects = mockProjects.filter(p => p.clientId === currentClientId);
  
      // 2. Find unique team members assigned to these projects
      const assignedMemberIds = new Set<string>();
      clientProjects.forEach(p => {
        p.assignedTeamMemberIds.forEach(id => assignedMemberIds.add(id));
      });
  
      // 3. Get Contact details for these assigned members
      const relevantTeamContacts: Contact[] = mockAgencyMembers
        .filter(member => assignedMemberIds.has(member.id))
        .map(member => ({
          id: member.id,
          name: member.name,
          email: member.email,
          avatar: getTeamMemberAvatar(member.name),
          type: 'team',
          role: member.role
        }));
  
      // 4. Create "Contacts" for Project Groups
      const projectGroupContacts: Contact[] = clientProjects.map(project => ({
        id: project.id, // Use project ID as the contact ID for the group
        name: `${project.title} (Group)`, // Identify as a group chat
        email: '', // No direct email for a group
        avatar: '', // Use a generic group icon later
        type: 'project-group', // New type
        company: project.client, // Store client name if needed
        // We might need a way to represent participants for the avatar/header
      }));
  
      // 5. Combine relevant contacts for the client view
      const clientVisibleContacts = [...relevantTeamContacts, ...projectGroupContacts];
  
      // 6. Create sample conversations ONLY for these contacts
      const sampleConversations: Conversation[] = clientVisibleContacts.map((contact, index) => {
        // Determine if the conversation is with a team member or a project group
        const isProjectGroup = contact.type === 'project-group';
        
        // Define initial messages based on context
        let initialMessages: Message[];
        if (isProjectGroup) {
            initialMessages = [
                { id: `msg-${contact.id}-1`, content: `Welcome to the ${contact.name} chat!`, timestamp: new Date(Date.now() - (index + 2) * 3600000).toISOString(), isOwn: false },
                { id: `msg-${contact.id}-2`, content: `Looking forward to discussing project updates here.`, timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString(), isOwn: true, readStatus: 'sent' }
            ];
        } else { // Individual team member
            initialMessages = [
                { id: `msg-${contact.id}-1`, content: `Hi ${contact.name}, regarding project updates...`, timestamp: new Date(Date.now() - (index + 2) * 3600000).toISOString(), isOwn: true, readStatus: 'read' },
                { id: `msg-${contact.id}-2`, content: `Hi! Yes, let's discuss.`, timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString(), isOwn: false }
            ];
        }
    
    return {
            id: `conv-${contact.id}`, // Conversation ID based on contact/project ID
            contactId: contact.id,
            contactName: contact.name,
            contactType: contact.type, // Type is already 'team' or 'project-group'
            avatarSrc: contact.avatar,
            lastMessage: initialMessages[initialMessages.length - 1].content,
            timestamp: initialMessages[initialMessages.length - 1].timestamp,
            unreadCount: index % 4 === 0 ? 1 : 0, // Adjust unread logic
            isActive: false, // Set initial isActive to false
            messages: initialMessages
        };
      });
  
  
      // Sort conversations by timestamp before setting state
      const sortedConversations = sampleConversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setConversations(sortedConversations);
      
      if (sortedConversations.length > 0) {
        // Make the first conversation active by default
        setActiveConversation(sortedConversations[0]);
      } else {
        setActiveConversation(null);
      }
  }, []); // Empty dependency array means this runs once on mount

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

  // Filter conversations by tab
  const displayedConversations = filteredConversations.filter(conversation => {
    if (activeTab === "all") return true;
    if (activeTab === "agency") return conversation.contactType === 'team';
    if (activeTab === "projects") return conversation.contactType === 'project-group';
    return true;
  });

  // Select a conversation
  const selectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    
    // Mark messages as read and update isActive status
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversation.id) {
          return { ...conv, unreadCount: 0, isActive: true };
        } else {
          return { ...conv, isActive: false }; // Deactivate others
        }
      })
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

    // Update active conversation
    const updatedConversation = {
      ...activeConversation,
      lastMessage: newMessage,
      timestamp: new Date().toISOString(),
      messages: [...activeConversation.messages, newMsg]
    };

    // Update conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id ? updatedConversation : conv
      )
    );

    setActiveConversation(updatedConversation);
    setNewMessage("");
  };

  const getReadStatusIcon = (status?: 'read' | 'delivered' | 'sent') => {
    // You can add more sophisticated read status icons here (e.g., double ticks)
    if (status === 'read') return <span className="text-blue-500">✓✓</span>;
    if (status === 'delivered') return <span>✓✓</span>;
    return <span>✓</span>;
  };
  
  return (
    <div className="flex h-full border-t"> 
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search contacts..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4">
             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
               <TabsList className="grid w-full grid-cols-3 h-9">
                 <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
                 <TabsTrigger value="agency" className="text-xs h-7">Agency</TabsTrigger>
                 <TabsTrigger value="projects" className="text-xs h-7">Projects</TabsTrigger>
               </TabsList>
             </Tabs>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {displayedConversations.map(conv => (
            <button 
              key={conv.id} 
              onClick={() => selectConversation(conv)} 
              className={cn(
                "flex items-center w-full p-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-100", 
                conv.isActive ? "bg-gray-100" : ""
              )}
            >
              <div className="relative mr-3">
                 {conv.contactType === 'project-group' ? (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                       <FolderIcon className="h-6 w-6 text-gray-500" />
                    </div>
                 ) : (
                   <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.avatarSrc} alt={conv.contactName} />
                      <AvatarFallback>{conv.contactName.charAt(0)}</AvatarFallback>
                   </Avatar>
                 )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium truncate">{conv.contactName}</h3>
                  <span className="text-xs text-gray-500">{formatTimestamp(conv.timestamp)}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  {conv.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 px-1.5 text-xs leading-none">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
          {displayedConversations.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                  No conversations found for this filter.
              </div>
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex justify-between items-center h-[73px]">
              <div className="flex items-center">
                 {activeConversation.contactType === 'project-group' ? (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                       <FolderIcon className="h-6 w-6 text-gray-500" />
                    </div>
                 ) : (
                   <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeConversation.avatarSrc} alt={activeConversation.contactName} />
                      <AvatarFallback>{activeConversation.contactName.charAt(0)}</AvatarFallback>
                   </Avatar>
                 )}
                <div>
                  <h3 className="font-semibold">{activeConversation.contactName}</h3>
                  <p className="text-xs text-gray-500">
                     {activeConversation.contactType === 'project-group' 
                        ? 'Project Group Chat'
                        : (activeConversation.isActive ? "Online" : "Offline")
                     }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversation.messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}>
                  <div className={cn(
                      "max-w-xs lg:max-w-md px-3 py-2 rounded-lg", 
                      msg.isOwn ? "bg-primary text-primary-foreground" : "bg-white border"
                  )}>
                     {msg.attachments?.map((att, index) => (
                        <div key={index} className="mb-1">
                           {att.type === 'image' ? (
                             <img src={att.url} alt="Attachment" className="rounded max-w-full h-auto" />
                           ) : (
                             <div className="flex items-center p-2 bg-gray-100 rounded hover:bg-gray-200">
                                <File className="h-5 w-5 mr-2 text-gray-600" />
                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 underline">
                                   {att.name || 'Attached File'}
                                </a>
                             </div>
                          )}
                        </div>
                     ))}
                    <p className="text-sm">{msg.content}</p>
                    <div className={cn(
                        "text-xs mt-1 flex items-center",
                        msg.isOwn ? "text-primary-foreground/70 justify-end" : "text-gray-500 justify-start"
                    )}>
                      <span>{formatTimestamp(msg.timestamp)}</span>
                      {msg.isOwn && msg.readStatus && <span className="ml-1">{getReadStatusIcon(msg.readStatus)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="relative flex items-center">
                <Button variant="ghost" size="icon" className="absolute left-1">
                  <PaperClipIcon className="h-5 w-5 text-gray-500" />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  className="pl-10 pr-20 rounded-full h-10" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-1 rounded-full w-8 h-8"
                  onClick={sendMessage}
                  disabled={newMessage.trim() === ""}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
             <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
             </div>
            </div>
          )}
      </div>
    </div>
  );
} 