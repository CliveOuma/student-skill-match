"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const signUpSchema = z
  .object({
    name: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),

    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  async function handleSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.message === "Email already exists") {
          toast.error("User already exists!");
        } else {
          toast.error(data.message || "Something went wrong");
        }
        return;
      }

      form.reset();
      toast.success("Account created successfully!.");
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);

    } catch (error) {
      console.error("Registration Failed:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center dark:bg-gray-900 transition-all duration-300">
      <div className="w-[300px] md:w-full max-w-4xl max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-500 to-purple-500 dark:from-gray-700 dark:to-gray-900 text-white p-10">
          <h3 className="text-3xl font-bold">Welcome Back!</h3>
          <p className="mt-3 text-lg">To keep connected with us, please log in.</p>
          <Link href="/login">
            <Button className="mt-6 border-white text-white hover:border-gray-300 hover:text-gray-300 transition-colors border rounded-full px-8">
              Sign In
            </Button>
          </Link>
        </div>
        <div className="p-8">
          <h3 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">Register Here</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input {...field} className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" />
                  </FormControl>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium">Password must contain:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className={field.value?.match(/[A-Z]/) ? 'text-green-500' : 'text-gray-400'}>At least one uppercase letter</li>
                      <li className={field.value?.match(/[a-z]/) ? 'text-green-500' : 'text-gray-400'}>At least one lowercase letter</li>
                      <li className={field.value?.match(/\d/) ? 'text-green-500' : 'text-gray-400'}>At least one number</li>
                      <li className={field.value?.match(/[!@#$%^&*()_+]/) ? 'text-green-500' : 'text-gray-400'}>
                        At least one special character (!@#$%^&*()_+)
                      </li>
                      <li className={(field.value?.length >= 8) ? 'text-green-500' : 'text-gray-400'}>
                        At least 8 characters long
                      </li>
                    </ul>
                  </div>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600" />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-orange-500 text-white dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors"
                isLoading={isLoading} >
                Submit
              </Button>
              <div className="md:hidden text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?
                  <Link href="/login" className="text-orange-400 pl-2 hover:underline dark:text-orange-400">
                    Login
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

export default RegisterPage;
