import { useState, useEffect } from 'react';
import axios from 'axios';
import muteIcon from '../assets/icons/mute.svg';
import shieldIcon from '../assets/icons/shield.svg';

type AlertStateType = 'normal' | 'mute' | 'suppress';

const DisplayPage = () => {
  const [displayStatus, setDisplayStatus] = useState<AlertStateType>('normal');

  useEffect(() => {
    // Function to fetch the alert status from the server
    const fetchAlertStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/alerts/status');
        if (response.data && response.data.status) {
          setDisplayStatus(response.data.status);
        }
      } catch (error) {
        console.error('Error fetching alert status:', error);
      }
    };

    // Fetch initial status
    fetchAlertStatus();

    // Set up polling interval
    const pollingInterval = setInterval(fetchAlertStatus, 2000);

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
      clearInterval(pollingInterval);
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
  const wrapperClasses = "flex items-center space-x-4"; // flex row + space between items

  if (displayStatus === 'mute') {
    return (
      <div className={wrapperClasses}>
        <div className={iconContainerSize}>
          <img src={muteIcon} alt="Muted" className={imageClasses} />
        </div>
        <span className="text-xl font-semibold text-white">Muted</span>
      </div>
    );
  }

  if (displayStatus === 'suppress') {
    return (
      <div className={wrapperClasses}>
        <div className={iconContainerSize}>
          <img src={shieldIcon} alt="Suppressed" className={imageClasses} />
        </div>
        <span className="text-xl font-semibold text-white">Suppressed</span>
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