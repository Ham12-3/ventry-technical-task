"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = () => {
    setLoading(true);
    toast.loading("Signing out...");
    
    // Simulate sign out process
    setTimeout(() => {
      router.push("/sign-in");
      toast.success("Successfully signed out");
    }, 1000);
  };
  
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
            {/* Add the Ventry logo */}
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
              <CardTitle className="text-xl font-semibold text-white">Welcome</CardTitle>
              <CardDescription className="text-gray-200">
                You've successfully signed in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-200">
              <p>This is your dashboard where you can manage your account and access various features.</p>
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
              <CardTitle className="text-xl font-semibold text-white">Exclusive Features</CardTitle>
              <CardDescription className="text-gray-200">
                Features unlocked with your access code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-gray-200">Early access to new tools</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-gray-200">Premium templates</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
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