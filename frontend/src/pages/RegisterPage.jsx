import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Eye, EyeOff, Check } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const pwChecks = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'Contains a number',     test: p => /\d/.test(p) },
  { label: 'Contains a letter',     test: p => /[a-zA-Z]/.test(p) },
];

export default function RegisterPage() {
  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created! Let\'s set up your vault.');
      navigate('/directive');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-teal/10 items-center justify-center mb-4">
            <ShieldCheck size={28} className="text-teal"/>
          </div>
          <h1 className="font-display text-3xl font-semibold text-white mb-1">Create your vault</h1>
          <p className="text-navy-400">Free · Private · Encrypted — always</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <input name="name" type="text" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="input" placeholder="Jane Smith" required/>
            </div>
            <div>
              <label className="label">Email address</label>
              <input name="email" type="email" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="you@example.com" required/>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pr-11" placeholder="Min. 8 characters" required/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-white">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {pwChecks.map(({ label, test }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${test(form.password) ? 'bg-teal' : 'bg-navy-600'}`}>
                        {test(form.password) && <Check size={9} className="text-white"/>}
                      </div>
                      <span className={`text-xs ${test(form.password) ? 'text-teal' : 'text-navy-500'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>
          <p className="text-center text-navy-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
