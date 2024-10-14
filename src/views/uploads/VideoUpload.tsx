"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { uploadVideo } from "@/lib/actions/uploads/upload";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

export default function VideoUpload() {
  type metaDataType = {
    fileType: string;
    videoTile: string;
    videoDescription: string;
    channelId: number;
  };

  const params = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoMetaData, setVideoMetaData] = useState({
    title: "",
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid video file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      toast({
        title: "Error",
        description: "Please drop a valid video file",
        variant: "destructive",
      });
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Video Upload to S3
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    // AWS S3 Upload
    const metaData: metaDataType = {
      fileType: videoFile?.type || "",
      videoTile: videoMetaData.title,
      videoDescription: videoMetaData.description,
      channelId: parseInt(params?.id || ""),
    };

    // Adding Video Data to the object
    const videoData = new FormData();
    videoData.append("file", videoFile || "");

    try {
      // S3 Upload API Call
      const response = await uploadVideo(videoData, metaData);
      if (response.status === "Success") {
        toast({
          title: response.status,
          description: response.message,
        });
        setVideoMetaData({
          title: "",
          description: "",
        });
        setVideoPreview(null);
        setVideoFile(null);
      } else {
        toast({
          title: response.status,
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="py-4">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-8">
              <div
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {videoPreview ? (
                  <div className="relative w-full h-full">
                    <video
                      src={videoPreview}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVideo();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, WebM, or OGG (MAX. 800MB)
                    </p>
                  </div>
                )}
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={videoPreview ? true : false}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Video Title</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  required
                  value={videoMetaData.title}
                  onChange={(e) =>
                    setVideoMetaData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description"
                  required
                  value={videoMetaData.description}
                  onChange={(e) =>
                    setVideoMetaData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="w-full" disabled={loading}>
                Upload Video
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
