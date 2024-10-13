"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Mail, Slack, Twitter } from "lucide-react";
import { useSession } from "next-auth/react";
import { getChannelNames } from "@/lib/actions/channels/channels";
import { addNewMember, getAllMembers } from "@/lib/actions/members/members";
import { useToast } from "@/hooks/use-toast";

export default function Members() {
  const { toast } = useToast();

  interface channelNames {
    id: number;
    channel_name: string;
  }
  type channelType = channelNames[];

  const [channelNames, setChannelNames] = useState<channelType>([]);
  const [members, setMembers] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  // Get channel names
  const handleOpen = async () => {
    // @ts-ignore: Unreachable code error
    const userId = session?.user?.id;
    const response = await getChannelNames(userId);
    if (response.status === "Success") {
      setChannelNames(response.data);
    } else {
      console.log("error");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = {
      memberEmail,
      selectedChannel: parseInt(selectedChannel),
    };

    if (selectedChannel.length === 0 || memberEmail.length === 0) {
      return toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
    }

    const response = await addNewMember(data);

    if (response.status === "Success") {
      setLoading(false);
      setMemberEmail("");
      toast({
        title: response.status,
        description: response.message,
      });
    } else {
      setLoading(false);
      toast({
        title: response.status,
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const getMembersData = async () => {
    // @ts-ignore: Unreachable code error
    const response = await getAllMembers();
    if (response.status === "Success") {
      setMembers(response.data as any);
    } else {
      toast({
        title: response.status,
        description: response.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getMembersData();
  }, []);

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Team Members</CardTitle>
              <CardDescription>Manage and invite team members</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild onClick={handleOpen}>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite a Team Member</DialogTitle>
                  <DialogDescription>
                    Invite a new member to your team via their email or other
                    channels.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="channel" className="text-right">
                      Channel
                    </Label>
                    <Select
                      onValueChange={(channelId) =>
                        setSelectedChannel(channelId)
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {channelNames.map((channel) => (
                          <SelectItem
                            key={channel.id}
                            value={channel.id.toString()}
                          >
                            <div className="flex items-center">
                              {channel.channel_name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="invite" className="text-right">
                      Email Id
                    </Label>
                    <Input
                      type="email"
                      className="col-span-3"
                      placeholder={"email@example.com"}
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit} disabled={loading}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="" alt={member.member_name} />
                    <AvatarFallback>
                      {member.member_name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {member.member_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.member_email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span className="capitalize">
                    Channel Id - {member.channel_id}
                  </span>
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
