#!/usr/bin/env tsx

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import types and functions from the main app
interface Video {
  slug: string;
  title: string;
  uploadDate: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  tags: string[];
  description: string;
}

// Get the base URL for absolute URLs (will be set at build time)
const BASE_URL = process.env.BASE_URL || 'https://localhost:5000';

// Helper to create a URL-friendly slug from a string
const createSlug = (title: string) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Function to parse markdown content into a Video object
const parseMarkdownToVideo = (markdown: string): Omit<Video, 'uploadDate'> | null => {
  if (!markdown.trim()) return null;

  const lines = markdown.split('\n');
  let title = '';
  let videoUrl = '';
  let thumbnail = '';
  let duration = '';
  let tags: string[] = [];
  let description = '';

  // Extract title from first line (remove # and trim)
  const titleLine = lines.find(line => line.startsWith('# '));
  if (titleLine) {
    title = titleLine.replace('# ', '').trim();
  }

  // Extract other fields
  for (const line of lines) {
    if (line.startsWith('**Video URL:**')) {
      videoUrl = line.replace('**Video URL:**', '').trim();
    } else if (line.startsWith('**Thumbnail:**')) {
      thumbnail = line.replace('**Thumbnail:**', '').trim();
    } else if (line.startsWith('**Duration:**')) {
      duration = line.replace('**Duration:**', '').trim();
    } else if (line.startsWith('**Tags:**')) {
      const tagString = line.replace('**Tags:**', '').trim();
      tags = tagString.split(',').map(tag => tag.trim()).filter(Boolean);
    } else if (line.startsWith('**Description:**')) {
      description = line.replace('**Description:**', '').trim();
    }
  }

  if (!title || !videoUrl) {
    return null;
  }

  return {
    slug: createSlug(title),
    title,
    thumbnail,
    videoUrl,
    duration,
    tags,
    description: description === '.' ? '' : description,
  };
};

// Function to add upload date to video
const addUploadDateToVideo = (video: Omit<Video, 'uploadDate'>): Video => ({
  ...video,
  uploadDate: new Date().toISOString().split('T')[0],
});

// Template for the HTML page with Open Graph meta tags
const createVideoPageHTML = (video: Video): string => {
  const fullThumbnailUrl = video.thumbnail.startsWith('http') ? video.thumbnail : `${BASE_URL}${video.thumbnail}`;
  const videoPageUrl = `${BASE_URL}/video/${video.slug}`;
  const safeTitle = video.title.replace(/"/g, '&quot;');
  const safeDescription = (video.description || 'Watch this amazing video').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Basic Meta Tags -->
    <title>${safeTitle} - XXXPULSE</title>
    <meta name="description" content="${safeDescription}" />
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="video.other" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${fullThumbnailUrl}" />
    <meta property="og:image:width" content="1280" />
    <meta property="og:image:height" content="720" />
    <meta property="og:url" content="${videoPageUrl}" />
    <meta property="og:site_name" content="XXXPULSE" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${fullThumbnailUrl}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${videoPageUrl}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    
    <!-- Import map and CSS -->
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.1.1",
        "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
        "react/": "https://esm.sh/react@^19.1.1/",
        "react-router-dom": "https://esm.sh/react-router-dom@^7.7.1",
        "@google/genai": "https://esm.sh/@google/genai@^1.12.0"
      }
    }
    </script>
    <link rel="stylesheet" href="/src/index.css">
    
    <!-- Load the main app -->
    <script type="module" src="/index.tsx"></script>
  </head>
  <body>
    <div id="root">
      <!-- Loading placeholder while React loads -->
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #111; color: white;">
        <div>Loading ${safeTitle}...</div>
      </div>
    </div>
  </body>
</html>`;
};

// Load videos using the existing video loading functions
async function loadVideos(): Promise<Video[]> {
  console.log('Loading videos from data files...');
  
  try {
    // We'll need to implement the video loading logic here
    // For now, let's create a simple version that reads the data directory
    const fs = await import('fs');
    const path = await import('path');
    
    const videos: Video[] = [];
    const dataDir = path.join(process.cwd(), 'lib', 'data');
    
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      console.log('No data directory found, skipping video loading');
      return videos;
    }
    
    // Recursively find all .md files
    const findMarkdownFiles = (dir: string): string[] => {
      const files: string[] = [];
      
      try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            files.push(...findMarkdownFiles(fullPath));
          } else if (item.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        console.warn(`Error reading directory ${dir}:`, error);
      }
      
      return files;
    };
    
    const markdownFiles = findMarkdownFiles(dataDir);
    console.log(`Found ${markdownFiles.length} markdown files`);
    
    // Parse each markdown file into a video object
    for (const filePath of markdownFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const video = parseMarkdownToVideo(content);
        
        if (video) {
          videos.push(addUploadDateToVideo(video));
        }
      } catch (error) {
        console.warn(`Error parsing ${filePath}:`, error);
      }
    }
    
    console.log(`Successfully loaded ${videos.length} videos`);
    return videos;
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}

// Generate static HTML pages for all videos
async function generateOGPages() {
  try {
    console.log('Starting Open Graph page generation...');
    
    const videos = await loadVideos();
    const distDir = join(process.cwd(), 'dist');
    
    console.log(`Found ${videos.length} videos to process`);
    
    // Create the dist directory if it doesn't exist
    mkdirSync(distDir, { recursive: true });
    
    for (const video of videos) {
      const videoDir = join(distDir, 'video', video.slug);
      mkdirSync(videoDir, { recursive: true });
      
      const htmlContent = createVideoPageHTML(video);
      const htmlPath = join(videoDir, 'index.html');
      
      writeFileSync(htmlPath, htmlContent, 'utf-8');
      console.log(`Generated: ${htmlPath}`);
    }
    
    console.log(`Successfully generated ${videos.length} Open Graph pages`);
  } catch (error) {
    console.error('Error generating Open Graph pages:', error);
    process.exit(1);
  }
}

// Run the generator
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOGPages();
}

export { generateOGPages, createVideoPageHTML };