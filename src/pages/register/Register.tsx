"use client";

import Link from "next/link";

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
import { useState } from "react";
import { register } from "@/lib/actions/user";
import { useToast } from "@/hooks/use-toast";

export function Register() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }

  const [userData, setUserData] = useState<userData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await register(userData);
      if (response.status === "Success") {
        toast({
          title: response.status,
          description: response.message,
        });
      } else {
        toast({
          title: response.status,
          description: response.message,
          variant: "destructive",
        });
      }
      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
    } catch (error) {
      console.log("Error while signup", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData({ ...userData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="00-00-00"
                  required
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Create an account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
