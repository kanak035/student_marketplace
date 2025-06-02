import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 mb-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white text-xl font-bold">Marketplace</Link>
        <div>
          <Link to="/products" className="text-white mr-4">Products</Link>
          {user ? (
            <>
              <Link to="/products/new" className="text-white mr-4">Add Product</Link>
              <button onClick={handleLogout} className="text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="text-white mr-4">Signup</Link>
              <Link to="/login" className="text-white">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;