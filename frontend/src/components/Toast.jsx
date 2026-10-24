import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = 'info' } = toast;

  let borderColor = 'border-purple-500/40';
  let bgColor = 'bg-[#0f142a]/90';
  let icon = <Info className="w-4 h-4 text-purple-400" />;

  if (type === 'success') {
    borderColor = 'border-emerald-500/50';
    bgColor = 'bg-emerald-950/80';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  } else if (type === 'error') {
    borderColor = 'border-rose-500/50';
    bgColor = 'bg-rose-950/80';
    icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white text-xs max-w-md`}
      >
        {icon}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
