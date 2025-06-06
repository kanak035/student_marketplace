import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.js';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  console.log('User:',user);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error('Fetch product error:', err.response?.data?.msg);
        setError('Product not found');
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        window.location.href = '/products';
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
      <img
        src={`http://localhost:5000/${product.image}`}
        alt={product.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-semibold mb-2">${product.price}</p>
      <p className="text-gray-600 mb-2">Category: {product.category}</p>
      <p className="text-gray-600 mb-4">
        Seller: {product.seller.name} ({product.seller.email})
      </p>
      {user && user.id === product.seller._id && (
        <div className="flex space-x-4 mb-4">
          <Link
            to={`/products/edit/${id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
      {user && user.id !== product.seller._id && (
        <Link
          to={`/messages/${product.seller._id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Message Seller
        </Link>
      )}
    </div>
  );
}
export default ProductDetails;