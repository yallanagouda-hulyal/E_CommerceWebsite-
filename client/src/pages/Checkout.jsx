import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [addr, setAddr] = useState({ address: '', city: '', postalCode: '', country: 'India' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/orders', { items, shippingAddress: addr, totalPrice: total });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
      <p style={{ marginBottom: '20px', color: 'var(--muted)' }}>Your cart is empty.</p>
      <button onClick={() => navigate('/')}>Go Shopping</button>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '300', fontStyle: 'italic', fontFamily: 'var(--serif)', marginBottom: '40px', letterSpacing: '1px', textTransform: 'uppercase' }}>Secure Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', alignItems: 'start' }}>

        {/* Left Side: Shipping Form */}
        <form onSubmit={placeOrder} style={{ backgroundColor: 'var(--ink-2)', border: '1px solid var(--border)', padding: '40px', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--gold)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Shipping Address</h2>

          {error && <div className="error">{error}</div>}

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', display: 'block', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Street Address</label>
            <input placeholder="Flat, House no., Building, Company, Apartment" required value={addr.address}
              onChange={(e) => setAddr({ ...addr, address: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', display: 'block', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>City</label>
              <input placeholder="City" required value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', display: 'block', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Postal Code</label>
              <input placeholder="6-digit PIN" required value={addr.postalCode}
                onChange={(e) => setAddr({ ...addr, postalCode: e.target.value })} />
            </div>
          </div>

          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', display: 'block', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Country</label>
          <input placeholder="Country" required value={addr.country}
            onChange={(e) => setAddr({ ...addr, country: e.target.value })} />

          <div style={{ marginTop: '30px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '2px', border: '1px dashed var(--border)' }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Payment Method</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#ccc' }}>
              💳 <strong>Cash on Delivery / Mock Payment</strong>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: 'var(--muted)' }}>
              Your order will be processed immediately. No card details required for this demo.
            </p>
          </div>

          <button
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '30px'
            }}
          >
            {loading ? 'Processing Order...' : `Pay ₹${total.toLocaleString()}`}
          </button>
        </form>

        {/* Right Side: Order Review */}
        <div style={{ backgroundColor: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '4px', padding: '32px', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--gold)' }}>Order Review</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '12px' }}>
                <span style={{ color: '#ccc' }}>{item.name} <strong style={{ color: 'var(--gold)' }}>× {item.qty}</strong></span>
                <span style={{ fontWeight: '600' }}>₹{(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--muted)' }}>
              <span>Subtotal</span>
              <span style={{ color: '#fff' }}>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#2ecc71', fontWeight: '600' }}>
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', borderTop: '2px solid var(--gold)', paddingTop: '20px' }}>
              <span>Total</span>
              <span style={{ color: 'var(--gold)' }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}