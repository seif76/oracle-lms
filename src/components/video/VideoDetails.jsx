const VideoDetails = ({ video }) => {
    return (
      <div className="mb-6 border p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold">Title: {video.title}</h2>
        <p className="text-gray-600">Description : {video.description || "No description provided"}</p>
        <p>
          <strong>Course Name :</strong> {video.courseId?.title || "Unknown"}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>youtube Link: </strong> {video.youtubeLink || "No Url Provided" }
        </p>
      
      </div>
    );
  };
  
  export default VideoDetails;
  