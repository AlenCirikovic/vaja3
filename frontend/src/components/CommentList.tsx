import { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
  user: { id: string } | null;
  onDeleteComment: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, user, onDeleteComment }) => {
  if (!comments.length) {
    return <div className="text-gray-600">No comments yet.</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-800">{comment.content}</p>
          <p className="text-sm text-gray-500">
            By {comment.author.username} on{' '}
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
          {user?.id === comment.author.id && (
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;