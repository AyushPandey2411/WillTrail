import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { QrCode, Copy, RefreshCw, FileDown, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import { fmtDate } from '../utils/formatters';

export default function QRCardPage() {
  const [qrData,  setQrData]  = useState(null);
  const [dlLoad,  setDlLoad]  = useState(false);
  const [qrLoad,  setQrLoad]  = useState(false);

  const generateQR = async () => {
    setQrLoad(true);
    try {
      const { data } = await api.post('/directive/generate-qr');
      setQrData(data); toast.success('QR code generated!');
    } catch (err) { toast.error(err.response?.data?.message||'Generation failed'); }
    finally { setQrLoad(false); }
  };

  const downloadPDF = async () => {
    setDlLoad(true);
    try {
      const res = await api.get('/directive/pdf', { responseType:'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data],{type:'application/pdf'}));
      const a   = document.createElement('a'); a.href=url; a.download=`WillTrail_${Date.now()}.pdf`; a.click();
      window.URL.revokeObjectURL(url); toast.success('PDF downloaded!');
    } catch { toast.error('Please complete your directive first.'); }
    finally { setDlLoad(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="page-title mb-1">Emergency QR Card</h1>
        <p className="text-navy-400">Generate a QR code first responders can scan — no login required on their end.</p>
      </div>

      {/* QR Display */}
      <div className="card p-8 mb-6 text-center">
        {qrData ? (
          <div className="animate-slide-up">
            <div className="inline-block p-3 bg-white rounded-2xl mb-6 shadow-2xl animate-float">
              <img src={qrData.qrDataUrl} alt="Emergency QR Code" className="w-52 h-52"/>
            </div>
            <div className="bg-navy-800 rounded-xl px-4 py-2 mb-3 flex items-center gap-2 max-w-sm mx-auto">
              <span className="text-teal text-xs font-mono truncate flex-1">{qrData.cardUrl}</span>
              <button onClick={()=>{navigator.clipboard.writeText(qrData.cardUrl);toast.success('Copied!');}}
                className="text-navy-400 hover:text-white flex-shrink-0"><Copy size={14}/></button>
            </div>
            <p className="text-navy-500 text-xs mb-1">Expires: {fmtDate(qrData.expiry, {year:'numeric',month:'long',day:'numeric'})}</p>
            <a href={qrData.cardUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-teal text-xs hover:underline">
              Preview card <ExternalLink size={11}/>
            </a>
          </div>
        ) : (
          <div className="py-10">
            <div className="w-20 h-20 rounded-2xl bg-navy-800 border-2 border-dashed border-navy-600 flex items-center justify-center mx-auto mb-4">
              <QrCode size={32} className="text-navy-600"/>
            </div>
            <p className="text-navy-400 mb-1">No QR code yet</p>
            <p className="text-navy-500 text-sm">Generate one below — valid for 1 year</p>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={generateQR} disabled={qrLoad}
          className="card p-5 flex items-center gap-4 hover:border-teal/50 transition-all text-left disabled:opacity-50 group">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
            {qrLoad ? <Loader2 size={20} className="text-teal animate-spin"/> : <RefreshCw size={20} className="text-teal group-hover:rotate-90 transition-transform duration-300"/>}
          </div>
          <div>
            <p className="font-medium text-white">{qrData ? 'Regenerate' : 'Generate QR Code'}</p>
            <p className="text-navy-400 text-sm">{qrData ? 'Old link invalidated' : '1-year validity'}</p>
          </div>
        </button>
        <button onClick={downloadPDF} disabled={dlLoad}
          className="card p-5 flex items-center gap-4 hover:border-teal/50 transition-all text-left disabled:opacity-50">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
            {dlLoad ? <Loader2 size={20} className="text-teal animate-spin"/> : <FileDown size={20} className="text-teal"/>}
          </div>
          <div>
            <p className="font-medium text-white">Download PDF</p>
            <p className="text-navy-400 text-sm">Full advance directive</p>
          </div>
        </button>
      </div>

      <div className="flex items-start gap-3 mt-6 p-4 bg-teal/5 border border-teal/20 rounded-xl">
        <ShieldCheck size={18} className="text-teal flex-shrink-0 mt-0.5"/>
        <p className="text-sm text-navy-300">
          The QR card only shows fields you enabled in the Privacy step of your directive.
          Your full vault always requires your login.
        </p>
      </div>
    </div>
  );
}
