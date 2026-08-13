import React, { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, Cpu, HardDrive } from 'lucide-react';
import { PerformanceStats } from '../types';

interface StatsOverlayProps {
  stats: PerformanceStats;
}

export const StatsOverlay: React.FC<StatsOverlayProps> = ({ stats }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20 font-mono text-xs select-none">
      <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-2xl p-3 shadow-xl text-slate-200 min-w-[200px]">
        {/* Header Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-between gap-2 text-cyan-400 font-bold border-b border-slate-800/80 pb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>WebGL Profiler</span>
          </span>
          {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Expanded Profiler Details */}
        {!collapsed && (
          <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Frame Rate:</span>
              <span className={`font-bold ${stats.fps >= 55 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {stats.fps} FPS ({stats.frameTimeMs}ms)
              </span>
            </div>

            <div className="flex justify-between">
              <span>Draw Calls:</span>
              <span className="text-slate-200 font-bold">{stats.drawCalls}</span>
            </div>

            <div className="flex justify-between">
              <span>Triangles:</span>
              <span className="text-slate-200 font-bold">{stats.triangles.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-cyan-400" /> GPU Memory:
              </span>
              <span className="text-cyan-400 font-bold">
                {stats.textures} Tex / {stats.geometries} Geo
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-800/60 pt-1">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" /> Pipeline:
              </span>
              <span className="text-slate-300 font-bold">{stats.webglVersion}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
