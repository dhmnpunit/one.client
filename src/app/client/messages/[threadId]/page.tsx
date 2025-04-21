"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  Send,
  Download,
  Paperclip,
  User,
  Calendar
} from "lucide-react";
import Link from 'next/link';
import { mockClients, mockProjects, mockMessages, mockAgencyMembers } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: {
    threadId: string;
  };
}

// Get the first client for demonstration
const clientData = mockClients[0];

// Get project name from id
const getProjectName = (projectId: string) => {
  const project = mockProjects.find(project => project.id === projectId);
  return project ? project.name : 'General';
};

// Get sender info
const getSenderInfo = (senderId: string, senderType: 'client' | 'agency') => {
  if (senderType === 'client') {
    const client = mockClients.find(client => client.id === senderId);
    return {
      name: client ? client.name : 'Unknown Client',
      avatar: client ? client.avatar : '/avatars/placeholder.svg',
      role: 'Client'
    };
  } else {
    const member = mockAgencyMembers.find(member => member.id === senderId);
    return {
      name: member ? member.name : 'Agency Team',
      avatar: member ? member.avatar : '/avatars/placeholder.svg',
      role: member ? member.role : 'Agency Team'
    };
  }
};

export default function ClientMessageThread({ params }: PageProps) {
  const { threadId } = params;
  const [newMessage, setNewMessage] = useState('');
  
  // Filter messages for this thread and client
  const threadMessages = mockMessages
    .filter(message => 
      message.threadId === threadId && 
      message.clientId === clientData.id
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  if (threadMessages.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <Link href="/client/messages" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Messages
        </Link>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Thread not found</h2>
            <p className="text-muted-foreground mt-2">This conversation doesn't exist or you don't have access to it.</p>
            <Button asChild className="mt-4">
              <Link href="/client/messages">
                Return to Messages
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get thread information from the first message
  const firstMessage = threadMessages[0];
  const subject = firstMessage.subject;
  const projectId = firstMessage.projectId;
  const projectName = getProjectName(projectId);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    // In a real app, this would send the message to the API
    console.log('Sending message:', newMessage);
    alert('Message sent: ' + newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <Link href="/client/messages" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Messages
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{subject}</h1>
            <div className="flex items-center text-muted-foreground gap-2 mt-1">
              <span>Project:</span>
              <Badge variant="outline" className="font-normal">
                {projectName}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Message thread */}
      <Card>
        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Messages */}
          <div className="space-y-6">
            {threadMessages.map((message, index) => {
              const sender = getSenderInfo(message.senderId, message.senderType);
              const isClient = message.senderType === 'client';
              
              return (
                <div key={message.id} className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      <Image
                        src={sender.avatar}
                        alt={sender.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="font-medium">{sender.name}</div>
                        <div className="text-sm text-muted-foreground">{sender.role}</div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(message.timestamp)}
                      </div>
                      
                      <div className={cn(
                        "mt-2 p-3 rounded-lg",
                        isClient ? "bg-blue-50" : "bg-gray-50"
                      )}>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-medium mb-2">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.attachments.map((attachment, i) => (
                                <div 
                                  key={i}
                                  className="flex items-center gap-1 text-sm p-2 bg-white rounded border"
                                >
                                  <Paperclip className="h-3.5 w-3.5" />
                                  <span className="max-w-[140px] truncate">{attachment.name}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                    <Download className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Reply form */}
          <div className="pt-4 border-t">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                <Image
                  src={clientData.avatar}
                  alt={clientData.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <Textarea
                  placeholder="Type your reply here..."
                  className="w-full resize-none"
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                
                <div className="flex justify-between mt-3">
                  <Button variant="outline" type="button">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 