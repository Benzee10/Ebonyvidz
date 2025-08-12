
// PWA Installation and Update utilities

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private updateAvailable = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/public/sw.js');
        console.log('Service Worker registered successfully');

        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.showUpdateNotification();
              }
            });
          }
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.showInstallButton();
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode');
    }
  }

  public async installApp() {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  public updateApp() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  public isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  private showInstallButton() {
    // Dispatch custom event that components can listen to
    window.dispatchEvent(new CustomEvent('pwa:caninstall'));
  }

  private hideInstallButton() {
    window.dispatchEvent(new CustomEvent('pwa:installed'));
  }

  private showUpdateNotification() {
    window.dispatchEvent(new CustomEvent('pwa:updateavailable'));
  }

  // Offline detection
  public isOnline(): boolean {
    return navigator.onLine;
  }

  public onlineStatusChanged(callback: (online: boolean) => void) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

export const pwaManager = new PWAManager();

// Utility functions
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: minimal-ui)').matches;
};

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const canShare = (): boolean => {
  return 'share' in navigator;
};

export const shareContent = async (data: ShareData): Promise<boolean> => {
  if (canShare()) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }
  return false;
};

// Storage utilities for offline content
export const storeOfflineContent = async (key: string, data: any): Promise<void> => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to store offline content:', error);
  }
};

export const getOfflineContent = (key: string): any | null => {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if data is not too old (7 days)
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    }
  } catch (error) {
    console.error('Failed to retrieve offline content:', error);
  }
  return null;
};
