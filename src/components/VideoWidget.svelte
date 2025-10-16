
<script lang="ts">
  import { onMount } from 'svelte';
  
  let isVisible = false;
  let isMinimized = false;
  let videoElement: HTMLVideoElement;
  
  const videoUrls = [
    "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b99880ff529.06142108.mp4",
    "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9964d538f7.59762869.mp4",
    "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b996f8e2100.68901658.mp4",
    "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9991c5d4f2.73297277.mp4"
  ];
  
  const redirectUrl = "https://whatsappad.vercel.app";
  
  let currentVideoUrl = "";
  
  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoUrls.length);
    return videoUrls[randomIndex];
  };
  
  const toggleMinimize = () => {
    isMinimized = !isMinimized;
  };
  
  const closeWidget = () => {
    isVisible = false;
    // Save timestamp when closed
    localStorage.setItem('videoWidgetLastShown', Date.now().toString());
  };
  
  const handleWidgetClick = (e: MouseEvent) => {
    window.open(redirectUrl, '_blank');
  };
  
  const handleOverlayClick = (e: MouseEvent) => {
    e.stopPropagation();
    window.open(redirectUrl, '_blank');
  };
  
  const shouldShowWidget = () => {
    const lastShown = localStorage.getItem('videoWidgetLastShown');
    if (!lastShown) return true;
    
    const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
    const timeSinceLastShown = Date.now() - parseInt(lastShown);
    
    return timeSinceLastShown >= oneDayInMs;
  };
  
  onMount(() => {
    // Check if widget should be shown (once per day)
    if (!shouldShowWidget()) {
      return;
    }
    
    // Load random video
    currentVideoUrl = getRandomVideo();
    
    // Show widget after 3 seconds
    setTimeout(() => {
      isVisible = true;
      
      // Auto-play video when widget becomes visible
      setTimeout(() => {
        if (videoElement) {
          videoElement.play().catch(console.error);
        }
      }, 100);
    }, 3000);
  });
</script>

{#if isVisible}
  <div class="video-widget" class:minimized={isMinimized} on:click={handleWidgetClick}>
    <div class="video-header">
      <span class="video-title">Featured Video</span>
      <div class="video-controls">
        <button on:click|stopPropagation={toggleMinimize} class="control-btn" aria-label="Toggle minimize">
          {#if isMinimized}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          {/if}
        </button>
        <button on:click|stopPropagation={closeWidget} class="control-btn" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
    
    {#if !isMinimized}
      <div class="video-container" on:click={handleWidgetClick}>
        <div class="video-wrapper">
          <video
            bind:this={videoElement}
            controls
            muted
            loop
            class="video-player"
            src={currentVideoUrl}
          >
            Your browser does not support the video tag.
          </video>
          <div class="video-overlay">
            <button class="overlay-button" on:click={handleOverlayClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Watch Full Video</span>
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .video-widget {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 260px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
    border-radius: 12px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    z-index: 1000;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.1);
    cursor: pointer;
  }
  
  .video-widget.minimized {
    height: 48px;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
  }
  
  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.08), rgba(147, 51, 234, 0.08));
    border-bottom: 1px solid rgba(148, 163, 184, 0.08);
    backdrop-filter: blur(10px);
  }
  
  .video-title {
    color: #f1f5f9;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .video-controls {
    display: flex;
    gap: 10px;
  }
  
  .control-btn {
    background: rgba(148, 163, 184, 0.1);
    border: 1px solid rgba(148, 163, 184, 0.15);
    color: #cbd5e1;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
  }
  
  .control-btn:hover {
    color: #f1f5f9;
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.3);
    transform: scale(1.05);
  }
  
  .control-btn:active {
    transform: scale(0.95);
  }
  
  .video-container {
    padding: 0;
  }
  
  .video-wrapper {
    position: relative;
    overflow: hidden;
  }
  
  .video-player {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    object-fit: contain;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    background: #000;
  }
  
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.6));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    backdrop-filter: blur(8px);
  }
  
  .video-wrapper:hover .video-overlay {
    opacity: 1;
  }
  
  .overlay-button {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none;
    color: white;
    padding: 10px 18px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    letter-spacing: -0.025em;
  }
  
  .overlay-button:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
  
  .overlay-button:active {
    transform: translateY(0) scale(1.02);
  }
  
  @media (max-width: 768px) {
    .video-widget {
      width: 240px;
      bottom: 20px;
      right: 20px;
    }
    
    .video-header {
      padding: 10px 14px;
    }
  }
  
  @media (max-width: 480px) {
    .video-widget {
      width: 220px;
      right: 16px;
      bottom: 16px;
    }
    
    .overlay-button {
      padding: 8px 16px;
      font-size: 11px;
    }
  }
</style>
