"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      console.error(error);
    } else {
      router.push("/");
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-100 bg-white/80 backdrop-blur-sm shadow-xl transition-all hover:shadow-indigo-100/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Login to your account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={login} className="animate-fade-in-up">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-indigo-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@ainotes.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password" className="text-indigo-700">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-800 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Login
                    </Button>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-indigo-100">
                      <span className="relative z-10 bg-white/80 px-2 text-indigo-600">
                        Or continue with
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-800 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:text-white"
                      onClick={loginWithGoogle}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 mr-2"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-500">
                    Don&apos;t have an account?
                  </span>{" "}
                  <a
                    href="/register"
                    className="text-indigo-600 hover:text-indigo-800 underline underline-offset-4 transition-colors"
                  >
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
