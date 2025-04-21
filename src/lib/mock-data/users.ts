import { AgencyMember, AgencyOwner, Client, Freelancer, User } from '@/types';

// Mock Agency Owner
export const mockAgencyOwner: AgencyOwner = {
  id: 'owner-1',
  name: 'Jane Smith',
  email: 'jane@designagency.com',
  role: 'agency-owner',
  avatar: '/avatars/jane-smith.jpg',
  createdAt: new Date('2023-01-15'),
  agencyId: 'agency-1',
  agencyName: 'Design Agency Pro'
};

// Mock Agency Members
export const mockAgencyMembers: AgencyMember[] = [
  {
    id: 'member-1',
    name: 'Mike Johnson',
    email: 'mike@designagency.com',
    role: 'agency-member',
    avatar: '/avatars/mike-johnson.jpg',
    createdAt: new Date('2023-02-10'),
    agencyId: 'agency-1',
    assignedBy: 'owner-1',
    clientIds: ['client-1', 'client-2', 'client-3']
  },
  {
    id: 'member-2',
    name: 'Sarah Williams',
    email: 'sarah@designagency.com',
    role: 'agency-member',
    avatar: '/avatars/sarah-williams.jpg',
    createdAt: new Date('2023-03-05'),
    agencyId: 'agency-1',
    assignedBy: 'owner-1',
    clientIds: ['client-4', 'client-5']
  },
  {
    id: 'member-3',
    name: 'David Chen',
    email: 'david@designagency.com',
    role: 'agency-member',
    avatar: '/avatars/david-chen.jpg',
    createdAt: new Date('2023-04-15'),
    agencyId: 'agency-1',
    assignedBy: 'owner-1',
    clientIds: ['client-6', 'client-7', 'client-8']
  }
];

// Mock Freelancer
export const mockFreelancer: Freelancer = {
  id: 'freelancer-1',
  name: 'Alex Thompson',
  email: 'alex@freelance.com',
  role: 'freelancer',
  avatar: '/avatars/alex-thompson.jpg',
  createdAt: new Date('2023-01-20'),
  clientIds: ['client-9', 'client-10', 'client-11']
};

// Mock Clients
export const mockClients: Client[] = [
  // Agency clients
  {
    id: 'client-1',
    name: 'Robert Brown',
    email: 'robert@abccompany.com',
    role: 'client',
    companyName: 'ABC Company',
    avatar: '/avatars/robert-brown.jpg',
    createdAt: new Date('2023-02-20'),
    assignedToId: 'member-1'
  },
  {
    id: 'client-2',
    name: 'Emily Davis',
    email: 'emily@xyzstartup.com',
    role: 'client',
    companyName: 'XYZ Startup',
    avatar: '/avatars/emily-davis.jpg',
    createdAt: new Date('2023-03-10'),
    assignedToId: 'member-1'
  },
  {
    id: 'client-3',
    name: 'James Wilson',
    email: 'james@innovatetech.com',
    role: 'client',
    companyName: 'Innovate Tech',
    avatar: '/avatars/james-wilson.jpg',
    createdAt: new Date('2023-04-05'),
    assignedToId: 'member-1'
  },
  {
    id: 'client-4',
    name: 'Olivia Martinez',
    email: 'olivia@globalbrands.com',
    role: 'client',
    companyName: 'Global Brands Inc',
    avatar: '/avatars/olivia-martinez.jpg',
    createdAt: new Date('2023-03-15'),
    assignedToId: 'member-2'
  },
  {
    id: 'client-5',
    name: 'William Taylor',
    email: 'william@futureapps.com',
    role: 'client',
    companyName: 'Future Apps',
    avatar: '/avatars/william-taylor.jpg',
    createdAt: new Date('2023-04-25'),
    assignedToId: 'member-2'
  },
  // Freelancer clients
  {
    id: 'client-9',
    name: 'Sophia Lee',
    email: 'sophia@greenstartup.com',
    role: 'client',
    companyName: 'Green Startup',
    avatar: '/avatars/sophia-lee.jpg',
    createdAt: new Date('2023-02-15'),
    assignedToId: 'freelancer-1'
  },
  {
    id: 'client-10',
    name: 'Daniel Clark',
    email: 'daniel@webdesigns.com',
    role: 'client',
    companyName: 'Web Designs Co',
    avatar: '/avatars/daniel-clark.jpg',
    createdAt: new Date('2023-03-20'),
    assignedToId: 'freelancer-1'
  }
];

// Combine all users for easy access
export const mockUsers: User[] = [
  mockAgencyOwner, 
  ...mockAgencyMembers, 
  mockFreelancer,
  ...mockClients
]; 