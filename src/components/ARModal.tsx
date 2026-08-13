import React from 'react';
import { X, Smartphone, QrCode, Sparkles } from 'lucide-react';

interface ARModalProps {
  productName: string;
  onClose: () => void;
}

export const ARModal: React.FC<ARModalProps> = ({ productName, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-5 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Augmented Reality Mode</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300">
          Scan this QR code with your mobile camera to place the customized <span className="font-bold text-cyan-400">{productName}</span> in your room in real 1:1 scale using AR QuickLook!
        </p>

        {/* QR Code Graphic Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-3">
          <div className="relative w-40 h-40 bg-white p-3 rounded-xl flex items-center justify-center shadow-lg">
            {/* SVG Simulated QR code */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
              <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
              <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
              <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
              <rect x="40" y="10" width="10" height="20" />
              <rect x="55" y="5" width="10" height="15" />
              <rect x="10" y="40" width="20" height="10" />
              <rect x="40" y="40" width="20" height="20" />
              <rect x="70" y="45" width="25" height="10" />
              <rect x="45" y="70" width="15" height="20" />
              <rect x="70" y="70" width="25" height="25" />
            </svg>
            <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-xl pointer-events-none"></div>
          </div>

          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> WebXR / AR QuickLook Ready
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
};
