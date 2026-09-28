import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
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
        maxWidth: '450px',
        backgroundColor: 'var(--ink-2)',
        border: '1px solid var(--border)',
        padding: '50px 40px',
        borderRadius: '4px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '300', fontFamily: 'var(--serif)', marginBottom: '10px', color: '#fff', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '35px', fontSize: '14px' }}>
          Join us for a curated shopping experience.
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' }}>Full Name</label>
            <input
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              placeholder="email@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', marginBottom: '8px', display: 'block', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              minLength={6}
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
            {loading ? 'Creating Account...' : 'Join Now'}
          </button>
        </form>

        <p style={{ marginTop: '30px', fontSize: '13px', color: 'var(--muted)' }}>
          Already a member? {' '}
          <Link to="/login" style={{ color: 'var(--gold)', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid var(--gold)' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}