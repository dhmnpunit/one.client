export type UserRole = 'agency-owner' | 'agency-member' | 'freelancer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface AgencyOwner extends User {
  role: 'agency-owner';
  agencyId: string;
  agencyName: string;
}

export interface AgencyMember extends User {
  role: 'agency-member';
  agencyId: string;
  assignedBy: string; // ID of the agency owner who assigned this member
  clientIds: string[]; // IDs of assigned clients (max 10)
}

export interface Freelancer extends User {
  role: 'freelancer';
  clientIds: string[]; // IDs of clients (max 10)
}

export interface Client extends User {
  role: 'client';
  assignedToId: string; // ID of the freelancer or agency member managing this client
  companyName?: string;
}

export type UserProfile = AgencyOwner | AgencyMember | Freelancer | Client; 