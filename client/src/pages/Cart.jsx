import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  // Set global background to black
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  if (items.length === 0)
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
        <h2 style={{ fontWeight: '300', fontSize: '32px', letterSpacing: '1px' }}>Your bag is empty</h2>
        <p style={{ color: '#888', marginBottom: '32px' }}>Looks like you haven't added anything to your bag yet.</p>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '16px 40px',
          backgroundColor: '#fff',
          color: '#000',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '700',
          textTransform: 'uppercase',
          fontSize: '14px'
        }}>Shop New Arrivals</Link>
      </div>
    );

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', letterSpacing: '-1px' }}>
        Shopping Bag <span style={{ fontWeight: '300', color: '#666' }}>({items.length})</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '60px', alignItems: 'start' }}>

        {/* Left Side: Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {items.map((i) => (
            <div key={i.product} style={{
              display: 'flex',
              gap: '24px',
              paddingBottom: '32px',
              borderBottom: '1px solid #1a1a1a'
            }}>
              <img src={i.image} alt={i.name} style={{
                width: '140px',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '4px',
                backgroundColor: '#111',
                border: '1px solid #222'
              }} />

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#fff' }}>{i.name}</h3>
                    <button
                      onClick={() => removeFromCart(i.product)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', fontSize: '18px', transition: '0.3s' }}
                      onMouseEnter={(e) => e.target.style.color = '#fff'}
                      onMouseLeave={(e) => e.target.style.color = '#444'}
                    >✕</button>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Luxury Edition</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #333', borderRadius: '4px', background: '#0a0a0a' }}>
                    <button
                      onClick={() => updateQty(i.product, Math.max(1, i.qty - 1))}
                      style={{ padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', color: '#fff' }}>–</button>
                    <span style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{i.qty}</span>
                    <button
                      onClick={() => updateQty(i.product, i.qty + 1)}
                      style={{ padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', color: '#fff' }}>+</button>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>₹{(i.price * i.qty).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary Card */}
        <div style={{
          backgroundColor: '#0a0a0a',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid #222',
          position: 'sticky',
          top: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '24px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>Subtotal</span>
              <span style={{ color: '#eee' }}>₹{total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>Shipping</span>
              <span style={{ color: '#fff', fontWeight: '600', fontSize: '12px' }}>COMPLIMENTARY</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>Tax</span>
              <span style={{ color: '#eee' }}>₹0</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              marginTop: '16px',
              borderTop: '1px solid #222',
              fontSize: '20px',
              fontWeight: '800',
              color: '#fff'
            }}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '800',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Checkout Now
          </button>

          <p style={{ fontSize: '11px', color: '#444', textAlign: 'center', lineHeight: '1.6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Secure Checkout • Free Returns
          </p>
        </div>

      </div>
    </div>
  );
}