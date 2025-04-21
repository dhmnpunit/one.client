export * from './users';
export * from './projects';
export * from './invoices';
export * from './messages';
export * from './agencies';

// Interfaces
export interface AgencyMember {
  id: string;
  name: string;
  email: string;
  role: 'designer' | 'developer' | 'manager' | 'admin';
  avatar: string;
  projects: number;
  rating: number;
  completionRate: number;
  clientIds: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar: string;
  totalProjects: number;
  activeProjects: number;
  joinedDate: Date;
  status: 'active' | 'inactive';
  lastActivity: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  assignedToId: string;
  status: 'completed' | 'in-progress' | 'not-started';
  startDate: Date;
  dueDate: Date;
  budget: number;
  category: 'web' | 'mobile' | 'design' | 'marketing';
}

// Mock Agency Members
export const mockAgencyMembers: AgencyMember[] = [
  {
    id: '1',
    name: 'Ali Demir',
    email: 'ali.demir@example.com',
    role: 'designer',
    avatar: '/avatars/ali-demir.jpg',
    projects: 12,
    rating: 4.8,
    completionRate: 95,
    clientIds: ["2", "5"],
  },
  {
    id: '2',
    name: 'Zeynep Ozturk',
    email: 'zeynep.ozturk@example.com',
    role: 'developer',
    avatar: '/avatars/zeynep-ozturk.jpg',
    projects: 8,
    rating: 4.5,
    completionRate: 90,
    clientIds: ["1"],
  },
  {
    id: '3',
    name: 'Ahmet Yilmaz',
    email: 'ahmet.yilmaz@example.com',
    role: 'manager',
    avatar: '/avatars/ahmet-yilmaz.jpg',
    projects: 15,
    rating: 4.9,
    completionRate: 98,
    clientIds: ["3", "4"],
  },
  {
    id: '4',
    name: 'Sercan Yayla',
    email: 'sercan.yayla@example.com',
    role: 'developer',
    avatar: '/avatars/sercan-yayla.jpg',
    projects: 10,
    rating: 4.7,
    completionRate: 92,
    clientIds: [],
  },
  {
    id: '5',
    name: 'Yusuf Hilmi',
    email: 'yusuf.hilmi@example.com',
    role: 'designer',
    avatar: '/avatars/yusuf-hilmi.jpg',
    projects: 7,
    rating: 4.4,
    completionRate: 85,
    clientIds: ["c6"],
  },
  {
    id: '6',
    name: 'Emre Kara',
    email: 'emre.kara@example.com',
    role: 'developer',
    avatar: '/avatars/emre-kara.jpg',
    projects: 9,
    rating: 4.6,
    completionRate: 88,
    clientIds: [],
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Murat Kaya',
    email: 'murat.kaya@techcorp.com',
    company: 'TechCorp',
    avatar: '/avatars/placeholder.svg',
    totalProjects: 5,
    activeProjects: 2,
    joinedDate: new Date('2023-01-15'),
    status: 'active',
    lastActivity: new Date('2023-08-24'),
  },
  {
    id: '2',
    name: 'Ayşe Yildirim',
    email: 'ayse.yildirim@globalfirm.com',
    company: 'Global Firm',
    avatar: '/avatars/placeholder.svg',
    totalProjects: 3,
    activeProjects: 1,
    joinedDate: new Date('2023-02-20'),
    status: 'active',
    lastActivity: new Date('2023-08-20'),
  },
  {
    id: '3',
    name: 'Hasan Aksoy',
    email: 'hasan.aksoy@innovatech.com',
    company: 'InnovaTech',
    avatar: '/avatars/placeholder.svg',
    totalProjects: 4,
    activeProjects: 0,
    joinedDate: new Date('2023-03-10'),
    status: 'inactive',
    lastActivity: new Date('2023-07-15'),
  },
  {
    id: '4',
    name: 'Elif Sahin',
    email: 'elif.sahin@marketleaders.com',
    company: 'Market Leaders',
    avatar: '/avatars/placeholder.svg',
    totalProjects: 2,
    activeProjects: 2,
    joinedDate: new Date('2023-04-05'),
    status: 'active',
    lastActivity: new Date('2023-08-23'),
  },
  {
    id: '5',
    name: 'Mehmet Kocak',
    email: 'mehmet.kocak@designplus.com',
    company: 'Design Plus',
    avatar: '/avatars/placeholder.svg',
    totalProjects: 6,
    activeProjects: 3,
    joinedDate: new Date('2023-01-05'),
    status: 'active',
    lastActivity: new Date('2023-08-22'),
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    description: 'Complete overhaul of the client\'s e-commerce website with modern UI and improved user experience.',
    clientId: '1',
    assignedToId: '1',
    status: 'in-progress',
    startDate: new Date('2023-05-10'),
    dueDate: new Date('2023-09-30'),
    budget: 15000,
    category: 'web',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Developing a native mobile application for iOS and Android platforms.',
    clientId: '2',
    assignedToId: '2',
    status: 'in-progress',
    startDate: new Date('2023-04-15'),
    dueDate: new Date('2023-10-15'),
    budget: 25000,
    category: 'mobile',
  },
  {
    id: '3',
    name: 'Brand Identity Refresh',
    description: 'Updating the client\'s brand identity, including logo, color scheme, and style guide.',
    clientId: '3',
    assignedToId: '5',
    status: 'completed',
    startDate: new Date('2023-03-20'),
    dueDate: new Date('2023-05-20'),
    budget: 8000,
    category: 'design',
  },
  {
    id: '4',
    name: 'Web Portal for Employees',
    description: 'Internal web portal for employee management and resource allocation.',
    clientId: '4',
    assignedToId: '4',
    status: 'in-progress',
    startDate: new Date('2023-06-01'),
    dueDate: new Date('2023-09-15'),
    budget: 12000,
    category: 'web',
  },
  {
    id: '5',
    name: 'Marketing Campaign',
    description: 'Comprehensive digital marketing campaign across multiple platforms.',
    clientId: '5',
    assignedToId: '3',
    status: 'not-started',
    startDate: new Date('2023-09-01'),
    dueDate: new Date('2023-11-30'),
    budget: 10000,
    category: 'marketing',
  },
  {
    id: '6',
    name: 'Custom CRM Solution',
    description: 'Tailored customer relationship management system for the client\'s specific needs.',
    clientId: '1',
    assignedToId: '6',
    status: 'not-started',
    startDate: new Date('2023-09-15'),
    dueDate: new Date('2024-01-15'),
    budget: 30000,
    category: 'web',
  },
  {
    id: '7',
    name: 'UI/UX Audit & Improvements',
    description: 'Comprehensive audit of existing platforms and implementing UX improvements.',
    clientId: '2',
    assignedToId: '1',
    status: 'completed',
    startDate: new Date('2023-02-10'),
    dueDate: new Date('2023-04-10'),
    budget: 7500,
    category: 'design',
  },
  {
    id: '8',
    name: 'E-learning Platform',
    description: 'Building an online learning platform with video courses and assessment tools.',
    clientId: '4',
    assignedToId: '2',
    status: 'in-progress',
    startDate: new Date('2023-05-01'),
    dueDate: new Date('2023-10-01'),
    budget: 18000,
    category: 'web',
  },
  {
    id: '9',
    name: 'Social Media Management',
    description: 'Ongoing social media management and content creation for the client.',
    clientId: '5',
    assignedToId: '1',
    status: 'in-progress',
    startDate: new Date('2023-01-01'),
    dueDate: new Date('2023-12-31'),
    budget: 15000,
    category: 'marketing',
  },
]; 