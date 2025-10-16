<script>
  import { onMount } from 'svelte';
  
  export let showAfterSeconds = 30;
  let showGate = false;
  const smartLink = "https://whatsappad.vercel.app/";
  
  function handleUnlock() {
    window.open(smartLink, '_blank');
  }
  
  function maybeLater() {
    showGate = false;
    localStorage.setItem('gateDelay', Date.now().toString());
  }
  
  onMount(() => {
    const lastDelay = localStorage.getItem('gateDelay');
    let delay = showAfterSeconds * 1000;
    
    if (lastDelay) {
      const hoursSinceDelay = (Date.now() - parseInt(lastDelay)) / (1000 * 60 * 60);
      if (hoursSinceDelay < 12) {
        return; // Don't show if delayed within last 12 hours
      }
    }
    
    const timer = setTimeout(() => {
      showGate = true;
    }, delay);
    
    return () => clearTimeout(timer);
  });
</script>

{#if showGate}
  <div class="unlock-overlay" on:click={maybeLater} on:keydown={(e) => e.key === 'Escape' && maybeLater()} role="dialog" aria-modal="true" tabindex="-1">
    <div class="unlock-modal" on:click|stopPropagation role="document">
      <div class="unlock-header">
        <div class="unlock-icon">🔓</div>
        <h2>Unlock Premium Content</h2>
        <p>Get instant access to exclusive videos and photo galleries</p>
      </div>
      
      <div class="unlock-benefits">
        <div class="benefit">✨ Unlimited HD Videos</div>
        <div class="benefit">📸 Exclusive Photo Galleries</div>
        <div class="benefit">🔥 New Content Daily</div>
        <div class="benefit">💎 VIP Member Perks</div>
      </div>
      
      <div class="unlock-actions">
        <button class="unlock-btn" on:click={handleUnlock}>
          🚀 Unlock Now - It's Free!
        </button>
        <button class="later-btn" on:click={maybeLater}>
          Maybe Later
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .unlock-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  }
  
  .unlock-modal {
    background: white;
    border-radius: 24px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.4s ease;
  }
  
  .unlock-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .unlock-icon {
    font-size: 64px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
  }
  
  .unlock-header h2 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .unlock-header p {
    color: #666;
    font-size: 16px;
  }
  
  .unlock-benefits {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 30px;
  }
  
  .benefit {
    background: linear-gradient(135deg, #667eea15, #764ba215);
    padding: 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
  
  .unlock-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .unlock-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .unlock-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }
  
  .later-btn {
    background: none;
    border: 2px solid #ddd;
    color: #666;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .later-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: 640px) {
    .unlock-modal {
      padding: 30px 20px;
    }
    
    .unlock-header h2 {
      font-size: 24px;
    }
    
    .unlock-benefits {
      grid-template-columns: 1fr;
    }
    
    .unlock-btn {
      font-size: 16px;
      padding: 14px 28px;
    }
  }
</style>
