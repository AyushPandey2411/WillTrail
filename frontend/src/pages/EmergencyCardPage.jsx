import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { FullPageSpinner } from '../components/ui/LoadingSpinner';
import { ShieldCheck, Phone, AlertTriangle, Heart, Droplets, User2, Stethoscope } from 'lucide-react';

const Section = ({ icon: Icon, color, title, children }) => (
  <div className="card p-5">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={15} className={color}/>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-navy-400">{title}</h3>
    </div>
    {children}
  </div>
);

export default function EmergencyCardPage() {
  const { token } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    api.get(`/directive/emergency-card/${token}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.message || 'This card is invalid or expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <FullPageSpinner/>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-8 max-w-sm text-center">
        <AlertTriangle size={36} className="text-crimson mx-auto mb-3"/>
        <h1 className="font-display text-xl font-semibold text-white mb-2">Card Not Found</h1>
        <p className="text-navy-400 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-800 px-4 py-8">
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-crimson flex items-center justify-center">
            <ShieldCheck size={20} className="text-white"/>
          </div>
          <div>
            <p className="text-crimson font-semibold text-sm uppercase tracking-wider">Emergency Medical Card</p>
            <p className="text-white font-display text-xl font-semibold">{data.name || 'Unknown Patient'}</p>
          </div>
        </div>
        <div className="h-px bg-crimson/30 mb-6"/>

        <div className="space-y-3">
          {data.bloodType && (
            <Section icon={Droplets} color="text-crimson" title="Blood Type">
              <p className="text-white text-3xl font-display font-bold">{data.bloodType}</p>
            </Section>
          )}
          {data.allergies?.length > 0 && (
            <Section icon={AlertTriangle} color="text-yellow-400" title="Known Allergies">
              <div className="flex flex-wrap gap-2">
                {data.allergies.map((a,i)=>(
                  <span key={i} className="bg-yellow-900/30 border border-yellow-800/50 text-yellow-300 text-sm px-3 py-1 rounded-lg font-medium">{a}</span>
                ))}
              </div>
            </Section>
          )}
          {data.cprPreference && (
            <Section icon={Heart} color="text-crimson" title="CPR / Resuscitation">
              <p className="text-white font-semibold">{data.cprPreference}</p>
            </Section>
          )}
          {data.conditions?.length > 0 && (
            <Section icon={Stethoscope} color="text-teal-light" title="Medical Conditions">
              <div className="flex flex-wrap gap-2">{data.conditions.map((c,i)=><span key={i} className="tag">{c}</span>)}</div>
            </Section>
          )}
          {data.medications?.length > 0 && (
            <Section icon={Stethoscope} color="text-teal-light" title="Current Medications">
              <div className="flex flex-wrap gap-2">{data.medications.map((m,i)=><span key={i} className="tag">{m}</span>)}</div>
            </Section>
          )}
          {data.emergencyContacts?.length > 0 && (
            <Section icon={Phone} color="text-blue-400" title="Emergency Contacts">
              <div className="space-y-2">
                {data.emergencyContacts.map((c,i)=>(
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{c.name} <span className="text-navy-400 font-normal">— {c.relationship}</span></p>
                    <a href={`tel:${c.phone}`} className="text-teal text-sm font-mono hover:underline">{c.phone}</a>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {data.healthcareAgent?.name && (
            <Section icon={User2} color="text-purple-400" title="Healthcare Agent">
              <div className="flex items-center justify-between">
                <p className="text-white text-sm font-medium">{data.healthcareAgent.name} <span className="text-navy-400 font-normal">— {data.healthcareAgent.relationship}</span></p>
                <a href={`tel:${data.healthcareAgent.phone}`} className="text-teal text-sm font-mono hover:underline">{data.healthcareAgent.phone}</a>
              </div>
            </Section>
          )}
        </div>
        <p className="text-center text-navy-600 text-xs mt-8">Powered by WillTrail · Emergency Medical Vault</p>
      </div>
    </div>
  );
}
