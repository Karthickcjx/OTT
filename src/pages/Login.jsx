import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { loginUser } from '../services/authService';
import PlaynixLogo from '../components/PlaynixLogo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email,
        password: form.password,
      });

      // Backend returns { token, user } or { token, ...userFields }
      const token = data.token || data.jwt || data.accessToken;
      const user = data.user || {
        id: data.id,
        name: data.name || data.username || form.email.split('@')[0],
        email: data.email || form.email,
        role: data.role || 'user',
      };

      login(user, token);
      navigate('/');
    } catch (err) {
      setApiError(
        err.friendlyMessage || err.response?.data?.message || 'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
    setApiError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-4">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.12),transparent_34%,rgba(251,146,60,0.1))]" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <PlaynixLogo size="md" />
          </Link>
          <h1 className="text-white text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-500 mt-1.5">Sign in to continue watching</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#101014]/86 p-8 shadow-2xl backdrop-blur">
          {apiError && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-800/30 rounded-xl">
              <p className="text-red-400 text-sm text-center font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-gray-400 text-sm font-medium mb-2">Email</label>
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className={`w-full bg-black/50 border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-fuchsia-400'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="text-gray-400 text-sm font-medium">Password</label>
                <a href="#" className="text-fuchsia-300 hover:text-white text-xs transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Password"
                className={`w-full bg-black/50 border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-fuchsia-400'
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="playnix-button-primary flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-fuchsia-300 hover:text-white font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
