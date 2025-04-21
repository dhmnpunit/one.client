import { Agency, AgencySubscription } from '@/types';
import { mockAgencyMembers, mockAgencyOwner } from './users';

// Mock Agency
export const mockAgency: Agency = {
  id: 'agency-1',
  name: 'Design Agency Pro',
  ownerId: 'owner-1',
  logo: '/logos/design-agency-pro.svg',
  address: '123 Creative St, Design District, NY 10001',
  website: 'https://designagencypro.com',
  phone: '+1 (555) 123-4567',
  email: 'info@designagencypro.com',
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2023-04-10'),
  subscriptionStatus: 'active',
  subscriptionId: 'sub-1',
  memberCount: 4 // Owner + 3 members
};

// Mock Agency Subscription
export const mockAgencySubscription: AgencySubscription = {
  id: 'sub-1',
  agencyId: 'agency-1',
  plan: 'monthly',
  pricePerMember: 29,
  currency: 'USD',
  status: 'active',
  startDate: new Date('2023-01-15'),
  trialEndsAt: new Date('2023-02-15'),
  paymentMethod: {
    type: 'card',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025
  }
};

// Agency with members
export const getAgencyWithMembers = () => {
  return {
    ...mockAgency,
    owner: {
      id: mockAgencyOwner.id,
      name: mockAgencyOwner.name,
      email: mockAgencyOwner.email,
      avatar: mockAgencyOwner.avatar
    },
    members: mockAgencyMembers.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      avatar: member.avatar,
      clientCount: member.clientIds.length,
      joinedAt: member.createdAt
    }))
  };
}; 