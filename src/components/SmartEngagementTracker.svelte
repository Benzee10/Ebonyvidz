
<script>
  import { onMount } from 'svelte';
  
  let userProfile = {
    interests: [],
    engagementLevel: 0,
    timeSpent: 0,
    preferredContent: '',
    lastVisit: null
  };
  
  let showPersonalizedCTA = false;
  let personalizedMessage = '';
  
  onMount(() => {
    loadUserProfile();
    trackEngagement();
    generatePersonalizedCTA();
  });
  
  function loadUserProfile() {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      userProfile = JSON.parse(stored);
    }
  }
  
  function trackEngagement() {
    const startTime = Date.now();
    
    // Track page views
    userProfile.engagementLevel += 5;
    
    // Track time spent
    setInterval(() => {
      userProfile.timeSpent += 1;
    }, 1000);
    
    // Track content preferences
    const currentTags = document.querySelector('meta[name="keywords"]')?.content || '';
    if (currentTags) {
      const tags = currentTags.split(',').map(tag => tag.trim());
      tags.forEach(tag => {
        if (!userProfile.interests.includes(tag)) {
          userProfile.interests.push(tag);
        }
      });
    }
    
    // Save on unload
    window.addEventListener('beforeunload', () => {
      userProfile.lastVisit = Date.now();
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    });
  }
  
  function generatePersonalizedCTA() {
    setTimeout(() => {
      if (userProfile.engagementLevel > 50) {
        const topInterest = userProfile.interests[0] || 'premium content';
        personalizedMessage = `🎯 Based on your interest in ${topInterest}, unlock exclusive content tailored for you!`;
        showPersonalizedCTA = true;
      }
    }, 10000);
  }
  
  function handleClick() {
    userProfile.engagementLevel += 25;
    window.open('https://whatsappad.vercel.app/', '_blank');
    showPersonalizedCTA = false;
  }
</script>

{#if showPersonalizedCTA}
  <div class="smart-engagement-cta">
    <div class="personalized-content">
      <div class="profile-icon">🧠</div>
      <div class="message">
        <h3>Smart Recommendation</h3>
        <p>{personalizedMessage}</p>
        <div class="engagement-score">
          Engagement Score: {userProfile.engagementLevel}
        </div>
      </div>
      <button class="smart-btn" on:click={handleClick}>
        Get My Content
      </button>
    </div>
  </div>
{/if}

<style>
  .smart-engagement-cta {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    max-width: 350px;
    z-index: 1000;
    animation: slideInRight 0.5s ease;
  }
  
  .personalized-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .profile-icon {
    font-size: 2rem;
    animation: pulse 2s infinite;
  }
  
  .message h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  .message p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    opacity: 0.9;
  }
  
  .engagement-score {
    font-size: 0.8rem;
    color: #FFD700;
    font-weight: bold;
  }
  
  .smart-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    padding: 0.8rem 1.2rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .smart-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
</style>
