<script>
  import { onMount } from 'svelte';
  
  let showBanner = true;
  let isSticky = false;
  const smartLink = "https://whatsappad.vercel.app/";
  
  function handleClick() {
    window.open(smartLink, '_blank');
  }
  
  function closeBanner() {
    showBanner = false;
    localStorage.setItem('bannerClosed', Date.now().toString());
  }
  
  onMount(() => {
    const lastClosed = localStorage.getItem('bannerClosed');
    if (lastClosed) {
      const hoursSinceClosed = (Date.now() - parseInt(lastClosed)) / (1000 * 60 * 60);
      if (hoursSinceClosed < 24) {
        showBanner = false;
      }
    }
    
    const handleScroll = () => {
      isSticky = window.scrollY > 100;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

{#if showBanner}
  <div class="smart-banner" class:sticky={isSticky}>
    <div class="banner-content">
      <div class="banner-icon">🔥</div>
      <div class="banner-text">
        <strong>Exclusive Access!</strong>
        <span>Join our premium community for unlimited content</span>
      </div>
      <button class="banner-cta" on:click={handleClick}>
        Get Access Now →
      </button>
      <button class="banner-close" on:click={closeBanner} aria-label="Close banner">×</button>
    </div>
  </div>
{/if}

<style>
  .smart-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    z-index: 9998;
    transform: translateY(0);
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .smart-banner.sticky {
    top: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .banner-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .banner-icon {
    font-size: 24px;
    animation: pulse 2s infinite;
  }
  
  .banner-text {
    flex: 1;
    min-width: 200px;
  }
  
  .banner-text strong {
    display: block;
    font-size: 16px;
    margin-bottom: 2px;
  }
  
  .banner-text span {
    font-size: 14px;
    opacity: 0.9;
  }
  
  .banner-cta {
    background: white;
    color: #667eea;
    border: none;
    padding: 10px 24px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  .banner-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .banner-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
  }
  
  .banner-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: 768px) {
    .banner-text {
      flex: 100%;
      order: 2;
    }
    
    .banner-icon {
      order: 1;
    }
    
    .banner-cta {
      order: 3;
      flex: 1;
    }
    
    .banner-close {
      order: 4;
    }
    
    .banner-text span {
      font-size: 12px;
    }
  }
</style>
