import React from 'react';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="group flex flex-col space-y-3">
      <div className="relative aspect-video w-full rounded-lg bg-gray-700 animate-pulse"></div>
      <div className="flex flex-col space-y-2">
        <div className="h-5 w-3/4 rounded bg-gray-700 animate-pulse"></div>
        <div className="h-4 w-1/2 rounded bg-gray-700 animate-pulse"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
import React from 'react';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-video bg-gray-300 rounded-lg mb-3"></div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
