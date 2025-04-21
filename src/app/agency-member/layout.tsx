import { DashboardLayout } from '@/components/shared/layouts/dashboard-layout';
import { mockAgencyMembers } from '@/lib/mock-data';

export default function AgencyMemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using mock data for now - will be replaced with real data from auth and DB
  const memberData = mockAgencyMembers[0];

  return (
    <DashboardLayout
      userRole="agency-member"
      userName={memberData.name}
      userAvatar={memberData.avatar}
    >
      {children}
    </DashboardLayout>
  );
} 