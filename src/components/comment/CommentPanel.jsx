import { useRef, useEffect, useContext } from "react";
import TripContext from "../../context/TripContext";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

function CommentsPanel() {
  const { addComment, comments } = useContext(TripContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    // scroll to bottom whenever comments update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow p-4 overflow-hidden">
      <h3 className="text-xl font-semibold mb-3">Comments</h3>

      <div ref={scrollRef} className="flex-1 overflow-y-auto border p-2 rounded-md bg-gray-50 mb-3">
        <CommentList comments={comments} />
      </div>

      <CommentForm addComment={addComment} />
    </div>
  );
}

export default CommentsPanel;
