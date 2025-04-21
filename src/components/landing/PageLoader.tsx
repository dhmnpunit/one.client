import React from 'react';

/**
 * A loading spinner component for page transitions
 * Used as a fallback while lazy-loaded components are being loaded
 */
const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader; 