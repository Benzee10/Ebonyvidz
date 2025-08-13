import React from 'react';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="video-card animate-pulse bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video bg-gray-600"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-600 rounded w-1/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  );
}

export default VideoCardSkeleton;