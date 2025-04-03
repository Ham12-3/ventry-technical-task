"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>('Processing your sign-in...');
  
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      router.push('/sign-in?error=Authentication failed');
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // Call your backend to exchange code for token
        setStatus('Connecting to authentication service...');
        console.log(`Calling API with code: ${code?.substring(0, 6)}...`);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback?code=${code}`);
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
          // Get the error message from the response
          const errorText = await response.text();
          console.error('Error response from backend:', errorText);
          
          setStatus('Authentication error');
          throw new Error(`Authentication failed (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        
        // Store token in cookies
        Cookies.set('token', data.access_token, {
          expires: 1,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('OAuth error details:', error);
        setStatus('Authentication failed');
        toast.error('Sign-in failed', {
          description: error instanceof Error ? error.message : 'Authentication process failed',
          duration: 5000,
        });
        
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/sign-in?error=Authentication failed');
        }, 3000);
      }
    };
    
    exchangeCodeForToken();
  }, [router, searchParams]);
  
  // Simple loading screen while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1B3154] via-[#3C5174] to-[#1B3154]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-white" />
        <h1 className="text-2xl font-bold mb-2 text-white">Completing Sign In</h1>
        <p className="text-white/80">{status}</p>
      </div>
    </div>
  );
}