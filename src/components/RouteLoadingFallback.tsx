import React from 'react';

// Shown briefly while a lazy-loaded route's chunk downloads. Kept tiny and
// dependency-free since it's rendered by the same Suspense boundary that's
// splitting the bundle in the first place.
export const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh] py-24">
    <div className="w-8 h-8 border-3 border-[#0E4A93] border-t-transparent rounded-full animate-spin" />
  </div>
);
