import { getVideoDetails } from "@/lib/actions/uploads/upload";
import UploadRequestCard from "./UploadRequestCard";

export default async function UploadDetails({ videoId }: { videoId: string }) {
  const videoDetails = await getVideoDetails(Number(videoId));

  return (
    <div className="w-full mx-auto">
      {/* @ts-expect-error */}
      <UploadRequestCard videoDetails={videoDetails} />
    </div>
  );
}
