import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { registerUser } from '../services/authService';

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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(59,130,246,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.2) 0%, transparent 50%)',
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
          <h1 className="text-white text-3xl font-bold">Create account</h1>
          <p className="text-gray-500 mt-1.5">Start streaming in seconds</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          {apiError && (
            <div className="mb-5 p-3 bg-red-900/20 border border-red-800/30 rounded-xl">
              <p className="text-red-400 text-sm text-center font-medium">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { field: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
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
                    errors[field] ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-blue-500'
                  }`}
                />
                {errors[field] && <p className="text-red-400 text-xs mt-1.5">{errors[field]}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
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
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
