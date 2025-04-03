"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  exclusiveCode: z.string().optional(),
});

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [accordionValue, setAccordionValue] = useState("");
  
  // Move the form declaration before using it
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      exclusiveCode: "",
    },
  });

  // Now we can watch the email after form is defined
  const watchEmail = form.watch("email");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchEmail);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here you would implement your authentication logic
      console.log(values);
      
      // Show a success toast notification
      toast.success("Successfully signed in", {
        description: "Redirecting to dashboard...",
        duration: 3000,
      });
      
      // Simulating a successful sign-in
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      
      // Show an error toast notification
      toast.error("Sign in failed", {
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true);
    // Here you would implement OAuth sign-in logic
    console.log(`Signing in with ${provider}`);
    
    // Show a loading toast notification
    toast.loading(`Authenticating with ${provider}...`);
    
    // Simulating OAuth flow
    setTimeout(() => {
      toast.success(`${provider} authentication successful`);
      router.push("/dashboard");
    }, 1500);
  };

  const handleRequestCode = () => {
    if (!isEmailValid) {
      form.setError("email", { 
        type: "manual", 
        message: "Please enter a valid email first" 
      });
      
      // Show an error toast notification
      toast.error("Invalid email address", {
        description: "Please enter a valid email to request a code",
      });
      return;
    }
    
    setRequestingCode(true);
    
    // Show a loading toast notification
    const toastId = toast.loading("Sending access code to your email...");
    
    // Simulate sending code
    setTimeout(() => {
      setRequestingCode(false);
      setCodeSent(true);
      
      // Update the toast to success
      toast.success("Access code sent", {
        id: toastId,
        description: `Check ${watchEmail} for your exclusive access code`,
        icon: <Mail className="w-4 h-4" />,
      });
      
      // Auto-hide the success message after 5 seconds
      setTimeout(() => {
        setCodeSent(false);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1B3154] via-[#3C5174] via-[#6C80A2] via-[#3C5174] to-[#1B3154]">
      {/* Add Sonner Toaster component */}
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
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-200">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="bg-transparent border border-white/20 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Image 
                src="/images/ventry-image.png" 
                alt="Ventry Logo" 
                width={60} 
                height={60} 
                className="object-contain"
              />
            </div>
            <CardTitle className="text-xl font-semibold text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Enter your credentials below to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="email@example.com" 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white focus-visible:ring-white/30"
                        />
                      </FormControl>
                      <FormMessage className="text-yellow-200" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white focus-visible:ring-white/30"
                        />
                      </FormControl>
                      <FormMessage className="text-yellow-200" />
                    </FormItem>
                  )}
                />
                
                {/* Move Accordion inside the form but make it a controlled component */}
                <div className="pt-2">
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="w-full"
                    value={accordionValue}
                    onValueChange={setAccordionValue}
                  >
                    <AccordionItem value="exclusive-access" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/90">
                        <div className="flex items-center">
                          Exclusive Access
                          <Badge className="ml-2 bg-blue-500/50 text-white hover:bg-blue-500/70">Optional</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-1">
                          <div className="text-sm text-gray-200">
                            Enter an exclusive access code to unlock premium features.
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={handleRequestCode}
                              disabled={requestingCode || !isEmailValid}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              {requestingCode ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                "Request Access Code"
                              )}
                            </Button>
                            
                            {codeSent && (
                              <div className="flex items-center text-xs text-green-300">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Sent to your email
                              </div>
                            )}
                          </div>

                          <FormField
                            control={form.control}
                            name="exclusiveCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your exclusive code" 
                                    {...field}
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-300 focus:border-white focus-visible:ring-white/30"
                                  />
                                </FormControl>
                                <FormDescription className="text-gray-300 text-xs">
                                  The code will be sent to the email address you provided above.
                                </FormDescription>
                                <FormMessage className="text-yellow-200" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-200 hover:text-blue-100"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/40" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-200">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('google')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-white/20 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 focus:ring-offset-gray-900"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.00998 18.63 6.46998 16.61 5.54998 13.86H1.89998V16.71C3.70998 20.43 7.54998 23 12 23Z" fill="#34A853" />
                    <path d="M5.55 13.86C5.32 13.18 5.2 12.45 5.2 11.7C5.2 10.95 5.33 10.22 5.55 9.54V6.69H1.9C1.3 8.19 1 9.88 1 11.7C1 13.52 1.3 15.21 1.9 16.71L5.55 13.86Z" fill="#FBBC05" />
                    <path d="M12 5.36998C13.62 5.36998 15.06 5.92998 16.21 7.02998L19.36 3.87998C17.46 2.09998 14.97 0.999977 12 0.999977C7.54998 0.999977 3.70998 3.56998 1.89998 7.28998L5.54998 10.14C6.46998 7.38998 9.00998 5.36998 12 5.36998Z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                
                <button
                  type="button"
                  onClick={() => handleOAuthSignIn('apple')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-white/20 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 focus:ring-offset-gray-900"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2452 0C15.1144 0.086 13.7313 0.826 12.9148 1.793C12.1697 2.677 11.5817 3.925 11.7398 5.14C12.9736 5.173 14.2486 4.399 15.033 3.432C15.7691 2.52 16.2848 1.287 16.2452 0Z" fill="white" />
                    <path d="M21.999 8.387C21.1956 7.351 20.0168 6.716 18.8997 6.716C17.313 6.716 16.619 7.649 15.3995 7.649C14.1393 7.649 13.2094 6.722 11.8499 6.722C10.5287 6.722 9.19219 7.519 8.38524 8.898C7.21548 10.947 7.41879 14.845 9.38647 18.075C10.2541 19.577 11.3497 21.249 12.7869 21.227C14.1287 21.203 14.5746 20.391 16.252 20.374C17.9572 20.374 18.5287 21.227 19.8997 21.227C21.2707 21.227 22.1956 20.391 22.999 19.355C20.999 18.355 20.999 15.355 21.999 14.355C22.999 13.355 22.999 10.355 21.999 8.387Z" fill="white" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator className="my-2 bg-white/20" />
            <p className="text-sm text-center text-gray-200">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium text-blue-200 hover:text-blue-100">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}