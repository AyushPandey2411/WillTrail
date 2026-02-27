import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FileText, Archive, QrCode, ChevronRight, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [directive, setDirective] = useState(null);
  const [docCount,  setDocCount]  = useState(0);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([api.get('/directive'), api.get('/documents')])
      .then(([d, docs]) => { setDirective(d.data); setDocCount(docs.data.length); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const steps = [
    { label: 'Personal Information',      done: !!directive?.personalInfo?.fullName },
    { label: 'Emergency Contacts',        done: (directive?.emergencyContacts?.length || 0) > 0 },
    { label: 'Medical Info & Allergies',  done: directive?.completionSteps?.medicalInfo || false },
    { label: 'Care Preferences',          done: !!directive?.carePreferences?.cprPreference },
    { label: 'Healthcare Agent',          done: !!directive?.healthcareAgent?.name },
    { label: 'Uploaded Documents',        done: docCount > 0 },
  ];

  const completed = steps.filter(s => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  const cards = [
    { to: '/directive', icon: FileText,       label: 'Advance Directive', desc: 'Fill in your medical care preferences', color: 'teal' },
    { to: '/vault',     icon: Archive,         label: 'Document Vault',    desc: `${docCount} encrypted file${docCount !== 1 ? 's' : ''} stored`, color: 'teal' },
    { to: '/qr-card',   icon: QrCode,          label: 'Emergency QR Card', desc: 'Generate & share your emergency card', color: 'teal' },
    { to: '/feedback',  icon: MessageSquare,   label: 'Share Feedback',    desc: 'Help us improve WillTrail', color: 'amber' },
  ];

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-navy-600 border-t-teal rounded-full animate-spin"/></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="page-title mb-1">Welcome back, {user?.name?.split(' ')[0]}.</h1>
        <p className="text-navy-400">Your vault is private, encrypted, and always up to date.</p>
      </div>

      {/* Completion tracker */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-white">Profile Completion</h2>
          <span className={`font-mono font-bold text-lg ${pct === 100 ? 'text-emerald-light' : 'text-teal'}`}>{pct}%</span>
        </div>
        <p className="text-navy-400 text-xs mb-4">{completed} of {steps.length} sections complete</p>
        <div className="w-full h-2 bg-navy-600 rounded-full mb-6 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-emerald' : 'bg-teal'}`} style={{ width: `${pct}%` }}/>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {steps.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {done
                ? <CheckCircle2 size={15} className="text-emerald-light flex-shrink-0"/>
                : <AlertCircle  size={15} className="text-navy-500 flex-shrink-0"/>}
              <span className={done ? 'text-navy-200' : 'text-navy-500'}>{label}</span>
            </div>
          ))}
        </div>
        {pct < 100 && (
          <Link to="/directive"
            className="mt-5 w-full btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
            Continue Setup <ChevronRight size={15}/>
          </Link>
        )}
      </div>

      {/* Quick nav cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ to, icon: Icon, label, desc, color }) => {
          const colors = { teal: 'bg-teal/10 text-teal', amber: 'bg-amber/10 text-amber-light' };
          return (
            <Link key={to} to={to}
              className="card p-5 flex flex-col gap-3 hover:border-navy-500 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                <Icon size={19}/>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-0.5">{label}</h3>
                <p className="text-navy-400 text-xs">{desc}</p>
              </div>
              <ChevronRight size={14} className="text-navy-600 group-hover:text-teal mt-auto self-end transition-colors"/>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
