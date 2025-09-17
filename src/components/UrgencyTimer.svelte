
<script>
  import { onMount } from 'svelte';
  
  let timeLeft = 3600; // 1 hour in seconds
  let showOffer = false;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  onMount(() => {
    // Check if offer was already shown today
    const lastShown = localStorage.getItem('urgencyOfferShown');
    const today = new Date().toDateString();
    
    if (lastShown !== today) {
      setTimeout(() => {
        showOffer = true;
        startCountdown();
        localStorage.setItem('urgencyOfferShown', today);
      }, 5000);
    }
  });
  
  function startCountdown() {
    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        showOffer = false;
        return;
      }
      
      timeLeft--;
      updateDisplay();
    }, 1000);
  }
  
  function updateDisplay() {
    hours = Math.floor(timeLeft / 3600);
    minutes = Math.floor((timeLeft % 3600) / 60);
    seconds = timeLeft % 60;
  }
  
  function handleClaim() {
    window.open('https://whatsappad.vercel.app/', '_blank');
    showOffer = false;
  }
  
  function closeOffer() {
    showOffer = false;
  }
</script>

{#if showOffer}
  <div class="urgency-timer-overlay">
    <div class="urgency-content">
      <button class="close-btn" on:click={closeOffer}>×</button>
      
      <div class="urgency-header">
        <div class="flash-icon">⚡</div>
        <h2>⏰ Limited Time Offer!</h2>
        <p>Exclusive access expires soon!</p>
      </div>
      
      <div class="countdown-display">
        <div class="time-unit">
          <span class="time-number">{hours.toString().padStart(2, '0')}</span>
          <span class="time-label">Hours</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
          <span class="time-number">{minutes.toString().padStart(2, '0')}</span>
          <span class="time-label">Minutes</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
          <span class="time-number">{seconds.toString().padStart(2, '0')}</span>
          <span class="time-label">Seconds</span>
        </div>
      </div>
      
      <div class="offer-details">
        <h3>🎁 What You Get:</h3>
        <ul>
          <li>✅ Unlimited HD Downloads</li>
          <li>✅ Exclusive Premium Content</li>
          <li>✅ Ad-Free Experience</li>
          <li>✅ Mobile Optimized</li>
        </ul>
      </div>
      
      <button class="claim-offer-btn" on:click={handleClaim}>
        🚀 Claim Exclusive Access
      </button>
      
      <div class="urgency-warning">
        ⚠️ This offer won't be available again today!
      </div>
    </div>
  </div>
{/if}

<style>
  .urgency-timer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease;
  }
  
  .urgency-content {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.5s ease;
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
  
  .urgency-header {
    margin-bottom: 2rem;
  }
  
  .flash-icon {
    font-size: 3rem;
    animation: flash 1s infinite;
  }
  
  .urgency-header h2 {
    margin: 1rem 0 0.5rem 0;
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .countdown-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
  }
  
  .time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .time-number {
    font-size: 2rem;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .time-label {
    font-size: 0.8rem;
    opacity: 0.8;
    text-transform: uppercase;
  }
  
  .time-separator {
    font-size: 2rem;
    font-weight: bold;
    color: #FFD700;
    animation: blink 1s infinite;
  }
  
  .offer-details {
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .offer-details h3 {
    margin: 0 0 1rem 0;
    text-align: center;
    font-size: 1.3rem;
  }
  
  .offer-details ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .offer-details li {
    padding: 0.5rem 0;
    font-size: 1rem;
  }
  
  .claim-offer-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #ff6b6b;
    border: none;
    padding: 1.2rem 2rem;
    border-radius: 30px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
    width: 100%;
  }
  
  .claim-offer-btn:hover {
    background: white;
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
  
  .urgency-warning {
    font-size: 0.9rem;
    color: #FFD700;
    font-weight: bold;
    animation: glow 2s infinite alternate;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes flash {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  @keyframes glow {
    from { text-shadow: 0 0 5px #FFD700; }
    to { text-shadow: 0 0 20px #FFD700, 0 0 30px #FFD700; }
  }
  
  @media (max-width: 768px) {
    .urgency-content {
      padding: 1.5rem;
    }
    
    .countdown-display {
      gap: 0.3rem;
    }
    
    .time-number {
      font-size: 1.5rem;
    }
    
    .time-separator {
      font-size: 1.5rem;
    }
    
    .urgency-header h2 {
      font-size: 1.5rem;
    }
    
    .claim-offer-btn {
      font-size: 1.1rem;
      padding: 1rem 1.5rem;
    }
  }
</style>
