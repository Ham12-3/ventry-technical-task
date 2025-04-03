import { toast } from 'react-toastify';  // Change from sonner to react-toastify
import Cookies from 'js-cookie';

interface FetchOptions extends RequestInit {
  showToast?: boolean;
  toastSuccess?: string;
  toastError?: string;
}

/**
 * Fetch wrapper that handles authentication and error toasts
 */
export async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const {
    showToast = true,
    toastSuccess,
    toastError = 'An error occurred',
    ...fetchOptions
  } = options;
  
  // Get the token from cookies
  const token = Cookies.get('token');
  
  // Set up headers with authentication token
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(fetchOptions.headers || {}),
  };
  
  console.log(`Fetching ${endpoint} with token: ${token ? 'Present' : 'Missing'}`);
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
    
    // Handle unauthorized responses
    if (response.status === 401) {
      console.log('Token invalid or expired');
      // Remove the invalid token
      Cookies.remove('token');
      
      // Redirect to sign-in
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in?error=Your session has expired. Please sign in again.';
        return null;
      }
    }
    
    // Handle other error responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Show success toast if specified
    if (showToast && toastSuccess) {
      toast.success(toastSuccess);
    }
    
    return data;
  } catch (error: unknown) {  // Explicitly type error as unknown
    // Show error toast
    if (showToast) {
      let errorMessage = toastError;
      
      // Check if error is an Error object and has a message property
      if (error instanceof Error) {
        errorMessage = `${toastError}: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
    throw error;
  }
}