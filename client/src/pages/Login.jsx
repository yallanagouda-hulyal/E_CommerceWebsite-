import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) navigate('/admin');
      else navigate('/');
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      if (loggedUser?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--ink-2)',
        border: '1px solid var(--border)',
        padding: '40px',
        borderRadius: '4px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '300', fontFamily: 'var(--serif)', letterSpacing: '2.5px', marginBottom: '10px', color: '#fff', textTransform: 'uppercase' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '30px', fontSize: '13px', letterSpacing: '0.5px' }}>
          Please enter your credentials to sign in
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--muted)' }}>
          Don't have an account? {' '}
          <Link to="/register" style={{ color: 'var(--gold)', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid var(--gold)' }}>
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}