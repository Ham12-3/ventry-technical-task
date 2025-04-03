
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "Password must contain uppercase, lowercase, and numbers.",
  }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      // Here you would implement your registration logic
      console.log(values);
      
      // Simulating a successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignUp = (provider: string) => {
    setIsLoading(true);
    // Here you would implement OAuth sign-up logic
    console.log(`Signing up with ${provider}`);
    
    // Simulating OAuth flow
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1B3154] via-[#3C5174] via-[#6C80A2] via-[#3C5174] to-[#1B3154]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-gray-200">
            Sign up to get started with our platform
          </p>
        </div>

        <Card className="bg-transparent border border-white/20 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-white">Sign Up</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
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
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-white/10">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-white">
                          I accept the <Link href="/terms" className="underline text-blue-200 hover:text-blue-100">Terms of Service</Link> and <Link href="/privacy" className="underline text-blue-200 hover:text-blue-100">Privacy Policy</Link>
                        </FormLabel>
                        <FormMessage className="text-yellow-200" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/40" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
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
                  onClick={() => handleOAuthSignUp('google')}
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
                  onClick={() => handleOAuthSignUp('apple')}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-white/20 rounded-md shadow-sm bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 focus:ring-offset-gray-900"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.2452 0C15.1144 0.086 13.7313 0.826 12.9148 1.793C12.1697 2.677 11.5817 3.925 11.7398 5.14C12.9736 5.173 14.2486 4.399 15.033 3.432C15.7691 2.52 16.2848 1.287 16.2452 0Z" fill="white" />
                    <path d="M21.999 8.387C21.1956 7.351 20.0168 6.716 18.8997 6.716C17.313 6.716 16.619 7.649 15.3995 7.649C14.1393 7.649 13.2094 6.722 11.8499 6.722C10.5287 6.722 9.19219 7.519 8.38524 8.898C7.21548 10.947 7.41879 14.845 9.38647 18.075C10.2541 19.577 11.3497 21.249 12.7869 21.227C14.1287 21.203 14.5746 20.391 16.252 20.374C17.9572 20.357 18.3626 21.203 19.7043 21.179C21.1416 21.156 22.3493 19.248 23.2169 17.746C23.8577 16.64 24.103 16.092 24.6173 14.873C20.5095 13.535 19.9643 8.13 24.0002 6.33C22.8646 6.62 22.4 7.864 21.999 8.387Z" fill="white" />
                  </svg>
                  Apple
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator className="my-2 bg-white/20" />
            <p className="text-sm text-center text-gray-200">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-blue-200 hover:text-blue-100">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}