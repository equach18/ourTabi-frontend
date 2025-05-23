import { useContext } from "react";
import UserContext from "../../context/UserContext";
import TripContext from "../../context/TripContext";
import defaultProfilePic from "../../assets/profilePic.jpg";

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
        src={commentor?.profilePic || defaultProfilePic}
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
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
            aria-label="Delete comment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentCard;
