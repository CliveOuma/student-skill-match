"use client";
import React, { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/app/context/UserContext";

const signInSchema = z.object({
  email: z.string().email("Email must be valid"),
  password: z.string().min(6, "Password should have at least 6 characters."),
});

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if ((response.status === 401 || response.status === 403) && data.message?.toLowerCase().includes("verify")) {
          toast.error("Your email is not verified. Please check your inbox.");
        } else {
          toast.error(data.message || "Wrong email or password!");
        }
        return;
      }

      login(data.user, data.token);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <div className="w-[300px] md:w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-500 dark:from-gray-700 dark:to-gray-900 text-white p-10">
          <h3 className="text-3xl font-bold">Hello Friends!</h3>
          <p className="mt-3 text-lg">Enter your details and start your journey with us.</p>
          <Link href={"/register"}>
            <Button className="mt-6 border-white text-white hover:border-gray-300 hover:text-gray-300 transition-colors border rounded-full px-8">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="p-8">
          <h3 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Sign In Here
          </h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@gmail.com"
                        {...field}
                        className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="********"
                        type="password"
                        {...field}
                        className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-orange-500 text-white dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                isLoading={isLoading}
              >
                Submit
              </Button>

              <div className="md:hidden text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don&apos;t have an account?
                  <Link href="/register" className="text-orange-500 pl-2 hover:underline dark:text-blue-400">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
