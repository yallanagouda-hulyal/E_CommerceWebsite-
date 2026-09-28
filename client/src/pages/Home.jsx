import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    api.get(`/products${queryString}`)
      .then((res) => setProducts(res.data))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '300', fontStyle: 'italic', fontFamily: 'var(--serif)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {category ? `${category} Collection` : 'All Creations'}
        </h1>
        {search && (
          <span style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Results for: <strong style={{ color: 'var(--gold)' }}>"{search}"</strong>
          </span>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)', letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase' }}>
          Searching Zenith Catalog...
        </div>
      )}
      
      {error && <p className="error" style={{ color: 'var(--accent)', marginBottom: '20px' }}>{error}</p>}
      
      {!loading && (
        <div className="grid">
          {products.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id} className="card">
              <img src={p.image || 'https://via.placeholder.com/300'} alt={p.name} />
              <h3>{p.name}</h3>
              <div className="price">₹{p.price.toLocaleString()}</div>
              <div className="muted">{p.category}</div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
          <p style={{ fontSize: '16px', fontWeight: '300', letterSpacing: '1px', marginBottom: '8px' }}>No items match your criteria</p>
          <p style={{ fontSize: '12px' }}>Try checking your spelling or adjusting filters.</p>
        </div>
      )}
    </div>
  );
}
