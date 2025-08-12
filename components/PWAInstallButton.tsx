
import React, { useState, useEffect } from 'react';
import { pwaManager, isPWAInstalled } from '../lib/pwa';
import { DownloadIcon, CheckIcon } from './Icons';

const PWAInstallButton: React.FC = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsInstalled(isPWAInstalled());
    setCanInstall(pwaManager.canInstall());

    const handleCanInstall = () => setCanInstall(true);
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('pwa:caninstall', handleCanInstall);
    window.addEventListener('pwa:installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa:caninstall', handleCanInstall);
      window.removeEventListener('pwa:installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaManager.installApp();
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
        <CheckIcon className="h-5 w-5" />
        <span className="text-sm font-medium">App Installed</span>
      </div>
    );
  }

  if (!canInstall) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isInstalling}
      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <DownloadIcon className="h-5 w-5" />
      <span className="text-sm font-medium">
        {isInstalling ? 'Installing...' : 'Install App'}
      </span>
    </button>
  );
};

export default PWAInstallButton;
