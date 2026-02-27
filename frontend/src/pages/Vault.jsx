import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import EmptyState from '../components/ui/EmptyState';
import { Upload, Trash2, Download, FileText, Image, File, Loader2, Lock } from 'lucide-react';
import { fmtSize, fmtDate } from '../utils/formatters';

const CATEGORIES = ['Insurance','Test Results','Prescription','Imaging','Legal','Other'];
const CAT_COLORS = { Insurance:'badge-teal','Test Results':'badge-amber',Prescription:'badge-green',Imaging:'badge-teal',Legal:'badge-amber',Other:'text-navy-400 bg-navy-700 text-xs font-medium px-2.5 py-1 rounded-full border border-navy-600' };

export default function Vault() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory]  = useState('Other');
  const [notes,    setNotes]      = useState('');
  const [filter,   setFilter]     = useState('');
  const fileRef = useRef();

  const load = async () => {
    try {
      const { data } = await api.get('/documents' + (filter ? `?category=${filter}` : ''));
      setDocs(data);
    } catch { toast.error('Failed to load documents'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    fd.append('notes', notes);
    try {
      await api.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Document encrypted & uploaded');
      setNotes(''); fileRef.current.value = '';
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/documents/${doc._id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: doc.mimeType }));
      const a = document.createElement('a'); a.href=url; a.download=doc.originalName; a.click();
      window.URL.revokeObjectURL(url);
    } catch { toast.error('Download failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document deleted');
      setDocs(d=>d.filter(x=>x._id!==id));
    } catch { toast.error('Delete failed'); }
  };

  const iconFor = (mime) => {
    if (mime?.startsWith('image/')) return Image;
    if (mime === 'application/pdf')  return FileText;
    return File;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="page-title mb-1 flex items-center gap-2">
            <Lock size={26} className="text-teal"/> Document Vault
          </h1>
          <p className="text-navy-400">AES-256 encrypted. Decrypted only on download. Never stored in plaintext.</p>
        </div>
      </div>

      {/* Upload */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-white mb-4">Upload New Document</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div><label className="label">Category</label><select className="input" value={category} onChange={e=>setCategory(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
          <div className="sm:col-span-2"><label className="label">Notes (optional)</label><input className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. 2024 annual blood panel"/></div>
        </div>
        <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-navy-600 rounded-xl cursor-pointer hover:border-teal transition-colors bg-navy-800/50 group">
          {uploading
            ? <Loader2 size={24} className="text-teal animate-spin"/>
            : <><Upload size={24} className="text-navy-500 group-hover:text-teal mb-2 transition-colors"/><span className="text-sm text-navy-400 group-hover:text-navy-300">Click to choose file</span><span className="text-xs text-navy-500 mt-1">PDF, JPEG, PNG, DOCX — max 10 MB</span></>
          }
          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"/>
        </label>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['', ...CATEGORIES].map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===c?'bg-teal text-white':'bg-navy-700 text-navy-400 hover:text-white'}`}>
            {c||'All'}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-navy-600 border-t-teal rounded-full animate-spin"/></div>
      ) : docs.length === 0 ? (
        <EmptyState icon={File} title="No documents" description="Upload your first medical file above to get started."/>
      ) : (
        <div className="space-y-3">
          {docs.map(doc=>{
            const Icon = iconFor(doc.mimeType);
            return (
              <div key={doc._id} className="card p-4 flex items-center gap-4 hover:border-navy-500 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-teal"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{doc.originalName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={CAT_COLORS[doc.category]||'badge-teal'}>{doc.category}</span>
                    <span className="text-navy-500 text-xs">{fmtSize(doc.sizeBytes)}</span>
                    <span className="text-navy-500 text-xs">{fmtDate(doc.createdAt)}</span>
                    {doc.notes && <span className="text-navy-400 text-xs truncate">{doc.notes}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={()=>handleDownload(doc)} className="btn-icon" title="Download"><Download size={15}/></button>
                  <button onClick={()=>handleDelete(doc._id)} className="btn-icon hover:text-crimson" title="Delete"><Trash2 size={15}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
