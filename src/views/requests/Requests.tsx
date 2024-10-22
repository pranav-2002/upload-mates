import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllUploadRequests } from "@/lib/actions/requests/uploadRequests";

export default async function VideoUploadRequests({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const channelId = searchParams.channelId;

  const videoRequests = await getAllUploadRequests(Number(channelId));

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoRequests?.data?.map((video) => (
          <Card key={video.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{video.video_title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="relative">
                <img
                  src={video.thumbnail_url}
                  alt={video.video_title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                {video.video_description}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/requests/video/${video.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center"
                >
                  Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
