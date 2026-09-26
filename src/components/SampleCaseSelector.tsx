import React from 'react';
import { SAMPLE_CASES, SampleCase } from '../data/sampleCases';
import { Beaker, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface SampleCaseSelectorProps {
  onSelectCase: (sample: SampleCase, runLive: boolean) => void;
  disabled?: boolean;
}

export const SampleCaseSelector: React.FC<SampleCaseSelectorProps> = ({
  onSelectCase,
  disabled = false,
}) => {
  const getBadgeStyle = (type: SampleCase['badgeType']) => {
    switch (type) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getBadgeIcon = (type: SampleCase['badgeType']) => {
    switch (type) {
      case 'critical':
        return <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />;
      case 'healthy':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />;
      default:
        return <HelpCircle className="w-3 h-3 text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
            <Beaker className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Or Try a Diagnostic Benchmark Case
            </h3>
            <p className="text-xs text-slate-500">
              Select a pre-loaded pathology scenario with laboratory specimens & environmental notes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {SAMPLE_CASES.map((sample) => (
          <div
            key={sample.id}
            className="group text-left border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 rounded-xl p-3.5 transition shadow-2xs hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(sample.badgeType)}`}>
                  {getBadgeIcon(sample.badgeType)}
                  {sample.diseaseBadge}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {sample.images.length} img
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition">
                {sample.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-500 italic mb-1">
                {sample.cropName}
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-2">
                {sample.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectCase(sample, false)}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition cursor-pointer"
                title="Load sample images & view diagnostic report"
              >
                Inspect Report
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectCase(sample, true)}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200 transition cursor-pointer"
                title="Send these photos to Gemini 3 for live real-time analysis"
              >
                Re-diagnose Live
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
