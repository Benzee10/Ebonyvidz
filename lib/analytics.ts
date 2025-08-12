import { getAllVideos, getAllVideosWithDynamic } from './videos';
import { Video } from '../types';

// Simulate a database (like a JSON file on a server) for view counts.
// Using a Record to type this as a dictionary/hash map.
const _viewCounts: Record<string, number> = {};

// Initialize with some random baseline views to make it look realistic.
// This function creates a pseudo-random but deterministic starting view count based on the video slug.
const initializeViewCounts = (videos: Video[]): void => {
  videos.forEach(video => {
    // Only initialize if not already set
    if (_viewCounts[video.slug] === undefined) {
      const hash = video.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      // Formula to generate high, varied, and deterministic view counts (10K to 500K+ range)
      const baseViews = (hash % 50000) * (video.tags.length + 1) + (hash % 25000) + 10000;
      const multiplier = (hash % 3) + 2; // Random multiplier between 2-4
      _viewCounts[video.slug] = Math.floor(baseViews * multiplier);
    }
  });
};

// Initialize static videos immediately
initializeViewCounts(getAllVideos());

// Initialize dynamic videos asynchronously
getAllVideosWithDynamic().then(allVideos => {
  initializeViewCounts(allVideos);
}).catch(error => {
  console.warn('Could not initialize view counts for dynamic videos:', error);
});

/**
 * Increments the view count for a specific video slug.
 * This simulates a user watching a video.
 * @param slug - The unique identifier for the video.
 */
export function trackView(slug: string): void {
  if (typeof _viewCounts[slug] === 'number') {
    _viewCounts[slug]++;
  } else {
    // If for some reason a video is not in the initial list, generate a baseline count first
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseViews = (hash % 50000) * 3 + (hash % 25000) + 10000;
    const multiplier = (hash % 3) + 2;
    _viewCounts[slug] = Math.floor(baseViews * multiplier) + 1;
  }
}

/**
 * Retrieves the current view count for a specific video slug.
 * @param slug - The unique identifier for the video.
 * @returns The number of views.
 */
export function getViews(slug: string): number {
  if (_viewCounts[slug] === undefined) {
    // Generate a baseline count if not initialized
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseViews = (hash % 50000) * 3 + (hash % 25000) + 10000;
    const multiplier = (hash % 3) + 2;
    _viewCounts[slug] = Math.floor(baseViews * multiplier);
  }
  return _viewCounts[slug];
}

interface ViewData {
  count: number;
  timestamp: number;
}

interface TrendingViews {
  [videoId: string]: ViewData[];
}

const TRENDING_STORAGE_KEY = 'video_trending_views';

const getStoredTrendingViews = (): TrendingViews => {
  try {
    const stored = localStorage.getItem(TRENDING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// This part of the code is a replacement for the existing trackView and getViews functions,
// and also introduces new functions for trending views.
// The original getStoredViews and STORAGE_KEY are assumed to be defined elsewhere and are used here.
// Assuming STORAGE_KEY is defined and getStoredViews() is available in the scope.

// Mock implementation for getStoredViews and STORAGE_KEY for completeness,
// as they are referenced in the changes but not provided in the original snippet.
const STORAGE_KEY = 'video_views';
const getStoredViews = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const trackView = (videoId: string) => {
  const views = getStoredViews();
  views[videoId] = (views[videoId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));

  // Track for trending
  const trendingViews = getStoredTrendingViews();
  const now = Date.now();

  if (!trendingViews[videoId]) {
    trendingViews[videoId] = [];
  }

  trendingViews[videoId].push({ count: 1, timestamp: now });

  // Clean up old views (older than 7 days)
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  trendingViews[videoId] = trendingViews[videoId].filter(view => view.timestamp > sevenDaysAgo);

  localStorage.setItem(TRENDING_STORAGE_KEY, JSON.stringify(trendingViews));
};

export const getViews = (videoId: string): number => {
  const views = getStoredViews();
  return views[videoId] || 0;
};

export const getTrendingViews = (videoId: string, hours: number = 24): number => {
  const trendingViews = getStoredTrendingViews();
  const views = trendingViews[videoId] || [];
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);

  return views.filter(view => view.timestamp > cutoff).length;
};

export const getAllTrendingViews = (hours: number = 24): Record<string, number> => {
  const trendingViews = getStoredTrendingViews();
  const result: Record<string, number> = {};
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);

  for (const [videoId, views] of Object.entries(trendingViews)) {
    result[videoId] = views.filter(view => view.timestamp > cutoff).length;
  }

  return result;
};