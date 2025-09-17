
<script>
  import { onMount } from 'svelte';
  
  let points = 0;
  let level = 1;
  let showReward = false;
  let rewardMessage = '';
  let achievements = [];
  
  const rewards = [
    { points: 50, message: "🎉 First Explorer! Unlock exclusive content!", unlocked: false },
    { points: 150, message: "🔥 Content Lover! Get premium access!", unlocked: false },
    { points: 300, message: "👑 VIP Status Achieved! Ultimate access awaits!", unlocked: false }
  ];
  
  onMount(() => {
    loadProgress();
    trackActions();
  });
  
  function loadProgress() {
    const saved = localStorage.getItem('userRewards');
    if (saved) {
      const data = JSON.parse(saved);
      points = data.points || 0;
      level = data.level || 1;
      achievements = data.achievements || [];
    }
  }
  
  function saveProgress() {
    localStorage.setItem('userRewards', JSON.stringify({
      points,
      level,
      achievements
    }));
  }
  
  function addPoints(amount, action) {
    points += amount;
    level = Math.floor(points / 100) + 1;
    
    // Check for rewards
    rewards.forEach((reward, index) => {
      if (points >= reward.points && !reward.unlocked) {
        reward.unlocked = true;
        showRewardUnlock(reward.message);
        achievements.push(`${action} - ${reward.points} points`);
      }
    });
    
    saveProgress();
  }
  
  function showRewardUnlock(message) {
    rewardMessage = message;
    showReward = true;
    setTimeout(() => {
      showReward = false;
    }, 5000);
  }
  
  function trackActions() {
    // Track scrolling
    let scrollThreshold = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
      if (scrollPercent > scrollThreshold + 25) {
        addPoints(10, 'Scrolling');
        scrollThreshold += 25;
      }
    });
    
    // Track image clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        addPoints(5, 'Image View');
      }
    });
    
    // Track time spent
    setInterval(() => {
      addPoints(2, 'Time Spent');
    }, 30000); // Every 30 seconds
  }
  
  function claimReward() {
    window.open('https://whatsappad.vercel.app/', '_blank');
    showReward = false;
  }
</script>

<div class="rewards-system">
  <div class="points-display">
    <div class="level-badge">Lv.{level}</div>
    <div class="points-count">{points} pts</div>
  </div>
  
  <div class="progress-bar">
    <div class="progress-fill" style="width: {(points % 100)}%"></div>
  </div>
</div>

{#if showReward}
  <div class="reward-popup">
    <div class="reward-content">
      <div class="reward-icon">🏆</div>
      <h3>Reward Unlocked!</h3>
      <p>{rewardMessage}</p>
      <button class="claim-btn" on:click={claimReward}>
        Claim Now
      </button>
    </div>
  </div>
{/if}

<style>
  .rewards-system {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 1rem;
    border-radius: 10px;
    z-index: 1000;
    min-width: 150px;
  }
  
  .points-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .level-badge {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    color: black;
    padding: 0.2rem 0.5rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .points-count {
    font-weight: bold;
    color: #00ff88;
  }
  
  .progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff88, #00cc66);
    transition: width 0.3s ease;
  }
  
  .reward-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    z-index: 10000;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: rewardBounce 0.6s ease;
  }
  
  .reward-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 1s infinite;
  }
  
  .reward-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
  
  .reward-content p {
    margin: 0 0 1.5rem 0;
    opacity: 0.9;
  }
  
  .claim-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: 30px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .claim-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.5);
  }
  
  @keyframes rewardBounce {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
</style>
