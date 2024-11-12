import VideoUploadRequestCard from "@/components/cards/VideoUploadRequestCard";
import NoContent from "@/components/no-content/NoContent";
import { getUserUploadRequests } from "@/lib/actions/requests/uploadRequests";

export default async function UploadRequests() {
  const uploadRequests = await getUserUploadRequests();
  return (
    <div className="container mx-auto py-8">
      {uploadRequests.length === 0 && (
        <NoContent
          title="No Upload Requests"
          description="Upload a video and ask for a review"
          buttonContent="Upload video"
          link="/dashboard/upload"
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadRequests.map((request) => (
          <VideoUploadRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
