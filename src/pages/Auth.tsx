import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUrl, isAuthenticated } from '../services/auth';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Streamlabs Alert Control</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Connect with Streamlabs
        </button>
      </div>
    </div>
  );
};

export default Auth; 