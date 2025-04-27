import axios from 'axios';

const STREAMLABS_CLIENT_ID = import.meta.env.VITE_STREAMLABS_CLIENT_ID;
const STREAMLABS_CLIENT_SECRET = import.meta.env.VITE_STREAMLABS_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5173/auth/callback';

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: STREAMLABS_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'alerts.create alerts.write',
  });
  return `https://streamlabs.com/api/v2.0/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await axios.post('https://streamlabs.com/api/v2.0/token', {
      grant_type: 'authorization_code',
      client_id: STREAMLABS_CLIENT_ID,
      client_secret: STREAMLABS_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('streamlabs_token');
};

export const getToken = () => {
  return localStorage.getItem('streamlabs_token');
};

export const setToken = (token: string) => {
  localStorage.setItem('streamlabs_token', token);
};

export const logout = () => {
  localStorage.removeItem('streamlabs_token');
}; 