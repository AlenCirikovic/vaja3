import { useState, useEffect } from 'react';
import ImageCard from '../components/ImageCard';
import { Image } from '../types';

const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/images');
        const data: Image[] = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-500">Loading images...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Vaja 3</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default Home;
