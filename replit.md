# Overview

XXXPULSE is a premium adult video streaming platform built as a React-based Progressive Web App (PWA). The platform features a modern, dark-themed interface designed to provide a tube-site-like experience with high-quality video content. The application includes comprehensive video management, user analytics, social features, and monetization through affiliate links and advertisements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19.1.1 with TypeScript for type safety and modern development
- **Routing**: React Router DOM v7.7.1 with HashRouter for client-side navigation
- **Styling**: Tailwind CSS v4.1.11 with custom dark theme implementation
- **Build System**: Vite v6.2.0 for fast development and optimized production builds
- **PWA Implementation**: Service Worker for offline functionality and app installation

## Data Storage & Management
- **Local Storage**: Browser localStorage for user preferences, favorites, playlists, view counts, and video progress
- **Video Content**: Markdown-based video metadata stored in `/lib/data/` directory structure organized by source
- **Dynamic Content Loading**: Asynchronous loading system for video metadata from multiple sources
- **Analytics**: Client-side view tracking and trending calculations with time-based analytics

## Component Architecture
- **Video Player**: Progressive video player with custom controls, quality selection, and fullscreen support
- **Content Management**: Dynamic video card system with hover previews and skeleton loading states
- **Search & Filtering**: Real-time search with tag-based filtering and URL parameter persistence
- **Responsive Design**: Mobile-first responsive layout with touch-optimized controls

## Monetization Strategy
- **Affiliate Integration**: Smart CTA buttons and sticky widgets directing to monetization endpoints
- **Advertisement System**: Strategic ad placement with banner components throughout the application
- **Premium Upgrade Prompts**: Timed popups and quality upgrade notifications to drive conversions

## Performance Optimizations
- **Lazy Loading**: Dynamic imports and progressive content loading
- **Caching Strategy**: Service Worker implementation for offline content and performance
- **Image Optimization**: Responsive thumbnails with fallback mechanisms
- **Code Splitting**: Route-based code splitting for optimal bundle sizes

# External Dependencies

## Core Dependencies
- **@google/genai**: Gemini AI integration for potential content generation and recommendations
- **@replit/object-storage**: Cloud storage integration for scalable content management
- **@tailwindcss/typography**: Enhanced typography styling for content presentation

## Content Sources
- **24xxxx.win**: Adult video content provider with MP4 streaming
- **Xvideos**: Embedded video content through iframe integration
- **leaktube.org**: Direct MP4 video hosting and streaming
- **oxtubep1.name**: CDN-hosted video content with thumbnail support

## Third-Party Services
- **Google Analytics**: User behavior tracking and site analytics (G-H0H97SH5HQ)
- **Google Fonts**: Inter font family for consistent typography
- **Affiliate Networks**: WhatsApp-based monetization link integration

## Browser APIs
- **Service Worker API**: PWA functionality and offline capabilities
- **Local Storage API**: Client-side data persistence
- **Intersection Observer API**: Lazy loading and performance optimization
- **Media API**: Video playback and control functionality