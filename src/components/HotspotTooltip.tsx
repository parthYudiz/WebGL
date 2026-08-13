import React from 'react';
import { X, Info, ShieldCheck, Cpu } from 'lucide-react';
import { AnnotationHotspot } from '../types';

interface HotspotTooltipProps {
  annotation: AnnotationHotspot;
  onClose: () => void;
}

export const HotspotTooltip: React.FC<HotspotTooltipProps> = ({ annotation, onClose }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-md bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{annotation.title}</h3>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Component Feature Hotspot
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{annotation.description}</p>

      <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Technical Specs:
        </span>
        <span className="text-cyan-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          {annotation.specs}
        </span>
      </div>
    </div>
  );
};
