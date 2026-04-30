import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { registerUser } from '../services/authService';
import PlaynixLogo from '../components/PlaynixLogo';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.confirm && form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    try {
      const data = await registerUser({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });

      const token = data.token || data.jwt || data.accessToken;
      const user = data.user || {
        id: data.id,
        name: data.name || form.name,
        email: data.email || form.email,
        role: data.role || 'user',
      };

      login(user, token);
      navigate('/');
    } catch (err) {
      setApiError(
        err.friendlyMessage || err.response?.data?.message || 'Registration failed. Please try again.',
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
          <h1 className="text-white text-3xl font-bold">Create account</h1>
          <p className="text-gray-500 mt-1.5">Start streaming in seconds</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#101014]/86 p-8 shadow-2xl backdrop-blur">
          {apiError && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-800/30 rounded-xl">
              <p className="text-red-400 text-sm text-center font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
              { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Confirm password' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label htmlFor={`signup-${field}`} className="block text-gray-400 text-sm font-medium mb-2">{label}</label>
                <input
                  id={`signup-${field}`}
                  type={type}
                  value={form[field]}
                  onChange={handleChange(field)}
                  placeholder={placeholder}
                  className={`w-full bg-black/50 border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                    errors[field] ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-fuchsia-400'
                  }`}
                />
                {errors[field] && <p className="text-red-400 text-xs mt-1.5">{errors[field]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="playnix-button-primary mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-fuchsia-300 hover:text-white font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
