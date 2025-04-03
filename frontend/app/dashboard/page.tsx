"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { fetchAPI } from "@/lib/api";
import Cookies from 'js-cookie';

interface UserData {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  provider: string;
  exclusive_access: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if token exists
        const token = Cookies.get('token');
        if (!token) {
          router.push('/sign-in?error=Please sign in to access this page');
          return;
        }
        
        setLoading(true);
        const data = await fetchAPI('/api/users/me');
        
        if (data) {
          setUserData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setLoading(false);
        // Don't redirect here, let the fetchAPI function handle 401s
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleSignOut = () => {
    setLoading(true);
    toast.loading("Signing out...");
    
    // Clear token from cookies
    Cookies.remove('token', { path: '/' });
    
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Simulate sign out process (in a real app, you'd call a backend logout endpoint)
    setTimeout(() => {
      router.push("/sign-in");
      toast.success("Successfully signed out");
    }, 1000);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1B3154] via-[#3C5174] via-[#6C80A2] via-[#3C5174] to-[#1B3154] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B3154] via-[#3C5174] via-[#6C80A2] via-[#3C5174] to-[#1B3154] p-4 md:p-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          },
          className: 'font-sans',
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/ventry-image.png" 
              alt="Ventry Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            disabled={loading}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-transparent border border-white/20 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Welcome, {userData?.name || 'User'}</CardTitle>
              <CardDescription className="text-gray-200">
                You've successfully signed in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-200">
              <div className="space-y-2">
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Account type:</strong> {userData?.provider === 'email' ? 'Email & Password' : userData?.provider}</p>
                <p><strong>Account verified:</strong> {userData?.is_verified ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-transparent border border-white/20 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Statistics</CardTitle>
              <CardDescription className="text-gray-200">
                Your account activity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sessions</span>
                  <span className="text-white font-medium">28</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Days active</span>
                  <span className="text-white font-medium">14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Projects</span>
                  <span className="text-white font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-transparent border border-white/20 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Exclusive Features
                {userData?.exclusive_access && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/50 text-white">
                    Activated
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-gray-200">
                {userData?.exclusive_access 
                  ? 'You have access to premium features' 
                  : 'Enter an exclusive code to unlock premium features'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${userData?.exclusive_access ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-200">Early access to new tools</span>
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${userData?.exclusive_access ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-200">Premium templates</span>
                </div>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${userData?.exclusive_access ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-gray-200">Priority support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}