import { LoginForm } from "@/components/login-form";
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { supabase } from "@/lib/supabase";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async () => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     if (error) alert(error.message);
//     else router.push("/dashboard");
//   };

//   const loginWithGoogle = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//     });
//     if (error) alert(error.message);
//   };

//   return (
//     <div className="flex flex-col gap-4 max-w-sm mx-auto mt-24">
//       <Input
//         placeholder="Email"
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <Input
//         placeholder="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <Button onClick={login}>Sign In with Email</Button>
//       <Button variant="outline" onClick={loginWithGoogle}>
//         Sign in with Google
//       </Button>
//     </div>
//   );
// }
