import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { User, Phone, Stethoscope, HeartPulse, ShieldCheck, Eye,
         Plus, Trash2, ChevronLeft, ChevronRight, Save, Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id:0, label:'Personal',    icon: User },
  { id:1, label:'Contacts',    icon: Phone },
  { id:2, label:'Medical',     icon: Stethoscope },
  { id:3, label:'Care Wishes', icon: HeartPulse },
  { id:4, label:'Agent',       icon: ShieldCheck },
  { id:5, label:'Privacy',     icon: Eye },
];

const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'];
const CPR_OPTIONS  = ['Full resuscitation','DNR','Comfort care only'];
const VENT_OPTIONS = ['Yes','No','Limited trial'];

const emptyContact = () => ({ name:'',relationship:'',phone:'',email:'',isPrimary:false });
const defaultPF = { showBloodType:true,showAllergies:true,showConditions:false,showMedications:false,showEmergencyContacts:true,showCPRPreference:true,showHealthcareAgent:true,showPhysician:false };

export default function DirectiveForm() {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const [personalInfo, setPersonalInfo] = useState({ fullName:'',dateOfBirth:'',bloodType:'',primaryLanguage:'' });
  const [contacts,     setContacts]     = useState([emptyContact()]);
  const [medicalInfo,  setMedicalInfo]  = useState({ conditions:[],medications:[],allergies:[],physician:{name:'',phone:'',clinic:''} });
  const [carePrefs,    setCarePrefs]    = useState({ cprPreference:'',mechanicalVentilation:'',artificialNutrition:'',organDonation:false,additionalWishes:'' });
  const [agent,        setAgent]        = useState({ name:'',relationship:'',phone:'',email:'' });
  const [publicFields, setPublicFields] = useState(defaultPF);
  const [newTag,       setNewTag]       = useState({ conditions:'',medications:'',allergies:'' });

  useEffect(() => {
    api.get('/directive').then(({ data: d }) => {
      if (d.personalInfo) setPersonalInfo({ fullName:d.personalInfo.fullName||'', dateOfBirth:d.personalInfo.dateOfBirth?d.personalInfo.dateOfBirth.split('T')[0]:'', bloodType:d.personalInfo.bloodType||'', primaryLanguage:d.personalInfo.primaryLanguage||'' });
      if (d.emergencyContacts?.length) setContacts(d.emergencyContacts);
      if (d.medicalInfo) setMedicalInfo({ conditions:d.medicalInfo.conditions||[], medications:d.medicalInfo.medications||[], allergies:d.medicalInfo.allergies||[], physician:d.medicalInfo.physician||{name:'',phone:'',clinic:''} });
      if (d.carePreferences) setCarePrefs({...d.carePreferences});
      if (d.healthcareAgent) setAgent({...d.healthcareAgent});
      if (d.publicFields)    setPublicFields({...defaultPF,...d.publicFields});
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const addTag = (field) => {
    const val = newTag[field].trim(); if (!val) return;
    setMedicalInfo(p=>({...p,[field]:[...p[field],val]}));
    setNewTag(p=>({...p,[field]:''}));
  };
  const removeTag = (field,idx) => setMedicalInfo(p=>({...p,[field]:p[field].filter((_,i)=>i!==idx)}));
  const addContact    = () => setContacts(c=>[...c,emptyContact()]);
  const removeContact = (i) => setContacts(c=>c.filter((_,idx)=>idx!==i));
  const updateContact = (i,k,v) => setContacts(c=>c.map((ct,idx)=>idx===i?{...ct,[k]:v}:ct));

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await api.put('/directive', { personalInfo, emergencyContacts:contacts.filter(c=>c.name&&c.phone), medicalInfo, carePreferences:carePrefs, healthcareAgent:agent, publicFields });
      setSaved(true);
      toast.success('Directive saved!');
      setTimeout(()=>setSaved(false),3000);
    } catch(err) { toast.error(err.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-navy-600 border-t-teal rounded-full animate-spin"/></div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">Advance Directive</h1>
        <p className="text-navy-400">Your information is encrypted and never shared without your permission.</p>
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={()=>setStep(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${step===id ? 'bg-teal text-white' : 'text-navy-400 hover:text-white hover:bg-navy-700'}`}>
            <Icon size={13}/>{label}
          </button>
        ))}
      </div>

      <div className="card p-6 sm:p-8 min-h-[380px]">

        {step===0 && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-semibold text-white text-lg">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2"><label className="label">Full Legal Name</label><input className="input" value={personalInfo.fullName} onChange={e=>setPersonalInfo(p=>({...p,fullName:e.target.value}))} placeholder="Jane Smith"/></div>
              <div><label className="label">Date of Birth</label><input className="input" type="date" value={personalInfo.dateOfBirth} onChange={e=>setPersonalInfo(p=>({...p,dateOfBirth:e.target.value}))}/></div>
              <div><label className="label">Blood Type</label><select className="input" value={personalInfo.bloodType} onChange={e=>setPersonalInfo(p=>({...p,bloodType:e.target.value}))}><option value="">Select...</option>{BLOOD_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label className="label">Primary Language</label><input className="input" value={personalInfo.primaryLanguage} onChange={e=>setPersonalInfo(p=>({...p,primaryLanguage:e.target.value}))} placeholder="English"/></div>
            </div>
          </div>
        )}

        {step===1 && (
          <div className="space-y-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white text-lg">Emergency Contacts</h2>
              <button onClick={addContact} className="flex items-center gap-1 text-teal text-sm hover:underline"><Plus size={14}/>Add</button>
            </div>
            {contacts.map((c,i)=>(
              <div key={i} className="bg-navy-800 border border-navy-600 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-navy-300">Contact {i+1}</span>
                  {contacts.length>1 && <button onClick={()=>removeContact(i)} className="text-crimson"><Trash2 size={14}/></button>}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="label">Name</label><input className="input" value={c.name} onChange={e=>updateContact(i,'name',e.target.value)} placeholder="John Smith"/></div>
                  <div><label className="label">Relationship</label><input className="input" value={c.relationship} onChange={e=>updateContact(i,'relationship',e.target.value)} placeholder="Spouse"/></div>
                  <div><label className="label">Phone</label><input className="input" value={c.phone} onChange={e=>updateContact(i,'phone',e.target.value)} placeholder="+1 555 000 0000"/></div>
                  <div><label className="label">Email</label><input className="input" value={c.email} onChange={e=>updateContact(i,'email',e.target.value)} placeholder="john@email.com"/></div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-teal" checked={c.isPrimary} onChange={e=>updateContact(i,'isPrimary',e.target.checked)}/><span className="text-sm text-navy-300">Primary contact</span></label>
              </div>
            ))}
          </div>
        )}

        {step===2 && (
          <div className="space-y-6 animate-slide-up">
            <h2 className="font-semibold text-white text-lg">Medical Information</h2>
            {['allergies','conditions','medications'].map(field=>(
              <div key={field}>
                <label className="label">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {medicalInfo[field].map((t,i)=>(
                    <span key={i} className="tag">{t}<button onClick={()=>removeTag(field,i)} className="text-navy-400 hover:text-crimson ml-1"><Trash2 size={10}/></button></span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="input" value={newTag[field]} onChange={e=>setNewTag(p=>({...p,[field]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag(field))} placeholder={`Type and press Enter`}/>
                  <button onClick={()=>addTag(field)} className="btn-ghost px-3 flex-shrink-0"><Plus size={16}/></button>
                </div>
              </div>
            ))}
            <div>
              <h3 className="font-medium text-white text-sm mb-3">Primary Physician</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><label className="label">Name</label><input className="input" value={medicalInfo.physician.name} onChange={e=>setMedicalInfo(p=>({...p,physician:{...p.physician,name:e.target.value}}))} placeholder="Dr. Lee"/></div>
                <div><label className="label">Phone</label><input className="input" value={medicalInfo.physician.phone} onChange={e=>setMedicalInfo(p=>({...p,physician:{...p.physician,phone:e.target.value}}))} placeholder="+1 555..."/></div>
                <div><label className="label">Clinic</label><input className="input" value={medicalInfo.physician.clinic} onChange={e=>setMedicalInfo(p=>({...p,physician:{...p.physician,clinic:e.target.value}}))} placeholder="City Medical"/></div>
              </div>
            </div>
          </div>
        )}

        {step===3 && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-semibold text-white text-lg">Care Preferences</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[['CPR Preference','cprPreference',CPR_OPTIONS],['Mechanical Ventilation','mechanicalVentilation',VENT_OPTIONS],['Artificial Nutrition','artificialNutrition',VENT_OPTIONS]].map(([lbl,key,opts])=>(
                <div key={key}><label className="label">{lbl}</label><select className="input" value={carePrefs[key]} onChange={e=>setCarePrefs(p=>({...p,[key]:e.target.value}))}><option value="">Select...</option>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
              ))}
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-navy-800 rounded-xl hover:bg-navy-700 transition-colors">
              <input type="checkbox" className="accent-teal w-4 h-4" checked={carePrefs.organDonation} onChange={e=>setCarePrefs(p=>({...p,organDonation:e.target.checked}))}/>
              <div><span className="text-white text-sm font-medium">I wish to be an organ donor</span><p className="text-navy-400 text-xs">Your organs may be donated to save lives</p></div>
            </label>
            <div><label className="label">Additional Wishes</label><textarea className="input resize-none h-28" value={carePrefs.additionalWishes} onChange={e=>setCarePrefs(p=>({...p,additionalWishes:e.target.value}))} placeholder="Cultural/religious preferences, additional care wishes..."/></div>
          </div>
        )}

        {step===4 && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="font-semibold text-white text-lg">Designated Healthcare Agent</h2>
            <p className="text-navy-400 text-sm">This person makes medical decisions on your behalf if you are unable to do so.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">Agent Name</label><input className="input" value={agent.name} onChange={e=>setAgent(a=>({...a,name:e.target.value}))} placeholder="Full name"/></div>
              <div><label className="label">Relationship</label><input className="input" value={agent.relationship} onChange={e=>setAgent(a=>({...a,relationship:e.target.value}))} placeholder="Spouse, sibling..."/></div>
              <div><label className="label">Phone</label><input className="input" value={agent.phone} onChange={e=>setAgent(a=>({...a,phone:e.target.value}))} placeholder="+1 555 000 0000"/></div>
              <div><label className="label">Email</label><input className="input" value={agent.email} onChange={e=>setAgent(a=>({...a,email:e.target.value}))} placeholder="agent@email.com"/></div>
            </div>
          </div>
        )}

        {step===5 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="font-semibold text-white text-lg">Emergency Card Privacy</h2>
            <p className="text-navy-400 text-sm">Choose what first responders see when they scan your QR code.</p>
            <div className="space-y-2">
              {[['showBloodType','Blood Type'],['showAllergies','Known Allergies'],['showEmergencyContacts','Emergency Contacts'],['showCPRPreference','CPR Preference'],['showHealthcareAgent','Healthcare Agent'],['showConditions','Medical Conditions'],['showMedications','Current Medications'],['showPhysician','Physician Contact']].map(([key,label])=>(
                <label key={key} className="flex items-center justify-between p-3 bg-navy-800 rounded-xl cursor-pointer hover:bg-navy-700 transition-colors">
                  <span className="text-sm text-navy-200">{label}</span>
                  <input type="checkbox" className="accent-teal w-4 h-4" checked={!!publicFields[key]} onChange={e=>setPublicFields(p=>({...p,[key]:e.target.checked}))}/>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} className="btn-ghost flex items-center gap-1.5 disabled:opacity-30">
          <ChevronLeft size={16}/>Previous
        </button>
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving}
            className={`btn-primary flex items-center gap-1.5 ${saved ? 'bg-emerald' : ''}`}>
            {saving ? <Loader2 size={15} className="animate-spin"/> : saved ? <CheckCircle2 size={15}/> : <Save size={15}/>}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
          {step<STEPS.length-1 && (
            <button onClick={()=>setStep(s=>s+1)} className="btn-primary flex items-center gap-1.5">
              Next<ChevronRight size={16}/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
