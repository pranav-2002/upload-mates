"use client";

import React, { useState } from "react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type channelType = {
  channel: {
    id: number;
    created_at: Date;
    updated_at: Date;
    user_id: number;
    channel_name: string;
    channel_image: string;
    access_token: string;
    refresh_token: string;
    expires_at: Date;
  };
};

export default function ChannelCard({ channel }: channelType) {
  const [showTokens, setShowTokens] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={channel.channel_image}
              alt={channel.channel_name}
            />
            <AvatarFallback>
              {channel.channel_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{channel.channel_name}</CardTitle>
            {/* <p className="text-sm text-muted-foreground">
              {"pranav.2002tis@gmail.com"}
            </p> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Access Token:</p>
          <p className="text-sm text-muted-foreground break-all">
            {showTokens ? channel.access_token : "••••••••••••••••"}
          </p>
          <p className="text-sm font-medium">Refresh Token:</p>
          <p className="text-sm text-muted-foreground break-all">
            {showTokens ? channel.refresh_token : "••••••••••••••••"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
        <Button variant="outline" onClick={() => setShowTokens(!showTokens)}>
          {showTokens ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Tokens
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Tokens
            </>
          )}
        </Button>
        <Link href={`/dashboard/requests?channelId=${channel.id}`}>
          <Button variant="outline" size="sm">
            View Requests
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
