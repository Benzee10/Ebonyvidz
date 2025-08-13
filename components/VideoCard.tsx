import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { PlayIcon, EyeIcon } from './Icons';

interface VideoCardProps {
  video: Video;
  views: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, views }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
      // Start preview after a short delay
      previewTimeoutRef.current = setTimeout(() => {
        setPreviewLoaded(true);
      }, 500);
    }, 1000); // Show preview after 1 second of hover
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    setShowPreview(false);
    setPreviewLoaded(false);
  };

  const isVideoFile = video.videoUrl.toLowerCase().endsWith('.mp4');

  return (
    <Link
      to={`/video/${video.slug}`}
      className="group flex flex-col space-y-3 transform transition-transform duration-300 hover:-translate-y-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-800 shadow-lg">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${showPreview && isVideoFile ? 'opacity-0' : 'opacity-100'}`}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZpbGw9IiM5Q0E5QkEiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
          }}
        />

        {/* Video Preview */}
        {showPreview && isVideoFile && (
          <video
            src={video.videoUrl}
            muted
            loop
            autoPlay={previewLoaded}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${previewLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ pointerEvents: 'none' }}
          />
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                <PlayIcon className="w-10 h-10 text-white" />
            </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </span>

        {/* Preview indicator */}
        {showPreview && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Preview
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1 gap-2">
            <EyeIcon className="w-4 h-4" />
            <span>{views.toLocaleString()} views</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;