import { Video } from '../types';

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

// Function to load videos from markdown files
async function loadVideosFromFiles(): Promise<Video[]> {
  const allVideos: Video[] = [];

  try {
    // Import all markdown files from all folders (supports unlimited nesting)
    const moduleFiles = import.meta.glob('/lib/data/**/*.md', {
      as: 'raw',
      eager: false
    });

    for (const [path, moduleLoader] of Object.entries(moduleFiles)) {
      try {
        const content = await moduleLoader();
        const video = parseMarkdownToVideo(content);

        if (video) {
          allVideos.push(addUploadDateToVideo(video));
        }
      } catch (fileError) {
        console.warn(`Could not load video file ${path}:`, fileError);
      }
    }
  } catch (error) {
    console.warn('Error loading video files:', error);
  }

  return allVideos;
}

// Static video data (empty array)
const staticVideoData: string[] = [];

export function getAllVideos(): Video[] {
  const staticVideos = staticVideoData.map(markdownContent => {
    const video = parseMarkdownToVideo(markdownContent);
    return video ? addUploadDateToVideo(video) : null;
  }).filter(Boolean) as Video[];

  return staticVideos;
}

export async function getAllVideosWithDynamic(): Promise<Video[]> {
  const staticVideos = getAllVideos();
  const fileVideos = await loadVideosFromFiles();

  // Combine and deduplicate videos (file videos override static ones with same slug)
  const allVideos = [...staticVideos];
  const staticSlugs = new Set(staticVideos.map(v => v.slug));

  for (const fileVideo of fileVideos) {
    if (!staticSlugs.has(fileVideo.slug)) {
      allVideos.push(fileVideo);
    }
  }

  return allVideos;
}

export function getVideoBySlug(slug: string): Video | undefined {
  const allVideos = getAllVideos();
  return allVideos.find(v => v.slug === slug);
}

export async function getVideoBySlugWithDynamic(slug: string): Promise<Video | undefined> {
  const allVideos = await getAllVideosWithDynamic();
  return allVideos.find(v => v.slug === slug);
}

export function getAllTags(): string[] {
  const allVideos = getAllVideos();
  const tagSet = new Set<string>();

  for (const video of allVideos) {
    for (const tag of video.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export async function getAllTagsWithDynamic(): Promise<string[]> {
  const allVideos = await getAllVideosWithDynamic();
  const tagSet = new Set<string>();

  for (const video of allVideos) {
    for (const tag of video.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}