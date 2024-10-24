import Template from "@/components/template/Template";
import UploadDetails from "@/views/requests/UploadDetails";

export default function Page({ params }: { params: { videoId: string } }) {
  return (
    <Template title="Upload Details">
      <UploadDetails videoId={params.videoId} />
    </Template>
  );
}
