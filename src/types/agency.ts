export interface Agency {
  id: string;
  name: string;
  ownerId: string; // ID of the agency owner
  logo?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing';
  subscriptionId?: string;
  memberCount: number;
}

export interface AgencyWithMembers extends Agency {
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    clientCount: number;
    joinedAt: Date;
  }>;
}

export interface AgencySubscription {
  id: string;
  agencyId: string;
  plan: 'monthly' | 'yearly';
  pricePerMember: number;
  currency: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  startDate: Date;
  endDate?: Date;
  trialEndsAt?: Date;
  canceledAt?: Date;
  paymentMethod: {
    type: 'card' | 'bank';
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
} 