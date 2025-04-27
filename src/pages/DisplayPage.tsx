import { useState, useEffect } from 'react';
import muteIcon from '../assets/icons/mute.svg';
import shieldIcon from '../assets/icons/shield.svg';

// Use the same key as ControlPage
const LOCAL_STORAGE_KEY = 'vibecontrol_alert_status';

type LocalStateType = 'normal' | 'mute' | 'suppress';

const DisplayPage = () => {
  const [displayStatus, setDisplayStatus] = useState<LocalStateType>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_KEY) as LocalStateType) || 'normal';
  });

  useEffect(() => {
    // --- Listener for localStorage changes ---
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        setDisplayStatus((event.newValue as LocalStateType) || 'normal');
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // --- Get elements and set styles on mount ---
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const rootElement = document.getElementById('root');
    const greenColor = 'rgb(34 197 94)';

    // Store original styles in local variables within the effect's scope
    const originalHtmlBg = htmlElement.style.backgroundColor;
    const originalHtmlHeight = htmlElement.style.height;
    const originalBodyBg = bodyElement.style.backgroundColor;
    const originalBodyHeight = bodyElement.style.height;
    const originalBodyMinHeight = bodyElement.style.minHeight;
    let originalRootHeight = '';
    let originalRootMinHeight = '';
    let originalRootPadding = '';
    let originalRootMargin = '';
    let originalRootMaxWidth = '';

    if (rootElement) {
      originalRootHeight = rootElement.style.height;
      originalRootMinHeight = rootElement.style.minHeight;
      originalRootPadding = rootElement.style.padding;
      originalRootMargin = rootElement.style.margin;
      originalRootMaxWidth = rootElement.style.maxWidth;
    }

    // Apply new styles
    htmlElement.style.backgroundColor = greenColor;
    htmlElement.style.height = '100%';
    bodyElement.style.backgroundColor = greenColor;
    bodyElement.style.height = '100%';
    bodyElement.style.minHeight = '100%';
    if (rootElement) {
      rootElement.style.height = '100%';
      rootElement.style.minHeight = '100%';
      rootElement.style.padding = '0';
      rootElement.style.margin = '0';
      rootElement.style.maxWidth = 'none';
    }

    // --- Cleanup function --- 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      // Reset styles using the local variables captured by the closure
      htmlElement.style.backgroundColor = originalHtmlBg;
      htmlElement.style.height = originalHtmlHeight;
      bodyElement.style.backgroundColor = originalBodyBg;
      bodyElement.style.height = originalBodyHeight;
      bodyElement.style.minHeight = originalBodyMinHeight;
      if (rootElement) {
        rootElement.style.height = originalRootHeight;
        rootElement.style.minHeight = originalRootMinHeight;
        rootElement.style.padding = originalRootPadding;
        rootElement.style.margin = originalRootMargin;
        rootElement.style.maxWidth = originalRootMaxWidth;
      }
    };
  }, []);

  const getIcon = () => {
    const iconContainerSize = "w-[500px] h-[500px]";
    const imageClasses = "block w-full h-full";
    if (displayStatus === 'mute') {
      return (
        <div className={iconContainerSize}>
          <img src={muteIcon} alt="Muted" className={imageClasses} />
        </div>
      );
    }
    if (displayStatus === 'suppress') {
      return (
        <div className={iconContainerSize}>
           <img src={shieldIcon} alt="Suppressed" className={imageClasses} />
        </div>
      );
    }
    // Return null for 'normal' state (blank display)
    return null; 
  };

  return (
    // Use min-h-full instead of h-full for robustness
    <div className="w-full min-h-full flex items-center justify-center">
      {/* The container div returned by getIcon() will be centered here */} 
      {getIcon()} 
    </div>
  );
};

export default DisplayPage; 