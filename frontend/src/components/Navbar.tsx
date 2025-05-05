import { Link } from 'react-router-dom';
import { UserPayload } from '../types';

interface NavbarProps {
  user: UserPayload | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className=" bg-red-500 text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors">
          Domov
        </Link>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="font-large">{user.username}</span>
              <Link to="/upload" className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-400 transition-colors">
                Upload
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;