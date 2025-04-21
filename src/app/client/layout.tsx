import { DashboardLayout } from '@/components/shared/layouts/dashboard-layout';
import { mockClients } from '@/lib/mock-data'; // Using mockClients[0] as placeholder

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Using mock data - replace with real data from auth and DB
  const clientData = mockClients[0]; // Using the first client as a placeholder

  return (
    <DashboardLayout
      userRole="client"
      userName={clientData.name}
      // userAvatar={clientData.avatar} // Removed: Prop not currently accepted by DashboardLayout
      // Add client-specific navigation items if needed in DashboardLayout props
    >
      {children}
    </DashboardLayout>
  );
} 