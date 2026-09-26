import React from 'react';
import { Sprout, Microscope, Sparkles, Code2, RotateCcw, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenJson?: () => void;
  hasResult: boolean;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onOpenJson,
  hasResult,
  isAnalyzing,
}) => {
  return (
    <header className="border-b border-emerald-950/20 bg-slate-900 text-slate-100 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/30">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                AgroVision
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 tracking-wide uppercase">
                  Gemini 3 Vision
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5 text-emerald-400" />
              Plant Pathology & Crop Health Diagnostic Triage Assistant
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasResult && onOpenJson && (
            <button
              type="button"
              onClick={onOpenJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Inspect raw schema JSON output"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Inspect</span> JSON
            </button>
          )}

          {(hasResult || isAnalyzing) && (
            <button
              type="button"
              onClick={onReset}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/50 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-800/60 transition cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Specimen
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-700/80 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" />
              1–5 Photo Triage
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <ShieldAlert className="w-3 h-3" />
              Quarantine Screening
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
