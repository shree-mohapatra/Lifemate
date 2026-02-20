import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import "../styles/Signin.css";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Invalid email or password');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        throw authError;
      }

      navigate('/dashboard', { replace: true });

    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <Link to="/"
      ><button className="backHome">← Back To Home</button></Link>
      <div className="signin-card">
        <h2 className="signin-title">Sign in to Lifemate</h2>

        {error && <div className="signin-error">{error}</div>}

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button className="signin-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="signin-footer">
          Don’t have an account?
          <Link to="/signup"> Sign up</Link>
        </p>
      </div>
    </div>
  );
}
