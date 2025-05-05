import { useContext } from "react";
import TripContext from "../../context/TripContext";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

function CommentsPanel() {
  const { addComment, comments } = useContext(TripContext);

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-md p-4 overflow-hidden">
      <h3 className="text-xl font-semibold mb-2">Comments</h3>

      <div className="flex-1 overflow-y-auto border p-2 rounded-md bg-gray-50">
        <CommentList comments={comments} />
      </div>

      <div className="mt-2">
        <CommentForm addComment={addComment} />
      </div>
    </div>
  );
}

export default CommentsPanel;
