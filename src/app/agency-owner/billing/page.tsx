"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the settings page with billing tab
    router.push('/agency-owner/settings?tab=billing');
  }, [router]);

  return (
    <div className="p-6 flex items-center justify-center h-full">
      <p>Redirecting to billing settings...</p>
    </div>
  );
} 