import React from 'react';

const Pulse = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 space-y-2">
          <Pulse className="h-10 w-80" />
          <Pulse className="h-5 w-72" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl p-8 bg-gray-200 animate-pulse h-64" />
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <Pulse className="h-6 w-24" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Pulse className="h-4 w-32" />
                  <Pulse className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Pulse className="h-4 w-24" />
                  <Pulse className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <Pulse className="h-7 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Pulse className="h-6 w-6 rounded-full shrink-0" />
                    <Pulse className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-4">
              <Pulse className="h-7 w-48" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="space-y-1">
                    <Pulse className="h-4 w-28" />
                    <Pulse className="h-3 w-20" />
                  </div>
                  <div className="text-right space-y-1">
                    <Pulse className="h-4 w-16" />
                    <Pulse className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
