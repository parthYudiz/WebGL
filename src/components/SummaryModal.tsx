import React, { useState } from 'react';
import { X, Download, Copy, Check, ShoppingBag, FileCode, Sparkles } from 'lucide-react';
import { DimensionConfig, MaterialOption, PartConfig, ProductPreset } from '../types';
import { MATERIAL_LIBRARY } from '../data/products';

interface SummaryModalProps {
  product: ProductPreset;
  parts: PartConfig[];
  dimensions: DimensionConfig[];
  totalPrice: number;
  onClose: () => void;
  onExportGLTF: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  product,
  parts,
  dimensions,
  totalPrice,
  onClose,
  onExportGLTF,
}) => {
  const [copiedJSON, setCopiedJSON] = useState(false);

  const activeParts = parts.filter((p) => p.enabled);

  const configJSON = JSON.stringify(
    {
      productId: product.id,
      productName: product.name,
      totalPrice,
      parts: activeParts.map((p) => ({
        id: p.id,
        name: p.name,
        material: MATERIAL_LIBRARY.find((m) => m.id === p.selectedMaterialId)?.name,
        price: p.price,
      })),
      dimensions: dimensions.map((d) => ({
        name: d.name,
        value: `${d.value}${d.unit}`,
      })),
      timestamp: new Date().toISOString(),
    },
    null,
    2
  );

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(configJSON);
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h2 className="text-xl font-bold text-slate-100">{product.name}</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{product.tagline}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill of Materials Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Bill of Materials & Finishes
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl divide-y divide-slate-800/60 overflow-hidden text-xs">
            {activeParts.map((p) => {
              const mat = MATERIAL_LIBRARY.find((m) => m.id === p.selectedMaterialId);
              return (
                <div key={p.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-200">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Finish: <span className="text-cyan-400">{mat?.name || 'Standard'}</span>
                    </div>
                  </div>
                  <div className="font-mono text-emerald-400 font-bold">+${p.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dimension Specs */}
        {dimensions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Parametric Dimension Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {dimensions.map((d) => (
                <div key={d.id} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex justify-between">
                  <span className="text-slate-400">{d.name}:</span>
                  <span className="text-slate-100 font-bold">{d.value} {d.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Price Callout */}
        <div className="bg-gradient-to-r from-cyan-950 to-slate-950 border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-cyan-400">Configured Total Price</div>
            <div className="text-2xl font-bold text-slate-100 mt-0.5">${totalPrice.toLocaleString()} USD</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" /> Live WebGL Quote
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onExportGLTF}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export 3D GLTF Scene</span>
          </button>

          <button
            onClick={handleCopyJSON}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            {copiedJSON ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode className="w-4 h-4 text-cyan-400" />}
            <span>{copiedJSON ? 'Copied Specs JSON!' : 'Copy CAD Specs (JSON)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
