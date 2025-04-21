import { Conversation, Message } from '@/types';

// Mock Conversations
export const mockConversations: Conversation[] = [
  // Agency Owner conversations
  {
    id: 'conv-1',
    participants: ['owner-1', 'member-1'],
    title: null,
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-04-10'),
    lastMessageAt: new Date('2023-04-10'),
    lastMessagePreview: 'Let\'s discuss the project timeline',
    unreadCount: 0
  },
  {
    id: 'conv-2',
    participants: ['owner-1', 'member-2'],
    title: null,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-04-12'),
    lastMessageAt: new Date('2023-04-12'),
    lastMessagePreview: 'Can we schedule a team meeting?',
    unreadCount: 1
  },
  {
    id: 'conv-3',
    participants: ['owner-1', 'member-3'],
    title: null,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-18'),
    lastMessageAt: new Date('2023-04-18'),
    lastMessagePreview: 'Welcome to the team!',
    unreadCount: 0
  },
  {
    id: 'conv-4',
    participants: ['owner-1', 'member-1', 'member-2', 'member-3'],
    title: 'Agency Team',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-04-20'),
    lastMessageAt: new Date('2023-04-20'),
    lastMessagePreview: 'Team meeting tomorrow at 10 AM',
    unreadCount: 0
  },
  
  // Agency Member conversations
  {
    id: 'conv-5',
    participants: ['member-1', 'client-1'],
    title: null,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-04-18'),
    lastMessageAt: new Date('2023-04-18'),
    lastMessagePreview: 'Here are the latest mockups',
    unreadCount: 2
  },
  {
    id: 'conv-6',
    participants: ['member-1', 'client-2'],
    title: null,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-04-15'),
    lastMessageAt: new Date('2023-04-15'),
    lastMessagePreview: 'App development is on track',
    unreadCount: 0
  },
  {
    id: 'conv-7',
    participants: ['member-2', 'client-4'],
    title: null,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2023-04-17'),
    lastMessageAt: new Date('2023-04-17'),
    lastMessagePreview: 'Social media campaign updates',
    unreadCount: 1
  },
  
  // Freelancer conversations
  {
    id: 'conv-8',
    participants: ['freelancer-1', 'client-9'],
    title: null,
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-04-19'),
    lastMessageAt: new Date('2023-04-19'),
    lastMessagePreview: 'Website development progress',
    unreadCount: 0
  },
  {
    id: 'conv-9',
    participants: ['freelancer-1', 'client-10'],
    title: null,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-04-12'),
    lastMessageAt: new Date('2023-04-12'),
    lastMessagePreview: 'Logo design approved!',
    unreadCount: 0
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  // Conversation 1 (Agency Owner - Member 1)
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'owner-1',
    content: 'Hi Mike, how is the website redesign project coming along?',
    timestamp: new Date('2023-04-10T09:30:00'),
    read: true,
    attachments: []
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'member-1',
    content: 'It\'s going well, Jane. We\'ve completed the wireframes and are working on the visual designs now.',
    timestamp: new Date('2023-04-10T09:35:00'),
    read: true,
    attachments: []
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'owner-1',
    content: 'Great! Let\'s discuss the project timeline in our next meeting.',
    timestamp: new Date('2023-04-10T09:40:00'),
    read: true,
    attachments: []
  },
  
  // Conversation 5 (Agency Member - Client)
  {
    id: 'msg-4',
    conversationId: 'conv-5',
    senderId: 'member-1',
    content: 'Hello Robert, I\'ve prepared the latest mockups for your website.',
    timestamp: new Date('2023-04-18T14:20:00'),
    read: true,
    attachments: [
      {
        id: 'att-1',
        messageId: 'msg-4',
        fileName: 'website-mockup-v2.pdf',
        fileType: 'application/pdf',
        fileSize: 2500000,
        url: '/attachments/website-mockup-v2.pdf'
      }
    ]
  },
  {
    id: 'msg-5',
    conversationId: 'conv-5',
    senderId: 'client-1',
    content: 'Thanks Mike, I\'ll review them and get back to you.',
    timestamp: new Date('2023-04-18T15:45:00'),
    read: false,
    attachments: []
  },
  
  // Conversation 8 (Freelancer - Client)
  {
    id: 'msg-6',
    conversationId: 'conv-8',
    senderId: 'freelancer-1',
    content: 'Hi Sophia, I\'ve made good progress on your website. Here\'s a preview link:',
    timestamp: new Date('2023-04-19T10:15:00'),
    read: true,
    attachments: []
  },
  {
    id: 'msg-7',
    conversationId: 'conv-8',
    senderId: 'freelancer-1',
    content: 'https://preview.greenstartupdemo.com',
    timestamp: new Date('2023-04-19T10:16:00'),
    read: true,
    attachments: []
  },
  {
    id: 'msg-8',
    conversationId: 'conv-8',
    senderId: 'client-9',
    content: 'Looks great Alex! I especially like the homepage layout.',
    timestamp: new Date('2023-04-19T11:30:00'),
    read: true,
    attachments: []
  }
];

// Conversations with their messages
export const getConversationsWithMessages = () => {
  return mockConversations.map(conversation => ({
    ...conversation,
    messages: mockMessages.filter(message => message.conversationId === conversation.id)
  }));
}; 