<script>
  export let variant = 'primary'; // 'primary', 'secondary', 'floating'
  export let text = 'Access Premium Content';
  const smartLink = "https://whatsappad.vercel.app/";
  
  function handleClick() {
    window.open(smartLink, '_blank');
  }
</script>

<button 
  class="cta-button {variant}" 
  on:click={handleClick}
>
  <span class="cta-icon">🎁</span>
  <span class="cta-text">{text}</span>
  <span class="cta-arrow">→</span>
</button>

<style>
  .cta-button {
    position: relative;
    border: none;
    padding: 16px 32px;
    border-radius: 50px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
    margin: 10px 0;
  }
  
  .cta-button.primary {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }
  
  .cta-button.secondary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  .cta-button.floating {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9997;
    background: linear-gradient(45deg, #f093fb, #f5576c);
    color: white;
    box-shadow: 0 8px 25px rgba(245, 87, 108, 0.5);
    animation: float 3s ease-in-out infinite;
  }
  
  .cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .cta-button.floating:hover {
    transform: translateY(-3px) scale(1.05);
  }
  
  .cta-icon {
    font-size: 20px;
  }
  
  .cta-text {
    flex: 1;
  }
  
  .cta-arrow {
    font-size: 18px;
    transition: transform 0.3s ease;
  }
  
  .cta-button:hover .cta-arrow {
    transform: translateX(5px);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @media (max-width: 768px) {
    .cta-button {
      padding: 14px 24px;
      font-size: 14px;
    }
    
    .cta-button.floating {
      bottom: 10px;
      right: 10px;
      padding: 12px 20px;
      font-size: 13px;
    }
  }
</style>
