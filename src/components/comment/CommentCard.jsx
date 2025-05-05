import { useContext } from "react";
import UserContext from "../../context/UserContext";
import TripContext from "../../context/TripContext";

function CommentCard({ comment }) {
  const { members, deleteComment } = useContext(TripContext);
  const { currentUser } = useContext(UserContext);
  const commentor = members.find((m) => m.userId === comment.userId);
  const isCommentOwner = currentUser?.id === comment.userId;

  function handleDelete() {
    deleteComment(comment.id);
  }
  return (
    <div className="flex items-start gap-3">
      <img
        src={commentor?.profilePic || "/default-avatar.png"}
        alt={commentor?.username || "User"}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="relative bg-gray-100 p-3 rounded-lg max-w-xs">
        <p className="text-sm font-semibold">
          @{commentor?.username || "Unknown"}
        </p>
        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
          {comment.text}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
        {isCommentOwner && (
          <button
            onClick={handleDelete}
            className="absolute top-0 right-0 text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
