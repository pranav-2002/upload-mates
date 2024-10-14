"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { generateAuthLink } from "@/lib/actions/oauth/oauth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Integration() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleIntegration = async () => {
    setLoading(true);
    try {
      await generateAuthLink();
      toast({
        title: "Integration Started",
        description: "Redirecting to Google Oauth",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-red-500 via-red-600 to-red-700 dark:from-gray-900 dark:via-red-900 dark:to-gray-80">
      <div className="flex flex-col items-center justify-center p-4 text-white z-10">
        <Youtube className="h-24 w-24 mb-4 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Integrate Your YouTube Account
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
          Unlock powerful features and seamlessly manage your content
        </p>
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Ready to Connect?
            </CardTitle>
            <CardDescription className="text-center text-gray-200">
              Click below to link your YouTube account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <Link href={"/api/oauth"}> */}
            <Button
              onClick={handleIntegration}
              disabled={loading}
              className="w-full bg-white text-red-600 hover:bg-gray-100 py-6 rounded-full font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Integrate YouTube Account
            </Button>
            {/* </Link> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
