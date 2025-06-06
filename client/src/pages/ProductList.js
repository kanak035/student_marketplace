import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Fetch products error:', err.response?.data?.msg);
        setError('Failed to load products');
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {products.length === 0 && !error ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="border rounded-lg p-4 shadow hover:shadow-lg">
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600">Ruppes{product.price}</p>
              <Link
                to={`/products/${product._id}`}
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ProductList;