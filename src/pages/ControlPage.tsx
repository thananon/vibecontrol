import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import muteIcon from '../assets/icons/mute.svg';
import shieldIcon from '../assets/icons/shield.svg';
import { getToken, logout } from '../services/auth';

type AlertStateType = 'normal' | 'mute' | 'suppress';

const ControlPage = () => {
  const [localState, setLocalState] = useState<AlertStateType>('normal');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch current state from API on component mount
  useEffect(() => {
    const fetchCurrentState = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/alerts/status');
        if (response.data && response.data.status) {
          setLocalState(response.data.status);
        }
      } catch (error) {
        console.error('Error fetching alert status:', error);
      }
    };

    fetchCurrentState();
    
    // Poll for state changes every 5 seconds
    const intervalId = setInterval(fetchCurrentState, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getIcon = () => {
    if (localState === 'mute') {
      return <img src={muteIcon} alt="Muted" className="w-16 h-16" />;
    }
    if (localState === 'suppress') {
      return <img src={shieldIcon} alt="Suppressed" className="w-16 h-16" />;
    }
    // Return a placeholder or null for 'normal' state if desired
    // Or maybe an icon indicating alerts are active?
    return <div className="w-16 h-16 flex items-center justify-center text-green-500 font-bold">ON</div>; // Example for 'normal'
  };

  const toggleMute = async () => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      console.error('No token found');
      setIsLoading(false);
      return;
    }

    const targetMuteState = localState !== 'mute'; // If not muted, mute it. If muted, unmute it.

    try {
      const response = await axios.post(
        'http://localhost:3000/api/alerts/set-mute',
        { mute: targetMuteState }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Set mute response:', response.data);
      if (response.data.success) {
        // Update the local state from the server response
        const statusResponse = await axios.get('http://localhost:3000/api/alerts/status');
        if (statusResponse.data && statusResponse.data.status) {
          setLocalState(statusResponse.data.status);
        }
      } else {
        console.error('Backend failed to set mute state:', response.data.details);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error setting mute state:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSuppress = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      console.error('No token found');
      setIsLoading(false);
      return;
    }

    const targetSuppressState = localState !== 'suppress'; // If not suppressed, suppress. If suppressed, unsuppress.

    try {
      const response = await axios.post(
        'http://localhost:3000/api/alerts/set-suppress',
        { suppress: targetSuppressState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Set suppress response:', response.data);
       if (response.data.success) {
        // Update the local state from the server response
        const statusResponse = await axios.get('http://localhost:3000/api/alerts/status');
        if (statusResponse.data && statusResponse.data.status) {
          setLocalState(statusResponse.data.status);
        }
      } else {
         console.error('Backend failed to set suppress state:', response.data.details);
         // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error setting suppress state:', error);
      // Optionally show an error message to the user
    } finally {
       setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate('/auth');
  };

  const openDisplayPage = () => {
    // Open /display in a new tab
    window.open('/display', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Streamlabs Alert Control</h1>
        
        {/* Current State Display - Based on localState */}
        <div className="bg-white rounded-lg p-8 mb-8 flex flex-col items-center">
          <div className="text-lg font-semibold mb-4">Current State</div>
          <div className="bg-gray-200 rounded-full p-4">
            {getIcon()} 
          </div>
        </div>

        {/* Control Buttons - Reflect localState */}
        <div className="space-y-4 mb-8">
          <button
            onClick={toggleMute}
            disabled={isLoading} // Disable button while loading
            className={`w-full px-4 py-2 rounded ${
              localState === 'mute' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white disabled:opacity-50`}
          >
            {isLoading ? '...' : (localState === 'mute' ? 'Unmute Alerts' : 'Mute Alerts')}
          </button>
          <button
            onClick={toggleSuppress}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded ${
              localState === 'suppress' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } text-white disabled:opacity-50`}
          >
             {isLoading ? '...' : (localState === 'suppress' ? 'Unsuppress Alerts' : 'Suppress Alerts')}
          </button>
        </div>

        {/* Page Actions */}
        <div className="space-y-4">
           {/* Display Page Button */}
           <button
             onClick={openDisplayPage}
             className="w-full px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
           >
             Open Display Page (New Tab)
           </button>
        
           {/* Logout Button */}
           <button
             onClick={handleLogout}
             className="w-full px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
           >
             Logout
           </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPage; 