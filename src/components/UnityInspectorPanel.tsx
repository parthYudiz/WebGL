import React, { useState } from 'react';
import { Code2, Copy, Check, Eye, X, Cpu, Layers } from 'lucide-react';
import { PartConfig, ShaderUniforms } from '../types';
import { MATERIAL_LIBRARY } from '../data/products';

interface UnityInspectorPanelProps {
  unityScriptSnippet: string;
  parts: PartConfig[];
  shaderUniforms: ShaderUniforms;
  onUpdateShaderUniforms: (key: keyof ShaderUniforms, val: any) => void;
  onClose: () => void;
}

export const UnityInspectorPanel: React.FC<UnityInspectorPanelProps> = ({
  unityScriptSnippet,
  parts,
  shaderUniforms,
  onUpdateShaderUniforms,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'code' | 'hierarchy'>('inspector');
  const [copied, setCopied] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string>(parts[0]?.id || '');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(unityScriptSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPart = parts.find((p) => p.id === selectedPartId) || parts[0];
  const selectedMaterial = MATERIAL_LIBRARY.find((m) => m.id === selectedPart?.selectedMaterialId);

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-slate-900/95 border-l border-slate-800/80 backdrop-blur-xl flex flex-col h-full text-slate-200 z-30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono text-xs font-bold text-indigo-400">Unity / WebGL Bridge</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="grid grid-cols-3 bg-slate-950/80 p-1 border-b border-slate-800 text-xs font-mono font-semibold">
        <button
          onClick={() => setActiveTab('inspector')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'inspector' ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Inspector
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'code' ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          C# Script
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`py-2 rounded-lg transition-all ${
            activeTab === 'hierarchy' ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hierarchy
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar font-mono text-xs">
        {/* ================= INSPECTOR TAB ================= */}
        {activeTab === 'inspector' && (
          <div className="space-y-5">
            {/* Component Inspector Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-indigo-400 font-bold">
                <Code2 className="w-4 h-4" />
                <span>PBR Shader Material Override</span>
              </div>

              {/* Wireframe Debug Mode */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Wireframe Mesh Debug:</span>
                <button
                  onClick={() => onUpdateShaderUniforms('wireframe', !shaderUniforms.wireframe)}
                  className={`px-3 py-1 rounded-lg border font-bold text-[11px] ${
                    shaderUniforms.wireframe
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {shaderUniforms.wireframe ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              {/* Roughness Shift */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Roughness Offset:</span>
                  <span className="text-indigo-400 font-bold">{shaderUniforms.roughnessShift.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.05"
                  value={shaderUniforms.roughnessShift}
                  onChange={(e) => onUpdateShaderUniforms('roughnessShift', parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* Metallic Shift */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Metallic Factor Shift:</span>
                  <span className="text-indigo-400 font-bold">{shaderUniforms.metallicFactor.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.05"
                  value={shaderUniforms.metallicFactor}
                  onChange={(e) => onUpdateShaderUniforms('metallicFactor', parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Part Material Properties Inspector */}
            {selectedPart && selectedMaterial && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="text-indigo-400 font-bold border-b border-slate-800 pb-2">
                  Mesh: {selectedPart.name}
                </div>
                <div className="text-slate-400 text-[11px] space-y-1">
                  <div>Shader: Universal Render Pipeline (URP/Lit)</div>
                  <div>Base Color: <span style={{ color: selectedMaterial.color }}>{selectedMaterial.color}</span></div>
                  <div>Roughness: {selectedMaterial.roughness}</div>
                  <div>Metalness: {selectedMaterial.metalness}</div>
                  <div>Bump Normal: {selectedMaterial.textureType || 'None'}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= C# CODE TAB ================= */}
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">ChairConfiguratorController.cs</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy C#'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
              {unityScriptSnippet}
            </pre>
          </div>
        )}

        {/* ================= HIERARCHY TAB ================= */}
        {activeTab === 'hierarchy' && (
          <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4" />
              <span>Scene Hierarchy</span>
            </div>

            <div className="space-y-1 pl-2">
              <div className="text-slate-400 font-bold">📦 RootScene</div>
              <div className="pl-4 border-l border-slate-800 space-y-1">
                <div className="text-slate-400">💡 StudioLightRig</div>
                <div className="text-slate-400">🎥 PerspectiveCamera</div>
                <div className="text-indigo-400 font-bold">🧊 ProductContainerGroup</div>
                <div className="pl-4 border-l border-slate-800 space-y-1">
                  {parts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPartId(p.id)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors flex items-center justify-between ${
                        selectedPartId === p.id
                          ? 'bg-indigo-600/30 text-indigo-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>🔹 {p.id}</span>
                      <Eye className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
