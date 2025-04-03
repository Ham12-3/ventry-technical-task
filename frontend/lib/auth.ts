// In lib/auth.ts
import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  Cookies.set('token', token, {
    expires: 1, // 1 day
    path: '/',
    secure: isProduction,
    sameSite: 'lax'
  });
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token', { path: '/' });
};

export const isLoggedIn = () => {
  return !!getAuthToken();
};

export const refreshToken = async () => {
  try {
    const currentToken = Cookies.get('token');
    if (!currentToken) return false;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      }
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    
    // Update token
    Cookies.set('token', data.access_token, {
      expires: 1,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    localStorage.setItem('token', data.access_token);
    
    return true;
  } catch (error) {
    return false;
  }
};

// Add a scheduled token refresh
export const setupTokenRefresh = () => {
  // Refresh every 20 minutes (1200000 ms)
  const interval = setInterval(async () => {
    const success = await refreshToken();
    if (!success) {
      clearInterval(interval);
    }
  }, 1200000);
  
  return () => clearInterval(interval);
};