"use client";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;
export default function Page() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register = async (data: FormData) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Check your email to verify.");
      router.push("/login");
    }
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col gap-6">
          <Card className="border-indigo-100 bg-white/80 backdrop-blur-sm shadow-xl transition-all hover:shadow-indigo-100/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sign up for an account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(register)}
                className="flex flex-col gap-6 animate-fade-in-up"
              >
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-indigo-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@ainotes.com"
                    {...form.register("email")}
                    className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                  />
                  {form.formState.errors.email && (
                    <p className="text-rose-500 text-sm animate-fade-in">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-indigo-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                  />
                  {form.formState.errors.password && (
                    <p className="text-rose-500 text-sm animate-fade-in">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword" className="text-indigo-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    className="border-indigo-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-rose-500 text-sm animate-fade-in">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-800 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Button>
                <div className="mt-4 text-center text-sm">
                  <span className="text-gray-500">
                    Already have an account?
                  </span>{" "}
                  <a
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-800 underline underline-offset-4 transition-colors"
                  >
                    Login
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
