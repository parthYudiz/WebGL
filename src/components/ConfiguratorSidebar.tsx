import React, { useState } from 'react';
import { Sliders, Palette, ToggleLeft, Sun, Check, Info } from 'lucide-react';
import { Category, DimensionConfig, MaterialOption, PartConfig, StudioEnvironment } from '../types';
import { MATERIAL_LIBRARY, STUDIO_PRESETS } from '../data/products';

interface ConfiguratorSidebarProps {
  category: Category;
  parts: PartConfig[];
  onUpdatePartMaterial: (partId: string, materialId: string) => void;
  onTogglePart: (partId: string) => void;
  dimensions: DimensionConfig[];
  onUpdateDimension: (dimId: string, val: number) => void;
  currentStudio: StudioEnvironment;
  onSelectStudio: (studio: StudioEnvironment) => void;
  onUpdateStudioProperty: (key: keyof StudioEnvironment, val: any) => void;
}

export const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({
  parts,
  onUpdatePartMaterial,
  onTogglePart,
  dimensions,
  onUpdateDimension,
  currentStudio,
  onSelectStudio,
  onUpdateStudioProperty,
}) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'parts' | 'dimensions' | 'studio'>('materials');
  const [selectedPartId, setSelectedPartId] = useState<string>(parts[0]?.id || '');

  // Active part material selection
  const activePart = parts.find((p) => p.id === selectedPartId) || parts[0];
  const activeMaterial = MATERIAL_LIBRARY.find((m) => m.id === activePart?.selectedMaterialId) || MATERIAL_LIBRARY[0];

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl flex flex-col h-full text-slate-200 z-20 shadow-2xl">
      {/* Sidebar Navigation Tabs */}
      <div className="grid grid-cols-4 bg-slate-950/80 p-1 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all ${
            activeTab === 'materials'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Materials</span>
        </button>

        <button
          onClick={() => setActiveTab('parts')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all ${
            activeTab === 'parts'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ToggleLeft className="w-4 h-4" />
          <span>Modular Parts</span>
        </button>

        <button
          onClick={() => setActiveTab('dimensions')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all ${
            activeTab === 'dimensions'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Dimensions</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all ${
            activeTab === 'studio'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>Studio Light</span>
        </button>
      </div>

      {/* Tab Contents Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* ================= MATERIALS TAB ================= */}
        {activeTab === 'materials' && (
          <div className="space-y-5">
            {/* Step 1: Select Part */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                1. Select Component Mesh
              </label>
              <div className="space-y-1.5">
                {parts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPartId(p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedPartId === p.id
                        ? 'bg-slate-800 border-cyan-500/60 text-slate-100 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="font-mono text-[11px] text-cyan-400/80">
                      {MATERIAL_LIBRARY.find((m) => m.id === p.selectedMaterialId)?.name || 'Default'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Swatch */}
            <div>
              <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                2. Apply Finish Material
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {MATERIAL_LIBRARY.map((mat) => {
                  const isSelected = activePart?.selectedMaterialId === mat.id;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => onUpdatePartMaterial(activePart.id, mat.id)}
                      className={`relative flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-950/50 border-cyan-400 text-slate-100 ring-2 ring-cyan-400/30 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {/* Color Preview Swatch */}
                      <span
                        className="w-7 h-7 rounded-lg border border-white/20 shadow-inner flex-shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: mat.color }}
                      >
                        {mat.clearcoat ? (
                          <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent" />
                        ) : null}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight truncate">{mat.name}</div>
                        <div className="text-[10px] font-mono text-slate-400 capitalize">
                          {mat.category} {mat.priceMultiplier > 1 ? `(+${Math.round((mat.priceMultiplier - 1) * 100)}%)` : ''}
                        </div>
                      </div>

                      {isSelected && (
                        <span className="absolute right-1.5 top-1.5 text-cyan-400">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Material Properties Box */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> PBR Shader Specs
                </span>
                <span className="text-cyan-400 font-bold">{activeMaterial.name}</span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Roughness:</span>
                  <span className="text-slate-200">{activeMaterial.roughness}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metalness:</span>
                  <span className="text-slate-200">{activeMaterial.metalness}</span>
                </div>
                {activeMaterial.clearcoat && (
                  <div className="flex justify-between">
                    <span>Clearcoat:</span>
                    <span className="text-slate-200">{activeMaterial.clearcoat}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Normal Map:</span>
                  <span className="text-cyan-400 capitalize">{activeMaterial.textureType || 'smooth'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODULAR PARTS TAB ================= */}
        {activeTab === 'parts' && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Component Assembly & Accessories
            </div>

            <div className="space-y-2.5">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    part.enabled
                      ? 'bg-slate-950/80 border-slate-800 text-slate-200 shadow-md'
                      : 'bg-slate-950/30 border-slate-800/40 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{part.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{part.description}</p>
                    </div>

                    {part.optional ? (
                      <button
                        onClick={() => onTogglePart(part.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                          part.enabled
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {part.enabled ? 'Included' : 'Remove'}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Core Part
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-xs font-mono">
                    <span className="text-slate-400">Addon Cost:</span>
                    <span className="text-emerald-400 font-bold">+${part.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DIMENSIONS TAB ================= */}
        {activeTab === 'dimensions' && (
          <div className="space-y-5">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Parametric Geometry Sliders
            </div>

            {dimensions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 text-slate-400 text-xs text-center border border-slate-800">
                No parametric scaling rules assigned for this model.
              </div>
            ) : (
              dimensions.map((dim) => (
                <div key={dim.id} className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dim.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {dim.value} {dim.unit}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={dim.min}
                    max={dim.max}
                    value={dim.value}
                    onChange={(e) => onUpdateDimension(dim.id, parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Min: {dim.min}{dim.unit}</span>
                    <span>Max: {dim.max}{dim.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= STUDIO LIGHT TAB ================= */}
        {activeTab === 'studio' && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                Studio Environment Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STUDIO_PRESETS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onSelectStudio(st)}
                    className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                      currentStudio.id === st.id
                        ? 'bg-cyan-950/50 border-cyan-400 text-slate-100 font-bold shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div>{st.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Light Sliders */}
            <div className="space-y-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-mono text-slate-300 font-semibold border-b border-slate-800 pb-2">
                Fine-Tune Studio Lights
              </div>

              {/* Key Light Intensity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Key Light Intensity:</span>
                  <span className="text-cyan-400 font-bold">{currentStudio.keyLightIntensity}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={currentStudio.keyLightIntensity}
                  onChange={(e) => onUpdateStudioProperty('keyLightIntensity', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Ambient Light Intensity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Ambient Studio Light:</span>
                  <span className="text-cyan-400 font-bold">{currentStudio.ambientIntensity}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.1"
                  value={currentStudio.ambientIntensity}
                  onChange={(e) => onUpdateStudioProperty('ambientIntensity', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
