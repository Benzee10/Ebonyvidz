<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  let isVisible = false;
  let currentLevel = 1;
  let position = 'top-right';
  let dismissCount = 0;
  let comebackTimer: number;
  let overlayElement: HTMLElement;
  let isDestroyed = false;
  
  // Smart link URL - replace with your actual smart link
  const SMART_LINK_URL = "https://whatsappad.vercel.app/";
  
  // Position options for smart repositioning
  const positions = [
    'top-right', 'top-left', 'bottom-right', 'bottom-left', 
    'center', 'top-center', 'bottom-center', 'center-left', 'center-right'
  ];
  
  // Escalation levels
  const levels = [
    { delay: 3000, hasCloseBtn: true, size: 'small', message: 'Unlock Premium Content!' },
    { delay: 2000, hasCloseBtn: true, size: 'medium', message: '🔥 Don\'t Miss Out - Premium Access!' },
    { delay: 1500, hasCloseBtn: false, size: 'medium', message: '⚡ Limited Time - Click Now!' },
    { delay: 1000, hasCloseBtn: false, size: 'large', message: '🚨 URGENT: Premium Content Waiting!' },
    { delay: 500, hasCloseBtn: false, size: 'large', message: '💥 FINAL CHANCE - Click Before It\'s Gone!' },
    { delay: 0, hasCloseBtn: false, size: 'fullscreen', message: '🎯 YOU\'VE EARNED IT - CLAIM YOUR REWARD!' }
  ];
  
  let currentLevelData = levels[0];
  
  // Load state from localStorage
  function loadState() {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('invincible_overlay_state');
      if (saved) {
        const state = JSON.parse(saved);
        dismissCount = state.dismissCount || 0;
        currentLevel = Math.min(state.currentLevel || 1, 6);
        position = state.lastPosition || 'top-right';
        
        // Escalate based on total dismissals
        if (dismissCount > 15) currentLevel = 6;
        else if (dismissCount > 12) currentLevel = 5;
        else if (dismissCount > 9) currentLevel = 4;
        else if (dismissCount > 6) currentLevel = 3;
        else if (dismissCount > 3) currentLevel = 2;
        
        currentLevelData = levels[currentLevel - 1];
      }
    } catch (e) {
      console.log('Failed to load overlay state');
    }
  }
  
  // Save state to localStorage
  function saveState() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('invincible_overlay_state', JSON.stringify({
        dismissCount,
        currentLevel,
        lastPosition: position,
        lastSeen: Date.now()
      }));
    } catch (e) {
      console.log('Failed to save overlay state');
    }
  }
  
  // Smart repositioning logic
  function getNextPosition() {
    const currentIndex = positions.indexOf(position);
    // Avoid recently used positions
    let nextIndex;
    if (dismissCount < 3) {
      // First few dismissals - use corner positions
      nextIndex = (currentIndex + 1) % 4;
    } else if (dismissCount < 6) {
      // Mid-level - use all positions
      nextIndex = (currentIndex + 2) % positions.length;
    } else {
      // High dismissal count - random positioning
      nextIndex = Math.floor(Math.random() * positions.length);
    }
    return positions[nextIndex];
  }
  
  // Show overlay with smart timing
  function showOverlay() {
    if (isDestroyed) return;
    
    position = getNextPosition();
    currentLevelData = levels[currentLevel - 1];
    isVisible = true;
    saveState();
    
    // Add shake animation for higher levels
    if (currentLevel >= 4 && overlayElement) {
      setTimeout(() => {
        overlayElement?.classList.add('shake');
      }, 500);
    }
  }
  
  // Handle dismiss attempt
  function handleDismiss(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    dismissCount++;
    
    // Level 4+ - fake dismiss buttons
    if (currentLevel >= 4 && Math.random() < 0.7) {
      // 70% chance the dismiss doesn't work at higher levels
      overlayElement?.classList.add('shake');
      setTimeout(() => overlayElement?.classList.remove('shake'), 500);
      saveState();
      return;
    }
    
    isVisible = false;
    
    // Escalate level after certain dismissal counts
    if (dismissCount % 2 === 0 && currentLevel < 6) {
      currentLevel++;
      currentLevelData = levels[currentLevel - 1]; // Update level data immediately
    }
    
    saveState();
    scheduleComeback();
  }
  
  // Schedule the overlay comeback
  function scheduleComeback() {
    if (isDestroyed) return;
    
    // At max level, be more persistent - shorter delays
    const delay = currentLevel >= 6 ? 2000 : currentLevelData.delay;
    comebackTimer = setTimeout(() => {
      if (!isDestroyed) {
        showOverlay();
      }
    }, delay) as unknown as number;
  }
  
  // Handle smart link click
  function handleSmartLinkClick() {
    // Record the conversion
    try {
      localStorage.setItem('overlay_converted', 'true');
    } catch (e) {}
    
    // Open smart link securely (prevent reverse tabnabbing)
    const newWindow = window.open(SMART_LINK_URL, '_blank', 'noopener');
    if (newWindow) newWindow.opener = null;
    
    // Hide overlay for this session
    isVisible = false;
    isDestroyed = true;
  }
  
  // Detect if user is trying to inspect/block overlay
  function detectBlockingAttempts() {
    if (typeof window === 'undefined') return;
    
    // Detect right-click on overlay (trying to inspect)
    const handleRightClick = (e: MouseEvent) => {
      if (overlayElement?.contains(e.target as Node)) {
        e.preventDefault();
        // Escalate as punishment for trying to inspect
        currentLevel = Math.min(currentLevel + 1, 6);
        handleDismiss();
      }
    };
    
    document.addEventListener('contextmenu', handleRightClick);
    
    return () => document.removeEventListener('contextmenu', handleRightClick);
  }
  
  // Mutation observer to detect if overlay is removed via DOM manipulation
  function setupMutationObserver() {
    if (typeof window === 'undefined' || !overlayElement) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if our overlay was removed
          if (!document.contains(overlayElement) && isVisible) {
            // Overlay was forcibly removed - recreate it with escalation
            currentLevel = Math.min(currentLevel + 2, 6);
            setTimeout(() => showOverlay(), 100);
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return observer;
  }
  
  onMount(() => {
    loadState();
    
    // Check if user already converted this session
    const converted = localStorage.getItem('overlay_converted');
    if (converted) {
      isDestroyed = true;
      return;
    }
    
    // Initial delay before first appearance
    setTimeout(() => {
      if (!isDestroyed) {
        showOverlay();
      }
    }, 5000);
    
    // Setup blocking detection
    const cleanupBlockingDetection = detectBlockingAttempts();
    
    // Setup mutation observer after overlay is created
    let observer: MutationObserver;
    const checkForOverlay = setInterval(() => {
      if (overlayElement) {
        observer = setupMutationObserver();
        clearInterval(checkForOverlay);
      }
    }, 100);
    
    return () => {
      isDestroyed = true;
      cleanupBlockingDetection?.();
      observer?.disconnect();
      clearTimeout(comebackTimer);
      clearInterval(checkForOverlay);
    };
  });
  
  onDestroy(() => {
    isDestroyed = true;
    clearTimeout(comebackTimer);
  });
</script>

{#if isVisible}
  <div 
    bind:this={overlayElement}
    class="invincible-overlay {position} {currentLevelData.size}"
    class:shake={false}
    style="z-index: {9999 + currentLevel};"
  >
    <div class="overlay-content level-{currentLevel}">
      {#if currentLevelData.hasCloseBtn && currentLevel < 4}
        <button 
          class="close-btn real-close" 
          on:click={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>
      {:else if currentLevel >= 4}
        <!-- Fake close buttons for higher levels -->
        <button 
          class="close-btn fake-close" 
          on:click={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>
        <button 
          class="close-btn fake-close-2" 
          on:click={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>
      {/if}
      
      <div class="message">
        {currentLevelData.message}
      </div>
      
      <button 
        class="cta-button"
        on:click={handleSmartLinkClick}
      >
        {#if currentLevel >= 5}
          🎁 CLAIM NOW 🎁
        {:else if currentLevel >= 3}
          🚀 ACCESS NOW 🚀
        {:else}
          ▶️ Watch Now
        {/if}
      </button>
      
      {#if dismissCount > 5}
        <div class="persistence-counter">
          Dismissed {dismissCount} times 😏
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .invincible-overlay {
    position: fixed;
    z-index: 9999;
    pointer-events: auto !important;
    user-select: none;
    animation: slideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  /* Positioning */
  .top-right { top: 20px; right: 20px; }
  .top-left { top: 20px; left: 20px; }
  .bottom-right { bottom: 20px; right: 20px; }
  .bottom-left { bottom: 20px; left: 20px; }
  .center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
  .top-center { top: 20px; left: 50%; transform: translateX(-50%); }
  .bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
  .center-left { top: 50%; left: 20px; transform: translateY(-50%); }
  .center-right { top: 50%; right: 20px; transform: translateY(-50%); }
  
  /* Sizes */
  .small .overlay-content { width: 280px; padding: 16px; }
  .medium .overlay-content { width: 320px; padding: 20px; }
  .large .overlay-content { width: 380px; padding: 24px; }
  .fullscreen .overlay-content { 
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.95) !important;
    border-radius: 0 !important;
  }
  
  .overlay-content {
    background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 2px solid transparent;
    position: relative;
    text-align: center;
    color: white;
  }
  
  /* Level-specific styling */
  .level-1 .overlay-content { border-color: rgba(59, 130, 246, 0.3); }
  .level-2 .overlay-content { 
    border-color: rgba(234, 179, 8, 0.5);
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.2), 0 20px 50px rgba(0, 0, 0, 0.5);
  }
  .level-3 .overlay-content { 
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.3), 0 20px 50px rgba(0, 0, 0, 0.5);
    animation: pulse 2s infinite;
  }
  .level-4 .overlay-content,
  .level-5 .overlay-content { 
    border-color: rgba(168, 85, 247, 0.8);
    box-shadow: 0 0 40px rgba(168, 85, 247, 0.4), 0 20px 50px rgba(0, 0, 0, 0.5);
    animation: pulse 1s infinite, glow 1.5s infinite alternate;
  }
  .level-6 .overlay-content { 
    border-color: rgba(239, 68, 68, 1);
    box-shadow: 0 0 50px rgba(239, 68, 68, 0.6), 0 20px 50px rgba(0, 0, 0, 0.7);
    animation: pulse 0.5s infinite, glow 0.8s infinite alternate, rainbow 3s infinite;
  }
  
  .close-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.3s ease;
    z-index: 10;
  }
  
  .close-btn:hover {
    background: rgba(239, 68, 68, 1);
    transform: scale(1.1);
  }
  
  /* Fake close buttons */
  .fake-close-2 {
    top: -8px;
    right: 30px;
    opacity: 0.7;
  }
  
  .message {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  
  .level-3 .message,
  .level-4 .message,
  .level-5 .message { font-size: 20px; }
  .level-6 .message { font-size: 24px; text-shadow: 0 0 10px currentColor; }
  
  .cta-button {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none;
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    text-decoration: none;
    display: inline-block;
    min-width: 140px;
  }
  
  .cta-button:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
  }
  
  .level-4 .cta-button,
  .level-5 .cta-button,
  .level-6 .cta-button {
    font-size: 18px;
    padding: 16px 32px;
    animation: buttonPulse 1s infinite alternate;
  }
  
  .persistence-counter {
    margin-top: 12px;
    font-size: 12px;
    opacity: 0.8;
    font-style: italic;
  }
  
  /* Animations */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes glow {
    from { box-shadow: 0 0 20px currentColor, 0 20px 50px rgba(0, 0, 0, 0.5); }
    to { box-shadow: 0 0 40px currentColor, 0 20px 50px rgba(0, 0, 0, 0.5); }
  }
  
  @keyframes rainbow {
    0% { border-color: #ff0000; }
    16% { border-color: #ff8000; }
    33% { border-color: #ffff00; }
    50% { border-color: #00ff00; }
    66% { border-color: #0080ff; }
    83% { border-color: #8000ff; }
    100% { border-color: #ff0000; }
  }
  
  @keyframes buttonPulse {
    from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    to { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
  }
  
  .shake {
    animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .invincible-overlay {
      margin: 10px;
    }
    
    .small .overlay-content,
    .medium .overlay-content { width: calc(100vw - 40px); max-width: 320px; }
    .large .overlay-content { width: calc(100vw - 20px); max-width: 380px; }
    
    .fullscreen .overlay-content { padding: 20px; }
    
    .center, .top-center, .bottom-center { 
      left: 50%;
      transform: translateX(-50%);
    }
  }
  
  /* Prevent overlay blocking */
  .invincible-overlay {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: auto !important;
    visibility: visible !important;
    display: block !important;
    opacity: 1 !important;
  }
  
  /* Force visibility - more targeted approach */
  .invincible-overlay,
  .invincible-overlay .overlay-content,
  .invincible-overlay .message,
  .invincible-overlay .cta-button,
  .invincible-overlay .close-btn {
    pointer-events: auto !important;
    visibility: visible !important;
    display: block !important;
  }
  
  .invincible-overlay .overlay-content {
    display: flex !important;
    flex-direction: column !important;
  }
  
  .message, .persistence-counter {
    display: block !important;
  }
  
  .cta-button {
    display: inline-block !important;
  }
</style>