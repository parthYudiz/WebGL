import React from 'react';
import { Armchair, Camera, Code2, Eye, Headphones, Keyboard, Layers, QrCode, RotateCw, ShoppingBag, Watch } from 'lucide-react';
import { Category, PerformanceStats } from '../types';

interface NavbarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  explosionRatio: number;
  onChangeExplosion: (val: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onCameraPreset: (preset: 'perspective' | 'front' | 'top' | 'side' | 'detail') => void;
  onTakeSnapshot: () => void;
  onToggleARModal: () => void;
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
  onOpenSummary: () => void;
  totalPrice: number;
  stats: PerformanceStats;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  explosionRatio,
  onChangeExplosion,
  autoRotate,
  onToggleAutoRotate,
  onCameraPreset,
  onTakeSnapshot,
  onToggleARModal,
  onToggleInspector,
  isInspectorOpen,
  onOpenSummary,
  totalPrice,
  stats,
}) => {
  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'chair', label: 'Executive Chair', icon: <Armchair className="w-4 h-4" /> },
    { id: 'headphones', label: 'Studio Headphones', icon: <Headphones className="w-4 h-4" /> },
    { id: 'watch', label: 'Titanium Watch', icon: <Watch className="w-4 h-4" /> },
    { id: 'keyboard', label: 'Cyber Keyboard', icon: <Keyboard className="w-4 h-4" /> },
  ];

  return (
    <header className="relative z-30 w-full bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-slate-200">
      {/* Brand & Live FPS Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
          <Layers className="w-5 h-5 text-slate-950" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide bg-gradient-to-r from-slate-100 via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            AeroForge 3D <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">WebGL Studio</span>
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {stats.fps} FPS
            </span>
            <span className="text-slate-600">•</span>
            <span>{stats.webglVersion}</span>
            <span className="text-slate-600">•</span>
            <span>{stats.triangles.toLocaleString()} Tris</span>
          </div>
        </div>
      </div>

      {/* Product Switcher Tabs */}
      <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.icon}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Viewport Control Actions */}
      <div className="flex items-center gap-2">
        {/* Exploded View Slider */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-mono flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Explode:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explosionRatio}
            onChange={(e) => onChangeExplosion(parseFloat(e.target.value))}
            className="w-20 accent-cyan-400 cursor-pointer"
          />
          <span className="font-mono text-cyan-400 font-bold w-8 text-right">
            {Math.round(explosionRatio * 100)}%
          </span>
        </div>

        {/* Camera Preset Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-colors">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Camera</span>
          </button>
          <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-50 min-w-[120px]">
            <button onClick={() => onCameraPreset('perspective')} className="px-3 py-1.5 text-left text-xs hover:bg-slate-800 text-slate-300 rounded-lg">Perspective</button>
            <button onClick={() => onCameraPreset('front')} className="px-3 py-1.5 text-left text-xs hover:bg-slate-800 text-slate-300 rounded-lg">Front View</button>
            <button onClick={() => onCameraPreset('top')} className="px-3 py-1.5 text-left text-xs hover:bg-slate-800 text-slate-300 rounded-lg">Top View</button>
            <button onClick={() => onCameraPreset('side')} className="px-3 py-1.5 text-left text-xs hover:bg-slate-800 text-slate-300 rounded-lg">Side View</button>
            <button onClick={() => onCameraPreset('detail')} className="px-3 py-1.5 text-left text-xs hover:bg-slate-800 text-slate-300 rounded-lg">Close-Up Detail</button>
          </div>
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={onToggleAutoRotate}
          title="Auto Rotate Scene"
          className={`p-2 rounded-xl border text-xs transition-colors ${
            autoRotate
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Take Snapshot */}
        <button
          onClick={onTakeSnapshot}
          title="Take HD PNG Snapshot"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
        </button>

        {/* AR QR Code Modal */}
        <button
          onClick={onToggleARModal}
          title="View in Mobile AR"
          className="hidden sm:flex p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition-colors"
        >
          <QrCode className="w-4 h-4 text-cyan-400" />
        </button>

        {/* C# / Unity Inspector Toggle Button */}
        <button
          onClick={onToggleInspector}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
            isInspectorOpen
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-500/20'
              : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-indigo-500/40'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Unity Inspector</span>
        </button>

        {/* Live Total Price & Summary Trigger */}
        <button
          onClick={onOpenSummary}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>${totalPrice.toLocaleString()}</span>
        </button>
      </div>
    </header>
  );
};
