import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, Zap } from 'lucide-react';

export default function PageSuggestionBox({ title = 'AI Copilot Recommendation', suggestion, actionLabel, onAction }) {
  const [closed, setClosed] = useState(false);

  if (closed || !suggestion) return null;

  return (
    <div className="my-6 max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-pink-950/30 border border-purple-500/30 p-3.5 sm:p-4 text-xs shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider block">
            {title}
          </span>
          <p className="text-slate-300 text-xs leading-relaxed">{suggestion}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow flex items-center gap-1 transition-all"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setClosed(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          title="Dismiss suggestion"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
