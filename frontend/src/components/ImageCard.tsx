import { Link } from 'react-router-dom';
import { Image } from '../types';

interface ImageCardProps {
  image: Image;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Link to={`/images/${image.id}`}>
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-48 h-48 object-cover rounded-md mb-2"
        />
        <h2 className="text-lg font-semibold">{image.title}</h2>
      </Link>
      <p className="text-gray-600">By {image.author.username}</p>
      <p className="text-gray-600">
        Posted on {new Date(image.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        {image._count.votes} votes, {image._count.comments} comments
      </p>
    </div>
  );
};

export default ImageCard;