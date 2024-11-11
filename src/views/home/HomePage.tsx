import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock, Upload, Users, Youtube } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 bg-black">
        <Link className="flex items-center justify-center" href="/">
          <Upload className="h-6 w-6 mr-2" />
          <span className="font-bold">Upload Mates</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/support"
          >
            Contact Support
          </Link>
        </nav>
      </header>
      <main className="mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-32 bg-zinc-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-red-500">
                  Upload Mates
                </h1>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Collaborate Safely on YouTube Uploads
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload Mates allows you to securely authenticate your YouTube
                  channel and assign trusted members to upload videos on your
                  behalf, with your final approval.
                </p>
              </div>
              <div className="space-x-4">
                <Link href={"/auth/register"}>
                  <Button size={"lg"}>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Youtube className="h-8 w-8 mb-2 text-red-600" />
                  <CardTitle>Secure Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  Safely connect your YouTube channel using OAuth 2.0, ensuring
                  your credentials are never exposed.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-blue-600" />
                  <CardTitle>Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  Assign trusted team members to upload videos on your behalf,
                  streamlining your content creation process.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="h-8 w-8 mb-2 text-green-600" />
                  <CardTitle>Approval System</CardTitle>
                </CardHeader>
                <CardContent>
                  Review and approve videos before they go live, maintaining
                  full control over your channel's content.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-start">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <Youtube className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Authenticate</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Securely connect your YouTube channel to Upload Mates.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Assign Members</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add trusted team members who can upload videos on your behalf.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Review & Approve</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Review uploaded videos and grant permission before they go
                  live.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Streamline Your Uploads?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join Upload Mates today and experience seamless collaboration
                  for your YouTube channel.
                </p>
              </div>
              <Link href={"/auth/register"}>
                <Button size="lg">Get Started Now</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
