
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { getAllVideosWithDynamic } from '../lib/videos';
import { getAllTrendingViews, getViews } from '../lib/analytics';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';
import { FireIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface TrendingSectionProps {
  timeframe?: 24 | 168; // 24 hours or 168 hours (1 week)
  maxVideos?: number;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ 
  timeframe = 24, 
  maxVideos = 10 
}) => {
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<24 | 168>(timeframe);

  useEffect(() => {
    const loadTrendingVideos = async () => {
      setLoading(true);
      try {
        const allVideos = await getAllVideosWithDynamic();
        const trendingViews = getAllTrendingViews(selectedTimeframe);
        
        // Sort videos by trending views and filter out videos with no views
        const videosWithTrending = allVideos
          .map(video => ({
            video,
            trendingViews: trendingViews[video.slug] || 0
          }))
          .filter(item => item.trendingViews > 0)
          .sort((a, b) => b.trendingViews - a.trendingViews)
          .slice(0, maxVideos)
          .map(item => item.video);

        setTrendingVideos(videosWithTrending);
      } catch (error) {
        console.error('Error loading trending videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingVideos();
  }, [selectedTimeframe, maxVideos]);

  const timeframeLabel = selectedTimeframe === 24 ? '24 Hours' : '7 Days';

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FireIcon className="h-8 w-8 text-red-500" />
            Trending Now
          </h2>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 -mx-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64 sm:w-72 lg:w-80">
              <VideoCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (trendingVideos.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FireIcon className="h-8 w-8 text-red-500" />
            Trending Now
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTimeframe(24)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 24
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setSelectedTimeframe(168)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === 168
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              7d
            </button>
          </div>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FireIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No trending videos in the last {timeframeLabel.toLowerCase()}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FireIcon className="h-8 w-8 text-red-500" />
          Trending Now - {timeframeLabel}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTimeframe(24)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === 24
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setSelectedTimeframe(168)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === 168
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7d
          </button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 -mx-4 px-4 horizontal-scroll">
        {trendingVideos.map((video, index) => (
          <div key={video.slug} className="flex-shrink-0 w-64 sm:w-72 lg:w-80 relative">
            <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <VideoCard video={video} views={getViews(video.slug)} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
