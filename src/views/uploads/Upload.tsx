import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllMemberChannels } from "@/lib/actions/members/members";

export default async function Upload() {
  const { channels } = await getAllMemberChannels();

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels &&
          channels.map((data) => (
            <Card key={data.channel.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={""} alt={data.channel.channel_name} />
                    <AvatarFallback>
                      {data.channel.channel_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{data.channel.channel_name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">
                  Authorized
                </Badge>
                <p className="text-sm text-muted-foreground">
                  You have permission to upload content to this channel.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/upload/${data.channel.id}`}>
                    Upload to This Channel
                  </Link>
                </Button>
              </CardFooter>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/upload/requests`}>
                    View Upload Requests
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
