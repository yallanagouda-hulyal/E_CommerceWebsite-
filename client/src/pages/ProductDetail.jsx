import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Set global background to black
    document.body.style.backgroundColor = '#000';
    
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((e) => setError(e.response?.data?.message || e.message));

    return () => { document.body.style.backgroundColor = ''; };
  }, [id]);

  const handleQtyChange = (val) => {
    if (val >= 1 && val <= product.stock) setQty(val);
  };

  if (error) return (
    <div style={{ textAlign: 'center', padding: '100px', color: '#ff4444', backgroundColor: '#000', minHeight: '100vh' }}>
      <p style={{ fontWeight: '700', letterSpacing: '1px' }}>{error}</p>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '100px', fontSize: '14px', letterSpacing: '4px', color: '#fff', backgroundColor: '#000', minHeight: '100vh' }}>
      LOADING ZENITH...
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '80px',
        padding: '60px 20px'
      }}>

        {/* LEFT: IMAGE SECTION */}
        <div style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
          <div style={{
            backgroundColor: '#0a0a0a',
            borderRadius: '0px',
            overflow: 'hidden',
            border: '1px solid #1a1a1a'
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '600px', objectFit: 'cover', opacity: '0.9' }}
            />
          </div>
        </div>

        {/* RIGHT: DETAILS SECTION */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <nav style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', color: '#666', marginBottom: '20px', textTransform: 'uppercase' }}>
            {product.category} / SKU-{product._id.slice(-5)}
          </nav>

          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-1.5px' }}>
            {product.name.toUpperCase()}
          </h1>

          <div style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '20px' }}>
            <span style={{ fontSize: '32px', fontWeight: '300', color: '#fff' }}>
              ₹{product.price.toLocaleString()}
            </span>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '15px', color: '#888' }}>DESCRIPTION</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#ccc', fontWeight: '400' }}>
              {product.description}
            </p>
          </div>

          {/* QUANTITY PICKER */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '15px', color: '#888' }}>SELECT QUANTITY</h3>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #333', width: 'fit-content', backgroundColor: '#0a0a0a' }}>
              <button
                onClick={() => handleQtyChange(qty - 1)}
                style={{ width: '50px', height: '50px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#fff' }}>–</button>
              <span style={{ width: '50px', textAlign: 'center', fontWeight: '700', fontSize: '16px' }}>{qty}</span>
              <button
                onClick={() => handleQtyChange(qty + 1)}
                style={{ width: '50px', height: '50px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#fff' }}>+</button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              disabled={product.stock === 0}
              onClick={() => { addToCart(product, qty); }}
              style={{
                width: '100%', padding: '22px', backgroundColor: '#fff', color: '#000',
                border: 'none', fontWeight: '900', fontSize: '13px',
                letterSpacing: '3px', cursor: 'pointer', transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => { e.target.style.transform = 'scale(1.01)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; }}
            >
              {product.stock > 0 ? 'ADD TO SHOPPING BAG' : 'OUT OF STOCK'}
            </button>

            <button
              disabled={product.stock === 0}
              onClick={() => { addToCart(product, qty); navigate('/checkout'); }}
              style={{
                width: '100%', padding: '22px', backgroundColor: 'transparent', color: '#fff',
                border: '1px solid #333', fontWeight: '900', fontSize: '13px',
                letterSpacing: '3px', cursor: 'pointer', transition: 'all 0.3s'
              }}
              onMouseOver={(e) => { e.target.style.borderColor = '#fff'; }}
              onMouseOut={(e) => { e.target.style.borderColor = '#333'; }}
            >
              BUY IT NOW
            </button>
          </div>

          {/* AUTHENTICITY BAR */}
          <div style={{ marginTop: '50px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid #1a1a1a', paddingTop: '30px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#555', letterSpacing: '1px' }}>✓ COMPLIMENTARY SHIPPING</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#555', letterSpacing: '1px' }}>✓ 2-YEAR ZENITH WARRANTY</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#555', letterSpacing: '1px' }}>✓ SECURE CHECKOUT</div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#555', letterSpacing: '1px' }}>✓ 100% TRACEABLE MATERIALS</div>
          </div>
        </div>
      </div>
    </div>
  );
}