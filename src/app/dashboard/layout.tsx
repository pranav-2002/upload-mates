import Sidebar from "@/components/sidebar/Sidebar";

export default function dashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Sidebar>{children}</Sidebar>;
}
