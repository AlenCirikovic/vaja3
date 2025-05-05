import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { type ImageDetail, UserPayload } from '../types';

interface ImageDetailProps {
  user: UserPayload | null;
}

const ImageDetail: React.FC<ImageDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<ImageDetail | null>(null);
  const [voteStatus, setVoteStatus] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/images/${id}`);
        const data: ImageDetail = await response.json();
        setImage(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    const fetchVoteStatus = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:3000/api/votes/image/${id}/status`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) setVoteStatus(data.voteStatus);
      } catch (err) {
        console.error('Failed to fetch vote status:', err);
      }
    };

    fetchImage();
    fetchVoteStatus();
  }, [id, user]);

  const handleVote = async (voteType: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/votes/image/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ voteType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to vote');

      setVoteStatus(voteType === voteStatus ? 0 : voteType);
      if (image) {
        const newScore =
          voteStatus === voteType
            ? image.score - voteType
            : voteStatus === 0
            ? image.score + voteType
            : image.score + 2 * voteType;
        setImage({ ...image, score: newScore });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }

      if (image) {
        setImage({
          ...image,
          comments: image.comments.filter((c) => c.id !== commentId),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment.');
    }
  };

  const handleCommentAdded = (newComment: { id: string; content: string; createdAt: string; author: { id: string; username: string } }) => {
    if (image) {
      setImage({
        ...image,
        comments: [newComment, ...image.comments],
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!user || user.id !== image?.author.id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/images/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete image');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image.');
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg text-gray-500">Loading image...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-semibold">{error}</div>;
  if (!image) return <div className="text-center mt-20 text-gray-600">Image not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{image.title}</h1>
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full rounded-xl shadow-lg mb-6"
      />
      <div className="text-gray-600 mb-2">By <span className="font-medium">{image.author.username}</span></div>
      <div className="text-gray-500 mb-4">Posted on {new Date(image.createdAt).toLocaleDateString()}</div>
      {image.message && <p className="text-gray-800 mb-4">{image.message}</p>}
      <p className="text-gray-700 font-medium mb-4">Score: {image.score}</p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleVote(1)}
          className={`px-4 py-2 rounded-lg transition font-semibold ${
            voteStatus === 1 ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-green-100'
          }`}
        >
          👍 Like
        </button>
        <button
          onClick={() => handleVote(-1)}
          className={`px-4 py-2 rounded-lg transition font-semibold ${
            voteStatus === -1 ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-red-100'
          }`}
        >
          👎 Dislike
        </button>
      </div>

      {user?.id === image.author.id && (
        <button
          onClick={handleDeleteImage}
          className="text-red-500 hover:underline mb-6 block"
        >
          Delete Image
        </button>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
      {user && (
        <div className="mb-6">
          <CommentForm imageId={image.id} onCommentAdded={handleCommentAdded} />
        </div>
      )}
      <CommentList comments={image.comments} user={user} onDeleteComment={handleDeleteComment} />
    </div>
  );
};

export default ImageDetail;
