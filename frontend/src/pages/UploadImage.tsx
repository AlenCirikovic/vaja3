import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPayload } from '../types';

interface UploadImageProps {
  user: UserPayload;
}

const UploadImage: React.FC<UploadImageProps> = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    formData.append('image', imageFile); // This is the actual file

    try {
      const response = await fetch('http://localhost:3000/api/images', {
        method: 'POST',
        credentials: 'include',
        body: formData, // Do NOT set Content-Type here — browser handles it
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      navigate(`/images/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Upload Image</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Select Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadImage;
