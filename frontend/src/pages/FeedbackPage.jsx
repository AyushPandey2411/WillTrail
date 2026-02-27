import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageSquare, Star, Send, Loader2, Bug, Lightbulb, Heart, Quote } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TYPES = [
  { value: 'general',     label: 'General',     icon: MessageSquare, desc: 'General feedback about your experience' },
  { value: 'bug',         label: 'Bug Report',  icon: Bug,           desc: 'Something isn\'t working correctly' },
  { value: 'feature',     label: 'Feature Idea',icon: Lightbulb,     desc: 'Suggest something new' },
  { value: 'testimonial', label: 'Testimonial', icon: Quote,         desc: 'Share your story publicly (with approval)' },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    type: 'general', rating: 5, subject: '', message: '',
    displayName: user?.name || '', displayRole: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) { toast.error('Please add a message'); return; }
    setLoading(true);
    try {
      await api.post('/feedback', form);
      setSubmitted(true);
      toast.success('Thank you! Your feedback was received.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="card p-10 max-w-md text-center animate-slide-up">
        <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-5">
          <Heart size={28} className="text-teal"/>
        </div>
        <h2 className="font-display text-2xl font-bold text-white mb-3">Thank you!</h2>
        <p className="text-navy-400 leading-relaxed">
          Your feedback helps us build a better product. We read every submission and use it to
          prioritise improvements.
        </p>
        {form.type === 'testimonial' && (
          <p className="mt-4 text-xs text-navy-500 bg-navy-800 rounded-lg px-3 py-2">
            Testimonials are reviewed before being published to our public pages.
          </p>
        )}
        <button onClick={() => { setSubmitted(false); setForm({ type:'general',rating:5,subject:'',message:'',displayName:user?.name||'',displayRole:'' }); }}
          className="btn-ghost mt-6 w-full">Submit Another</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-2">Share Your Feedback</h1>
        <p className="text-navy-400">Your input directly shapes WillTrail's roadmap. Every submission is read by the team.</p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Type selector */}
          <div>
            <label className="label">Feedback Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(({ value, label, icon: Icon, desc }) => (
                <button key={value} type="button"
                  onClick={() => setForm(f => ({...f, type: value}))}
                  className={`p-3 rounded-xl border text-left transition-all text-sm ${
                    form.type === value
                      ? 'border-teal bg-teal/10 text-white'
                      : 'border-navy-600 text-navy-400 hover:border-navy-500'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className={form.type === value ? 'text-teal' : ''}/>
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-xs opacity-70">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label className="label">Overall Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setForm(f => ({...f, rating: n}))}>
                  <Star size={28}
                    className={`transition-all ${n <= form.rating ? 'text-amber-light fill-amber-light scale-110' : 'text-navy-600'}`}/>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Subject</label>
            <input className="input" value={form.subject}
              onChange={e => setForm(f => ({...f, subject: e.target.value}))}
              placeholder="Brief summary of your feedback"/>
          </div>

          <div>
            <label className="label">Message <span className="text-crimson">*</span></label>
            <textarea className="input resize-none h-32" value={form.message}
              onChange={e => setForm(f => ({...f, message: e.target.value}))}
              placeholder="Tell us what's on your mind..." required/>
            <p className="text-navy-500 text-xs mt-1 text-right">{form.message.length}/2000</p>
          </div>

          {/* Testimonial-specific fields */}
          {form.type === 'testimonial' && (
            <div className="bg-navy-800 rounded-xl p-4 space-y-3 border border-navy-600">
              <p className="text-sm text-navy-400 font-medium">
                Your story may be featured publicly (with your approval) on our About page.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Display Name</label>
                  <input className="input" value={form.displayName}
                    onChange={e => setForm(f => ({...f, displayName: e.target.value}))}
                    placeholder="Jane S."/>
                </div>
                <div>
                  <label className="label">Your Role / Title</label>
                  <input className="input" value={form.displayRole}
                    onChange={e => setForm(f => ({...f, displayRole: e.target.value}))}
                    placeholder="Nurse, Caregiver, Patient..."/>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>}
            {loading ? 'Sending...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
