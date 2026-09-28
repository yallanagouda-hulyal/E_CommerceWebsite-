import { Routes, Route, Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';

/* ─── DESIGN TOKENS ─────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:      #0a0a0e;
    --ink-2:    #14141a;
    --ink-3:    #1e1e28;
    --glass:    rgba(255,255,255,0.04);
    --border:   rgba(255,255,255,0.08);
    --gold:     #c9a84c;
    --gold-2:   #f0d080;
    --cream:    #f5f0e8;
    --muted:    rgba(255,255,255,0.38);
    --accent:   #e05c5c;
    --nav-h:    72px;
    --serif:    'Cormorant Garamond', Georgia, serif;
    --sans:     'DM Sans', system-ui, sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--ink);
    color: #fff;
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── PROMO BAR ── */
  .promo-bar {
    background: var(--gold);
    color: var(--ink);
    font-size: 11px;
    text-align: center;
    padding: 9px 0;
    letter-spacing: 2.5px;
    font-weight: 600;
    text-transform: uppercase;
    font-family: var(--sans);
    position: relative;
    overflow: hidden;
  }
  .promo-bar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
    animation: shimmer 3s infinite;
  }
  @keyframes shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .promo-close {
    position: absolute;
    right: 16px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    cursor: pointer;
    color: var(--ink);
    font-size: 16px;
    line-height: 1;
    opacity: 0.6;
    transition: opacity 0.2s;
  }
  .promo-close:hover { opacity: 1; }

  /* ── NAV ── */
  .nav-wrap {
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s;
  }
  .nav-wrap.scrolled {
    background: rgba(10,10,14,0.85);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,0.6);
  }
  .nav-wrap.top {
    background: linear-gradient(180deg, rgba(10,10,14,0.95) 0%, rgba(10,10,14,0.6) 100%);
  }
  .nav-inner {
    max-width: 1360px;
    margin: 0 auto;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 28px;
  }

  /* ── LOGO ── */
  .logo { text-decoration: none; display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; }
  .logo-main {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 4px;
    color: #fff;
    line-height: 1;
    text-transform: uppercase;
  }
  .logo-sub {
    font-size: 8px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    font-family: var(--sans);
  }

  /* ── DIVIDER ── */
  .nav-divider {
    width: 1px; height: 36px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── SEARCH ── */
  .search-wrap {
    flex: 1;
    position: relative;
    max-width: 520px;
  }
  .search-wrap input {
    width: 100%;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 2px;
    padding: 10px 44px 10px 16px;
    color: #fff;
    font-family: var(--sans);
    font-size: 13px;
    outline: none;
    transition: border-color 0.25s, background 0.25s;
    letter-spacing: 0.3px;
  }
  .search-wrap input::placeholder { color: var(--muted); }
  .search-wrap input:focus {
    border-color: var(--gold);
    background: rgba(255,255,255,0.07);
  }
  .search-icon {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 15px;
    pointer-events: none;
    transition: color 0.25s;
  }
  .search-wrap:focus-within .search-icon { color: var(--gold); }

  /* ── NAV ACTIONS ── */
  .nav-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }

  .nav-btn {
    display: flex; flex-direction: column; align-items: center;
    gap: 3px;
    padding: 6px 14px;
    background: none; border: none;
    color: rgba(255,255,255,0.75);
    cursor: pointer;
    border-radius: 2px;
    text-decoration: none;
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: color 0.2s, background 0.2s;
    position: relative;
  }
  .nav-btn:hover { color: #fff; background: var(--glass); }
  .nav-btn .icon { font-size: 18px; }

  .cart-badge {
    position: absolute;
    top: 4px; right: 10px;
    min-width: 17px; height: 17px;
    background: var(--accent);
    color: #fff; font-size: 9px;
    font-weight: 700; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
    border: 2px solid var(--ink);
    animation: pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }

  .login-pill {
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold) !important;
    padding: 8px 22px !important;
    letter-spacing: 2px;
    font-size: 11px !important;
    transition: background 0.25s, color 0.25s !important;
    border-radius: 1px;
  }
  .login-pill:hover {
    background: var(--gold) !important;
    color: var(--ink) !important;
  }

  .logout-btn {
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    background: none; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.6); padding: 6px 14px; border-radius: 2px;
    cursor: pointer; font-family: var(--sans);
    transition: border-color 0.2s, color 0.2s;
  }
  .logout-btn:hover { border-color: var(--accent); color: var(--accent); }

  .user-greeting {
    font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
    color: var(--muted); font-family: var(--sans);
    white-space: nowrap;
  }
  .user-greeting strong { color: var(--gold); font-weight: 500; }

  /* ── CATEGORY STRIP ── */
  .cat-strip {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--ink-2);
  }
  .cat-inner {
    max-width: 1360px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 0 32px;
  }
  .cat-link {
    position: relative;
    padding: 13px 24px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
    transition: color 0.2s;
    white-space: nowrap;
  }
  .cat-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%; right: 50%;
    height: 2px;
    background: var(--gold);
    transition: left 0.25s cubic-bezier(0.4,0,0.2,1), right 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  .cat-link:hover { color: #fff; }
  .cat-link:hover::after { left: 16px; right: 16px; }
  .cat-link.active { color: var(--gold); }
  .cat-link.active::after { left: 16px; right: 16px; }

  /* ── PAGE CONTENT ── */
  .page-content {
    max-width: 1360px;
    margin: 32px auto 0;
    padding: 0 32px;
    min-height: calc(100vh - var(--nav-h) - 200px);
  }

  /* ── FOOTER ── */
  .footer {
    margin-top: 120px;
    background: var(--ink-2);
    border-top: 1px solid var(--border);
    padding: 70px 0 0;
  }
  .footer-grid {
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 48px;
  }
  .footer-brand .logo-main { font-size: 36px; }
  .footer-brand p {
    margin-top: 16px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.8;
    max-width: 260px;
  }
  .footer-col h5 {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    font-weight: 600;
    font-family: var(--sans);
  }
  .footer-col a {
    display: block;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    margin-bottom: 10px;
    transition: color 0.2s, padding-left 0.2s;
  }
  .footer-col a:hover { color: #fff; padding-left: 4px; }
  .footer-bottom {
    max-width: 1360px;
    margin: 48px auto 0;
    padding: 24px 32px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-bottom p { font-size: 12px; color: var(--muted); letter-spacing: 0.5px; }
  .footer-socials { display: flex; gap: 16px; }
  .footer-socials a {
    width: 34px; height: 34px;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .footer-socials a:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.06); }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold); }

  /* ── 404 ── */
  .not-found {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 140px 20px;
    text-align: center;
  }
  .not-found .code {
    font-family: var(--serif);
    font-size: 120px; font-weight: 300; font-style: italic;
    color: var(--gold); line-height: 1;
    opacity: 0.4;
  }
  .not-found h2 { font-family: var(--serif); font-size: 32px; font-weight: 300; margin-top: 8px; }
  .not-found p { color: var(--muted); margin: 12px 0 32px; font-size: 14px; }
  .not-found a {
    padding: 12px 32px;
    border: 1px solid var(--gold);
    color: var(--gold);
    text-decoration: none;
    letter-spacing: 2px;
    font-size: 11px;
    text-transform: uppercase;
    transition: background 0.25s, color 0.25s;
  }
  .not-found a:hover { background: var(--gold); color: var(--ink); }

  /* ── PAGE TRANSITIONS ── */
  .page-enter { animation: fadeUp 0.35s cubic-bezier(0.4,0,0.2,1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const CATEGORIES = ['All Products', 'Men', 'Women', 'Kids'];

/* ─── ROOT COMPONENT ─────────────────────────────────── */
export default function App() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [scrolled, setScrolled] = useState(false);
  const [promoOpen, setPromoOpen] = useState(true);

  // Sync search input value with URL search param
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* INJECT GLOBAL STYLES */}
      <style>{CSS}</style>

      <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>

        {/* ── 1. PROMO BAR ── */}
        {promoOpen && (
          <div className="promo-bar">
            Summer Saison&ensp;·&ensp;Up to 70% on Luxury Brands&ensp;·&ensp;Free shipping above ₹2999&ensp;·&ensp;
            <strong>Shop the Edit →</strong>
            <button className="promo-close" onClick={() => setPromoOpen(false)} aria-label="Close">✕</button>
          </div>
        )}

        {/* ── 2. NAVIGATION ── */}
        <div className={`nav-wrap ${scrolled ? 'scrolled' : 'top'}`}>
          <div className="nav-inner">

            {/* LOGO */}
            <Link to="/" className="logo">
              <span className="logo-main">Genz</span>
              <span className="logo-sub">Premium&ensp;✦&ensp;Collection</span>
            </Link>

            <div className="nav-divider" />

            {/* SEARCH */}
            <div className="search-wrap">
              <input
                type="text"
                placeholder="Search brands, styles, seasonal drops…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const cat = searchParams.get('category');
                    navigate(`/?search=${encodeURIComponent(searchQuery)}${cat ? `&category=${cat}` : ''}`);
                  }
                }}
              />
              <span className="search-icon">⌕</span>
            </div>

            {/* ACTIONS */}
            <div className="nav-actions">
              {user?.isAdmin && (
                <Link to="/admin" className="nav-btn" style={{ border: '1px dashed var(--gold)', color: 'var(--gold)', padding: '6px 12px', marginRight: '8px' }}>
                  <span className="icon">🛡️</span>
                  Admin
                </Link>
              )}

              {user ? (
                <>
                  <span className="user-greeting">
                    Welcome, <strong>{user.name}</strong>
                  </span>
                  <button className="logout-btn" onClick={logout}>Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="nav-btn login-pill">Login</Link>
              )}

              <Link to="/orders" className="nav-btn">
                <span className="icon">📦</span>
                Orders
              </Link>

              <Link to="/cart" className="nav-btn">
                <span className="icon">
                  🛍
                  {count > 0 && <span className="cart-badge">{count}</span>}
                </span>
                Bag
              </Link>
            </div>
          </div>

          {/* ── 3. CATEGORY STRIP ── */}
          <div className="cat-strip">
            <nav className="cat-inner">
              {CATEGORIES.map(cat => {
                const paramVal = cat === 'All Products' ? '' : cat.toLowerCase();
                const active = (searchParams.get('category') || '') === paramVal;
                // Preserve search query if clicked category
                const searchQueryStr = searchParams.get('search');
                const linkTo = paramVal
                  ? `/?category=${paramVal}${searchQueryStr ? `&search=${searchQueryStr}` : ''}`
                  : (searchQueryStr ? `/?search=${searchQueryStr}` : '/');
                return (
                  <Link
                    key={cat}
                    to={linkTo}
                    className={`cat-link ${active ? 'active' : ''}`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ── 4. MAIN CONTENT ── */}
        <main className="page-content page-enter" key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="*" element={
              <div className="not-found">
                <div className="code">404</div>
                <h2>Page not found</h2>
                <p>The page you're looking for seems to have wandered off.</p>
                <Link to="/">Return to Home</Link>
              </div>
            } />
          </Routes>
        </main>

        {/* ── 5. FOOTER ── */}
        <footer className="footer">
          <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-brand">
              <Link to="/" className="logo" style={{ display: 'inline-flex' }}>
                <span className="logo-main">Zenith</span>
              </Link>
              <p>Curated luxury for the discerning. Discover the finest brands, exclusive collections, and timeless style — delivered to your door.</p>
            </div>

            {/* Links */}
            {[
              {
                title: 'Discover',
                links: ['New Arrivals', 'Best Sellers', 'Exclusive Brands', 'Seasonal Edit', 'Gift Guide']
              },
              {
                title: 'Help',
                links: ['Track Order', 'Shipping Info', 'Returns', 'Size Guide', 'FAQ']
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Press', 'Sustainability', 'Contact']
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Use', 'Cookie Settings', 'Accessibility']
              }
            ].map(col => (
              <div key={col.title} className="footer-col">
                <h5>{col.title}</h5>
                {col.links.map(l => <a key={l} href="#">{l}</a>)}
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p>© 2025 Zenith Internet Private Limited · Bengaluru, Karnataka, India</p>
            <div className="footer-socials">
              {['𝕏', 'f', 'in', '📷'].map((s, i) => (
                <a key={i} href="#" aria-label="Social">{s}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}

/* ─── ROUTE GUARDS ───────────────────────────────────── */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" />;
}