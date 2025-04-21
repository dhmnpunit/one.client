import { mockAgencyOwner } from '@/lib/mock-data';
import { ClientLayout } from './components/client-layout';

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Using mock data for now - will be replaced with real data from auth and DB
  const ownerData = mockAgencyOwner;

  return <ClientLayout userName={ownerData.name}>{children}</ClientLayout>;
} 