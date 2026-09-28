import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.response?.data?.message || e.message);
        setLoading(false);
      });
  }, []);

  // Global styles for the dark theme body
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
      <div className="spinner">Fetching your fashion history...</div>
    </div>
  );

  if (error) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <p className="error" style={{ color: '#ff4444' }}>{error}</p>
    </div>
  );

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: '#fff' }}>
      <h2 style={{ fontWeight: '300', letterSpacing: '1px' }}>No orders yet.</h2>
      <p style={{ color: '#888' }}>Your wardrobe is waiting for its first luxury addition.</p>
      <button 
        onClick={() => window.location.href = '/'} 
        style={{ marginTop: '20px', padding: '12px 24px', background: '#fff', color: '#000', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Start Shopping
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '300', fontStyle: 'italic', fontFamily: 'var(--serif)', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>Order History</h1>
        <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>Manage and track your recent purchases</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {orders.map((o) => (
          <div key={o._id} style={{
            background: 'var(--ink-2)',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Order Header */}
            <div style={{
              padding: '20px 24px',
              background: 'rgba(255,255,255,0.015)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Order ID</div>
                <div style={{ fontWeight: '600', fontSize: '13px', color: '#eee', fontFamily: 'monospace' }}>#{o._id.toUpperCase()}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Date Placed</div>
                <div style={{ fontWeight: '500', fontSize: '13px', color: '#eee' }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge success">
                  {o.isPaid ? 'PAID' : 'UNPAID'}
                </span>
                <span className={`badge ${o.isDelivered ? 'success' : 'warning'}`}>
                  {o.isDelivered ? 'DELIVERED' : 'PENDING DISPATCH'}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ padding: '24px' }}>
              {o.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: idx === o.items.length - 1 ? 0 : '16px',
                  paddingBottom: idx === o.items.length - 1 ? 0 : '16px',
                  borderBottom: idx === o.items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img 
                      src={item.image || 'https://via.placeholder.com/60x75'} 
                      alt={item.name} 
                      style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '1px', border: '1px solid var(--border)' }} 
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#fff', fontSize: '15px' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Qty: {item.qty} × ₹{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: '600', color: '#fff' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifycontent: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="secondary" style={{ padding: '8px 16px', fontSize: '10px' }}>View Invoice</button>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '13px', color: 'var(--muted)', marginRight: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount:</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--gold)' }}>₹{o.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}