"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Play, User, Youtube } from "lucide-react";
import { Button } from "../ui/button";
import { handleVideoUpload } from "@/lib/actions/youtube/youtube";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface VideoUploadRequest {
  id: number;
  video_title: string;
  video_description: string;
  thumbnail_url: string;
  video_url: string;
  channel: {
    channel_name: string;
  };
  channel_id: number;
  status: string;
  user_id: number;
}

const statusColors = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-green-500",
  REJECTED: "bg-red-500",
};

export default function VideoUploadRequestCard({
  request,
}: {
  request: VideoUploadRequest;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  // Upload to Youtube
  const handleYoutubeUpload = async () => {
    setLoading(true);

    const body = {
      videoUrl: request.video_url,
      videoTitle: request.video_title,
      videoDescription: request.video_description,
      videoId: request.id,
      channelId: request.channel_id,
    };

    try {
      const response = await handleVideoUpload(body);
      console.log(response);
      if (response.status === "Error") {
        toast({
          title: response.status,
          description: response.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: response.status,
          description: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please Try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={request.thumbnail_url}
                alt={request.video_title}
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-16 h-16 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AspectRatio ratio={16 / 9}>
            <video
              src={request.video_url}
              controls
              autoPlay
              className="w-full h-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </AspectRatio>
        </DialogContent>
      </Dialog>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">
            {request.video_title}
          </h3>
          {/* @ts-expect-error: Unreachable code error */}
          <Badge className={`${statusColors[request.status]} text-white`}>
            {request.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {request.video_description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-1" />
            <span>{request.channel.channel_name}</span>
          </div>
          <Button
            onClick={handleYoutubeUpload}
            disabled={request.status !== "APPROVED" || loading}
            className="bg-red-600 hover:bg-red-700 text-white"
            size={"sm"}
          >
            <Youtube className="w-4 h-4 mr-2" />
            Upload to YouTube
          </Button>
        </div>
      </div>
    </div>
  );
}
