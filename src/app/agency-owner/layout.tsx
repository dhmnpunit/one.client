import { DashboardLayout } from '@/components/shared/layouts/dashboard-layout';
import { mockAgencyOwner } from '@/lib/mock-data';

export default function AgencyOwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using mock data for now - will be replaced with real data from auth and DB
  const ownerData = mockAgencyOwner;

  return (
    <DashboardLayout
      userRole="agency-owner"
      userName={ownerData.name}
      userAvatar={ownerData.avatar}
    >
      {children}
    </DashboardLayout>
  );
} 