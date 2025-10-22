<script lang="ts">
  const telegramUrl = "https://t.me/xxx_pulse";
  
  const handleClick = () => {
    window.open(telegramUrl, '_blank');
  };
</script>

<button 
  class="telegram-button" 
  on:click={handleClick}
  aria-label="Join our Telegram channel"
>
  <svg class="telegram-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
  <span class="telegram-text">Join Channel</span>
</button>

<style>
  .telegram-button {
    position: fixed;
    bottom: 24px;
    left: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    background: linear-gradient(135deg, #0088cc, #229ED9);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0, 136, 204, 0.35);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    letter-spacing: -0.025em;
  }
  
  .telegram-button:hover {
    background: linear-gradient(135deg, #007ab8, #1e8bc3);
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 136, 204, 0.45);
  }
  
  .telegram-button:active {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 136, 204, 0.35);
  }
  
  .telegram-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  
  .telegram-text {
    white-space: nowrap;
  }
  
  @media (max-width: 768px) {
    .telegram-button {
      bottom: 20px;
      left: 20px;
      padding: 12px 18px;
      font-size: 14px;
    }
    
    .telegram-icon {
      width: 20px;
      height: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .telegram-button {
      bottom: 16px;
      left: 16px;
      padding: 10px 16px;
      font-size: 13px;
      gap: 8px;
    }
    
    .telegram-icon {
      width: 18px;
      height: 18px;
    }
  }
</style>
