import React from 'react';
import { GitCompare, CheckCircle, XCircle } from 'lucide-react';

interface DifferentialNotesProps {
  notes: string | null;
}

export const DifferentialNotes: React.FC<DifferentialNotesProps> = ({ notes }) => {
  if (!notes) return null;

  return (
    <div className="border border-indigo-200/80 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
          <GitCompare className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-950">
            Differential Pathology & Look-Alike Analysis
          </h4>
          <p className="text-xs text-indigo-700/80">
            Pathological conditions evaluated and eliminated during vision triage
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-indigo-100 text-xs text-slate-700 leading-relaxed space-y-2">
        <p>{notes}</p>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-indigo-900/80 font-medium">
        <span className="inline-flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Cross-referenced against disease signature database
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="inline-flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Mimics ruled out by lesion morphology
        </span>
      </div>
    </div>
  );
};
