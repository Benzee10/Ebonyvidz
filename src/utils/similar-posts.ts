
import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "@utils/content-utils";

export interface SimilarPost {
  slug: string;
  data: CollectionEntry<"posts">["data"];
  similarity: number;
}

// Simple in-memory cache with TTL to allow new content to appear
const similarPostsCache = new Map<string, { results: SimilarPost[], timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

export function findSimilarPosts(
  currentPost: CollectionEntry<"posts">,
  allPosts: CollectionEntry<"posts">[],
  limit: number = 4,
  videosOnly: boolean = false
): SimilarPost[] {
  if (!currentPost || !allPosts || allPosts.length === 0) {
    return [];
  }

  const currentTags = currentPost.data.tags || [];
  const currentCategory = currentPost.data.category;

  // Filter out the current post, draft posts, and optionally filter for videos only
  const otherPosts = allPosts.filter(post => 
    post.slug !== currentPost.slug && 
    !post.data.draft &&
    (!videosOnly || post.data.videoUrl) // Only include posts with videoUrl if videosOnly is true
  );

  if (otherPosts.length === 0) {
    return [];
  }

  // Calculate similarity scores with enhanced algorithm
  const postsWithScores = otherPosts.map(post => {
    let similarity = 0;
    const postTags = post.data.tags || [];

    // Category match gives highest score (3x weight)
    if (post.data.category === currentCategory) {
      similarity += 3.0;
    }

    // Tag matches with Jaccard similarity (2x weight)
    const commonTags = currentTags.filter(tag => 
      postTags.includes(tag)
    );
    const unionTags = new Set([...currentTags, ...postTags]);
    const jaccardSimilarity = commonTags.length / unionTags.size;
    similarity += jaccardSimilarity * 2.0;

    // Same language bonus (1.5x weight)
    if (post.data.lang === currentPost.data.lang) {
      similarity += 1.5;
    }

    // Recency bonus (0.5x weight)
    const daysDiff = (Date.now() - new Date(post.data.published).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - daysDiff / 365); // Decay over a year
    similarity += recencyScore * 0.5;

    // Small random factor for variety
    similarity += Math.random() * 0.1;

    return {
      slug: post.slug,
      data: post.data,
      similarity
    };
  });

  // Sort by similarity and get recent posts if no matches
  const sortedPosts = postsWithScores.sort((a, b) => {
    if (b.similarity !== a.similarity) {
      return b.similarity - a.similarity;
    }
    // If similarity is equal, prefer more recent posts
    return new Date(b.data.published).getTime() - new Date(a.data.published).getTime();
  });

  // Always return at least some posts (most recent if no similarities found)
  const result = sortedPosts.slice(0, limit);
  
  // If we don't have enough similar posts, fill with recent posts
  if (result.length < limit && result.length < otherPosts.length) {
    const recentPosts = otherPosts
      .filter(post => !result.some(r => r.slug === post.slug))
      .sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime())
      .slice(0, limit - result.length)
      .map(post => ({
        slug: post.slug,
        data: post.data,
        similarity: 0.1
      }));
    
    result.push(...recentPosts);
  }

  return result;
}

// Enhanced function that works with Astro content collections
export async function getSimilarPosts(
  currentPost: CollectionEntry<"posts">,
  limit: number = 4,
  videosOnly: boolean = false
): Promise<CollectionEntry<"posts">[]> {
  const allPosts = await getSortedPosts();
  const cacheKey = `${currentPost.slug}-${limit}-${videosOnly}-${allPosts.length}`;
  
  // Check cache with TTL
  const cached = similarPostsCache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    // Convert back to CollectionEntry format
    return cached.results.map(result => 
      allPosts.find(post => post.slug === result.slug)!
    ).filter(Boolean);
  }
  
  const similarPosts = findSimilarPosts(currentPost, allPosts, limit, videosOnly);
  
  // Cache the results with timestamp
  similarPostsCache.set(cacheKey, { results: similarPosts, timestamp: now });
  
  // Convert to CollectionEntry format
  return similarPosts.map(result => 
    allPosts.find(post => post.slug === result.slug)!
  ).filter(Boolean);
}

// Video-specific function for easier usage
export async function getSimilarVideos(
  currentPost: CollectionEntry<"posts">,
  limit: number = 4
): Promise<CollectionEntry<"posts">[]> {
  return getSimilarPosts(currentPost, limit, true);
}
