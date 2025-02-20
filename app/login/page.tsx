"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase, checkSupabaseConnection } from "@/lib/supabase";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

// Add this type after the imports
type AnimeImage = {
  url: string;
};

export default function LoginPage() {
  // Add these new states with the existing ones
  const [backgroundImages, setBackgroundImages] = useState<AnimeImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Add these effects after the states
  useEffect(() => {
    async function fetchAnimeImages() {
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?limit=5"
        );
        const data = await response.json();
        const images = data.data.map((anime: any) => ({
          url: anime.images.jpg.large_image_url,
        }));
        setBackgroundImages(images);
      } catch (error) {
        console.error("Failed to fetch anime images:", error);
      }
    }

    fetchAnimeImages();
  }, []);

  useEffect(() => {
    if (backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((current) =>
        current === backgroundImages.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check Supabase connection on component mount
  useEffect(() => {
    checkSupabaseConnection().then(isConnected => {
      if (!isConnected) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to connect to authentication service.",
        });
      }
    });
  }, [toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function resendVerificationEmail(email: string) {
    try {
      setResendingEmail(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
      });
    } finally {
      setResendingEmail(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      setProgress(50);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setProgress(0);
        if (error.message === "Email not confirmed") {
          setVerificationEmail(values.email);
          setShowVerificationDialog(true);
          return;
        }

        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
        return;
      }

      if (data?.user) {
        setProgress(100);
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setProgress(0);
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Jika sudah login, tampilkan loading
  if (user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Update the background div in the return statement
  return (
    <>
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Background */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900 dark:bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-black/60" />
            {backgroundImages.length > 0 && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-1000 hover:opacity-50"
                style={{
                  backgroundImage: `url(${backgroundImages[currentImageIndex].url})`,
                }}
              />
            )}
          </div>
          <div className="relative z-20 flex items-center text-xl font-medium">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              AnimeStream
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg font-light italic">
                "The perfect place to discover and enjoy your favorite anime series."
              </p>
              <footer className="text-sm text-zinc-300">Welcome to AnimeStream</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:p-8 bg-white dark:bg-zinc-950">
          <div className="mx-auto flex w-[280px] min-[350px]:w-full flex-col justify-center space-y-6 sm:w-[350px] px-2 sm:px-0">
            <Card className="border-none shadow-none lg:border lg:shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="space-y-1 px-3 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-center sm:text-left">
                  Sign in
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                              className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                className="h-11 pr-10 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-11 w-11 px-3 hover:bg-transparent dark:hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-zinc-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-zinc-500" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <div className="relative">
                      <Button
                        type="submit"
                        className="h-11 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                      {progress > 0 && (
                        <div
                          className="absolute top-0 left-0 h-full bg-primary/50 rounded-full transition-all"
                          style={{ width: `${progress}%`, maxWidth: '100%' }}
                        />
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t dark:border-zinc-800 mt-4 pt-6">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 text-center sm:text-left">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              Your email address has not been verified yet. Please check your inbox for the verification link.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              We sent a verification email to{" "}
              <span className="font-medium text-foreground">{verificationEmail}</span>
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => resendVerificationEmail(verificationEmail)}
              disabled={resendingEmail}
            >
              {resendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
