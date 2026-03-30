import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      // Demo: admin@streamvault.com → admin role; any other email → user role
      const isAdmin = form.email.toLowerCase() === 'admin@streamvault.com';
      login({
        name: form.email.split('@')[0],
        email: form.email,
        role: isAdmin ? 'admin' : 'user',
      });
      setLoading(false);
      navigate(isAdmin ? '/admin' : '/');
    }, 800);
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(139,92,246,0.2) 0%, transparent 50%)',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="text-white font-bold text-2xl">StreamVault</span>
          </Link>
          <h1 className="text-white text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-500 mt-1.5">Sign in to continue watching</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                className={`w-full bg-black/50 border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-blue-500'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-400 text-sm font-medium">Password</label>
                <a href="#" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                className={`w-full bg-black/50 border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-blue-500'
                }`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-amber-900/20 border border-amber-800/30 rounded-xl">
            <p className="text-amber-400 text-xs font-medium text-center">
              Demo admin: <span className="font-mono text-amber-300">admin@streamvault.com</span> / any password
            </p>
          </div>

          <p className="text-gray-500 text-sm text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
