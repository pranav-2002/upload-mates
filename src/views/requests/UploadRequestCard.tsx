"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { modifyUploadRequest } from "@/lib/actions/uploads/upload";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function UploadRequestCard({
  videoDetails,
}: {
  videoDetails: {
    status: string;
    message: string;
    data: {
      channel: {
        channel_name: string;
      };
      User: {
        first_name: string;
        last_name: string;
      };
    } & {
      id: number;
      video_url: string;
      thumbnail_url: string;
      video_title: string;
      video_description: string;
      channel_id: number;
      user_id: number;
      status: "APPROVED" | "REJECTED" | "PENDING";
    };
  };
}) {
  const { toast } = useToast();

  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await modifyUploadRequest(
        videoDetails.data.id,
        "APPROVED"
      );
      setIsAcceptDialogOpen(false);
      if (response.status === "Error") {
        toast({
          title: response.status,
          description: response.message,
          variant: "destructive",
        });
      }
      toast({
        title: response.status,
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await modifyUploadRequest(
        videoDetails.data.id,
        "REJECTED"
      );
      if (response.status === "Error") {
        toast({
          title: response.status,
          description: response.message,
          variant: "destructive",
        });
      }
      toast({
        title: response.status,
        description: response.message,
      });
      setIsRejectDialogOpen(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3">
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="video">Video</Label>
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <video
                id="video"
                src={videoDetails.data?.video_url}
                controls
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <AspectRatio ratio={4 / 3} className="bg-muted">
              <Image
                src={videoDetails.data?.thumbnail_url}
                alt="Video thumbnail"
                width={100}
                height={100}
                className="rounded-md object-cover w-full h-full"
              />
            </AspectRatio>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <p id="title" className="text-lg font-medium">
              {videoDetails.data?.video_title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uploadedBy">Uploaded by</Label>
              <p id="uploadedBy" className="text-sm">
                {videoDetails.data?.User?.first_name +
                  " " +
                  videoDetails.data?.User?.last_name}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channelName">Upload to channel</Label>
              <p id="channelName" className="text-sm">
                {videoDetails?.data?.channel?.channel_name}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <p id="description" className="text-sm text-muted-foreground">
            {videoDetails.data?.video_description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="destructive"
          onClick={() => setIsRejectDialogOpen(true)}
        >
          <XCircle className="mr-2 h-4 w-4" /> Reject Upload
        </Button>
        <Button variant="default" onClick={() => setIsAcceptDialogOpen(true)}>
          <CheckCircle className="mr-2 h-4 w-4" /> Accept Upload
        </Button>
      </CardFooter>

      <AlertDialog
        open={isAcceptDialogOpen}
        onOpenChange={setIsAcceptDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Video Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this video upload? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={handleAccept}>
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Video Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this video upload? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={loading}>
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
