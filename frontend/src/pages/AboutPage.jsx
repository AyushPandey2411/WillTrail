import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Target, Eye, Users, Star, ArrowRight,
         Zap, Globe, Award, MessageSquare } from 'lucide-react';
import { useCountUp } from '../hooks/useCountUp';
import api from '../api/axios';

const team = [
  {
    name:    'Dr. Priya Nair',
    role:    'Co-Founder & Medical Director',
    bio:     'Former emergency medicine physician with 14 years in trauma care. Witnessed first-hand the chaos that follows when medical wishes are unknown.',
    initials: 'PN',
    accent:  'teal',
  },
  {
    name:    'Marcus Webb',
    role:    'Co-Founder & CTO',
    bio:     'Full-stack engineer and patient safety advocate. Built WillTrail after his father\'s ICU stay revealed a critical gap in care communication.',
    initials: 'MW',
    accent:  'amber',
  },
  {
    name:    'Aisha Okonkwo',
    role:    'Head of Product & UX',
    bio:     'Healthcare UX specialist who has redesigned patient intake flows for hospitals across 6 countries. Obsessed with reducing friction in critical moments.',
    initials: 'AO',
    accent:  'emerald',
  },
  {
    name:    'Dr. Leo Tanaka',
    role:    'Clinical Advisor',
    bio:     'Palliative care specialist and end-of-life ethics committee member. Ensures WillTrail\'s directive framework meets clinical and legal standards.',
    initials: 'LT',
    accent:  'teal',
  },
];

const timeline = [
  { year: '2021', title: 'The Problem Identified', desc: 'After two separate ICU situations with unclear patient wishes in Marcus\'s and Priya\'s lives, the idea for WillTrail was born.' },
  { year: '2022', title: 'First Prototype', desc: 'Built the first version in 3 months. Tested with 50 families and 12 first responders who validated the QR card concept.' },
  { year: '2023', title: 'Hospital Partnerships', desc: 'Partnered with 8 hospitals for pilot programs. 340+ healthcare facilities now recommend WillTrail to their patients.' },
  { year: '2024', title: 'Scaling Impact', desc: 'Over 12,000 vaults created. Expanding to support multilingual directives and integration with electronic health records.' },
];

const values = [
  { icon: ShieldCheck, title: 'Privacy First',      desc: 'AES-256 encryption. Your data is never sold, never profiled, never monetised. Period.' },
  { icon: Heart,       title: 'Human-Centred',      desc: 'Every design decision is made by asking: how does this serve someone in a medical crisis?' },
  { icon: Globe,       title: 'Universally Accessible', desc: 'No technical knowledge required. If you can fill a form, you can protect your family.' },
  { icon: Award,       title: 'Clinically Grounded', desc: 'Every directive field is informed by practising clinicians and healthcare ethicists.' },
];

function StatNumber({ end, suffix = '', label }) {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="text-center">
      <p className="stat-number mb-1">{count.toLocaleString()}{suffix}</p>
      <p className="text-navy-400 text-sm">{label}</p>
    </div>
  );
}

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/feedback/testimonials').then(r => setTestimonials(r.data)).catch(() => {});
  }, []);

  const accent = {
    teal:    'bg-teal/10 text-teal border-teal/20',
    amber:   'bg-amber/10 text-amber-light border-amber/20',
    emerald: 'bg-emerald/10 text-emerald-light border-emerald/20',
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/30 text-teal text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Heart size={13}/> Our Mission
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
          No family should face<br/>
          <span className="text-teal">an emergency without answers.</span>
        </h1>
        <p className="text-navy-300 text-lg leading-relaxed max-w-2xl mx-auto">
          WillTrail exists because medical emergencies don't announce themselves.
          We build tools that ensure your wishes are known, your family is protected,
          and first responders have what they need — instantly.
        </p>
      </section>

      {/* ── Mission & Vision ────────────────────────────────────────────── */}
      <section className="border-y border-navy-600 bg-navy-700/20 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center mb-5">
              <Target size={24} className="text-teal"/>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-navy-300 leading-relaxed">
              To make advance care planning accessible, secure, and immediate for every person —
              regardless of technical ability, age, or health literacy. We believe that having your
              medical wishes documented and accessible is a fundamental act of care for the people
              you love.
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center mb-5">
              <Eye size={24} className="text-teal"/>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">Our Vision</h2>
            <p className="text-navy-300 leading-relaxed">
              A world where no medical professional has to make a life-altering decision without
              knowing the patient's wishes. Where every wallet contains an emergency card.
              Where advance directives are as routine as having a will — and ten times easier to create.
            </p>
          </div>
        </div>
      </section>

      {/* ── Impact Numbers ──────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-12">Our Impact So Far</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <StatNumber end={12400} suffix="+"  label="Vaults Created"     />
            <StatNumber end={340}   suffix="+"  label="Hospital Partners"  />
            <StatNumber end={4800}  suffix="+"  label="QR Cards Active"    />
            <StatNumber end={23}    suffix=""   label="Countries Reached"  />
          </div>
          <div className="mt-12 card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="font-display text-2xl sm:text-3xl font-bold text-white max-w-2xl leading-snug">
              "Since recommending WillTrail to our ICU families, we've seen a{' '}
              <span className="text-teal">47% reduction</span> in family conflict around end-of-life decisions."
            </p>
            <p className="text-navy-400 mt-4 text-sm">— Dr. Rachel Osei, Palliative Care Unit, St. Luke's Medical Center</p>
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────── */}
      <section className="border-t border-navy-600 bg-navy-700/20 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-teal"/>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                  <p className="text-navy-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-3">The Team Behind WillTrail</h2>
            <p className="text-navy-400 max-w-lg mx-auto">
              A multidisciplinary team of clinicians, engineers, and designers united by a shared mission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card p-6 flex gap-4 hover:border-navy-500 transition-colors">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 text-lg font-bold font-display ${accent[member.accent]}`}>
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{member.name}</h3>
                  <p className="text-teal text-xs font-medium mb-2">{member.role}</p>
                  <p className="text-navy-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story Timeline ──────────────────────────────────────────────── */}
      <section className="border-t border-navy-600 bg-navy-700/20 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white text-center mb-12">Our Story</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-navy-600" />
            <div className="space-y-8">
              {timeline.map(({ year, title, desc }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="font-mono text-teal font-bold text-sm">{year}</span>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-teal border-2 border-navy-800 mt-1 flex-shrink-0 relative z-10" />
                  <div className="card p-4 flex-1">
                    <h3 className="font-semibold text-white mb-1">{title}</h3>
                    <p className="text-navy-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-3xl font-bold text-white text-center mb-12">Impact Stories</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t._id} className="card p-6 flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} className="text-amber-light fill-amber-light"/>
                    ))}
                  </div>
                  <p className="text-navy-200 text-sm leading-relaxed italic flex-1">"{t.message}"</p>
                  <div className="border-t border-navy-600 pt-3 mt-4">
                    <p className="text-white text-sm font-medium">{t.displayName}</p>
                    <p className="text-navy-400 text-xs">{t.displayRole}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-navy-600 bg-navy-700/20 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <MessageSquare size={32} className="text-teal mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white mb-3">Join Our Mission</h2>
          <p className="text-navy-400 mb-6">
            Share your story, suggest improvements, or partner with us.
            Every voice helps us build a better product.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary flex items-center gap-2 justify-center px-8 py-3">
              Create Your Vault <ArrowRight size={15}/>
            </Link>
            <Link to="/feedback" className="btn-ghost px-8 py-3">Share Feedback</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
