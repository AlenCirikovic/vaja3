import { useState, FormEvent } from 'react';
import { Comment } from '../types';

interface CommentFormProps {
  imageId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ imageId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/api/comments/image/${imageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      const data: Comment = await response.json();

      if (!response.ok) {
        //throw new Error(data.error || 'Failed to post comment');
      }

      setContent('');
      onCommentAdded(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" className="block text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Your comment..."
          required
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;