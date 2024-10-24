import ChannelCard from "@/components/cards/ChannelCard";
import { getUserData } from "@/lib/actions/dashboard/userData";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${process.env.NEXTAUTH_URL}/auth/login`);
  }

  const userChannels = await getUserData(session.user.id);

  return (
    <div className="container mx-auto p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userChannels?.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
}
