import { Link } from 'react-router-dom';
import { ShieldCheck, QrCode, FileDown, Lock, HeartPulse, Users, ArrowRight, Star } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const features = [
  { icon: Lock,        title: 'AES-256 Encrypted Vault',    desc: 'Every document encrypted before storage. Only you hold the key.' },
  { icon: QrCode,      title: 'Instant QR Emergency Card',  desc: 'First responders scan once — see only what you approved.' },
  { icon: FileDown,    title: 'One-Click PDF Directive',     desc: 'Professionally formatted advance directive, ready to print.' },
  { icon: HeartPulse,  title: 'Guided Directive Builder',   desc: '6-step form covering every critical care preference.' },
  { icon: Users,       title: 'Emergency Contact Network',  desc: 'Multiple contacts with relationship types and priorities.' },
  { icon: ShieldCheck, title: 'Privacy by Design',          desc: 'Granular control over what first responders see.' },
];

function StatNumber({ end, suffix = '', label }) {
  const { count, ref } = useCountUp(end, 2200);
  return (
    <div ref={ref} className="text-center">
      <p className="stat-number">{count.toLocaleString()}{suffix}</p>
      <p className="text-navy-400 text-sm mt-1">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/feedback/testimonials').then(r => setTestimonials(r.data.slice(0,3))).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-medium px-4 py-1.5 rounded-full mb-8 animate-slide-up">
          <ShieldCheck size={14}/> Trusted Emergency Medical Vault
        </div>
        <h1 className="hero-title mb-6 animate-slide-up stagger-1 opacity-0-init">
          Your medical wishes,<br/>
          <span className="text-teal">protected & always</span><br/>
          <span className="text-teal-light">accessible.</span>
        </h1>
        <p className="text-navy-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up stagger-2 opacity-0-init">
          WillTrail gives you a secure, centralised place to store critical medical information,
          generate an emergency QR card for first responders, and download a legal-quality
          advance directive PDF — all in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-slide-up stagger-3 opacity-0-init">
          <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center">
            Create Your Vault <ArrowRight size={16}/>
          </Link>
          <Link to="/about" className="btn-ghost text-base px-8 py-3">Learn Our Mission</Link>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="border-y border-navy-600 bg-navy-700/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatNumber end={12400} suffix="+" label="Vaults Created" />
            <StatNumber end={98}    suffix="%" label="User Satisfaction" />
            <StatNumber end={340}   suffix="+" label="Hospitals Reached" />
            <StatNumber end={4800}  suffix="+" label="QR Cards Active" />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Built for moments that matter
          </h2>
          <p className="text-navy-400 max-w-xl mx-auto">
            Every feature was designed around one scenario: someone scanning your QR code in an emergency.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div key={title}
              className={`card p-6 hover:border-teal/40 hover:-translate-y-0.5 transition-all duration-200
                          animate-slide-up opacity-0-init stagger-${(i % 6) + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-teal"/>
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-navy-600 bg-navy-700/20 py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
              What people are saying
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t._id} className="card p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-light fill-amber-light"/>
                    ))}
                  </div>
                  <p className="text-navy-200 text-sm leading-relaxed mb-4 italic">"{t.message}"</p>
                  <div className="border-t border-navy-600 pt-3">
                    <p className="text-white text-sm font-medium">{t.displayName}</p>
                    <p className="text-navy-400 text-xs">{t.displayRole}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/about" className="text-teal text-sm hover:underline flex items-center gap-1 justify-center">
                Read more stories <ArrowRight size={14}/>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent pointer-events-none" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Don't wait for an emergency.
          </h2>
          <p className="text-navy-400 mb-8 max-w-md mx-auto">
            Set up your complete vault in under 10 minutes. Your family deserves to know your wishes.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2">
            Create Your Free Vault <ArrowRight size={16}/>
          </Link>
        </div>
      </section>
    </div>
  );
}
