import Template from "@/components/template/Template";
import Requests from "@/views/requests/Requests";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Template title="Upload Requests">
      <Requests searchParams={searchParams} />
    </Template>
  );
}
