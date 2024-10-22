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

export default function UploadDetails({
  videoUrl = "https://example.com/video.mp4",
  thumbnailUrl = "/placeholder.svg?height=400&width=600",
  title = "Amazing Video Title",
  description = "This is a fantastic video description that showcases the content of the video.",
}) {
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleAccept = () => {
    // Here you would typically send the accept request to your backend
    console.log("Upload accepted");
    setIsAcceptDialogOpen(false);
  };

  const handleReject = () => {
    // Here you would typically send the reject request to your backend
    console.log("Upload rejected");
    setIsRejectDialogOpen(false);
  };

  return (
    <Card className="w-full mx-auto p-3">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="video">Video</Label>
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <video
              id="video"
              src={videoUrl}
              controls
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <img
              id="thumbnail"
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <p id="title" className="text-lg font-medium">
            {title}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <p id="description" className="text-sm text-muted-foreground">
            {description}
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
            <AlertDialogAction onClick={handleAccept}>Accept</AlertDialogAction>
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
            <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
