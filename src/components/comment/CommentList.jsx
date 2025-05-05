import CommentCard from "./CommentCard";

function CommentList({ comments, members }) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
          />
        ))
      ) : (
        <p className="text-gray-500">
          No comments yet. Start the conversation!
        </p>
      )}
    </div>
  );
}

export default CommentList;
