
import React, { useState, useEffect } from 'react';
import { pwaManager } from '../lib/pwa';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(pwaManager.isOnline());
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const cleanup = pwaManager.onlineStatusChanged((online) => {
      setIsOnline(online);
      
      if (!online) {
        setShowOfflineMessage(true);
      } else {
        // Hide message after 3 seconds when back online
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
    });

    return cleanup;
  }, []);

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isOnline 
        ? 'bg-green-600 text-white' 
        : 'bg-orange-600 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-300' : 'bg-orange-300'
        }`}></div>
        <span className="text-sm font-medium">
          {isOnline ? 'Back online!' : 'You are offline'}
        </span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
