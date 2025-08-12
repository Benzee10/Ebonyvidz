
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

interface ViewData {
  count: number;
  timestamp: number;
}

interface TrendingViews {
  [videoId: string]: ViewData[];
}

const STORAGE_KEY = 'video_views';
const TRENDING_STORAGE_KEY = 'video_trending_views';

const getStoredViews = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const getStoredTrendingViews = (): TrendingViews => {
  try {
    const stored = localStorage.getItem(TRENDING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Increments the view count for a specific video slug.
 * This simulates a user watching a video.
 * @param slug - The unique identifier for the video.
 */
export function trackView(slug: string): void {
  // Update localStorage views
  const views = getStoredViews();
  views[slug] = (views[slug] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));

  // Update in-memory views for fallback
  if (typeof _viewCounts[slug] === 'number') {
    _viewCounts[slug]++;
  } else {
    // If for some reason a video is not in the initial list, generate a baseline count first
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseViews = (hash % 50000) * 3 + (hash % 25000) + 10000;
    const multiplier = (hash % 3) + 2;
    _viewCounts[slug] = Math.floor(baseViews * multiplier) + 1;
  }

  // Track for trending
  const trendingViews = getStoredTrendingViews();
  const now = Date.now();

  if (!trendingViews[slug]) {
    trendingViews[slug] = [];
  }

  trendingViews[slug].push({ count: 1, timestamp: now });

  // Clean up old views (older than 7 days)
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  trendingViews[slug] = trendingViews[slug].filter(view => view.timestamp > sevenDaysAgo);

  localStorage.setItem(TRENDING_STORAGE_KEY, JSON.stringify(trendingViews));
}

/**
 * Retrieves the current view count for a specific video slug.
 * @param slug - The unique identifier for the video.
 * @returns The number of views.
 */
export function getViews(slug: string): number {
  // First try localStorage
  const views = getStoredViews();
  if (views[slug] !== undefined) {
    return views[slug];
  }

  // Fallback to in-memory views
  if (_viewCounts[slug] === undefined) {
    // Generate a baseline count if not initialized
    const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseViews = (hash % 50000) * 3 + (hash % 25000) + 10000;
    const multiplier = (hash % 3) + 2;
    _viewCounts[slug] = Math.floor(baseViews * multiplier);
  }
  return _viewCounts[slug];
}

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
