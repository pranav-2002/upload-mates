"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { contactSupport } from "@/lib/actions/support/support";
import { useState } from "react";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function Support() {
  const { toast } = useToast();

  const [supportData, setSupportData] = useState({
    email: "",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      const ticket = await contactSupport(supportData);
      if (ticket.status === "Success") {
        toast({
          title: ticket.status,
          description: ticket.message,
        });
        setSupportData({
          email: "",
          subject: "",
          description: "",
        });
      } else {
        toast({
          title: ticket.status,
          description: ticket.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
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
    <div>
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-black">
        <Link className="flex items-center justify-center" href="/">
          <Upload className="h-6 w-6 mr-2" />
          <span className="font-bold">Upload Mates</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/support"
          >
            Contact Support
          </Link>
        </nav>
      </header>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Contact Support
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;re here to help. Fill out the form below and we&apos;ll
              get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  placeholder="your@email.com"
                  value={supportData.email}
                  onChange={(e) =>
                    setSupportData({ ...supportData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Brief description of your issue"
                  value={supportData.subject}
                  onChange={(e) =>
                    setSupportData({ ...supportData, subject: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1"
                  placeholder="Please provide more details about your issue"
                  value={supportData.description}
                  onChange={(e) =>
                    setSupportData({
                      ...supportData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
