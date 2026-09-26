import React, { useState } from 'react';
import { Diagnosis, TreatmentType } from '../types/pathology';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CheckSquare,
  Square,
  Bug,
  Dna,
  Zap,
  Leaf,
  Layers,
  Thermometer,
  HelpCircle,
} from 'lucide-react';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  index: number;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({ diagnosis, index }) => {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (idx: number) => {
    setCompletedActions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getSeverityStyle = (severity: Diagnosis['severity']) => {
    switch (severity) {
      case 'early_stage':
        return {
          label: 'Early Stage',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'moderate':
        return {
          label: 'Moderate Severity',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'advanced':
        return {
          label: 'Advanced / Urgent',
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
        };
      default:
        return {
          label: severity,
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-400',
        };
    }
  };

  const getPathogenIcon = (type: Diagnosis['pathogen_type']) => {
    switch (type) {
      case 'fungal':
        return <Leaf className="w-3.5 h-3.5 text-purple-600" />;
      case 'bacterial':
        return <Dna className="w-3.5 h-3.5 text-orange-600" />;
      case 'viral':
        return <Zap className="w-3.5 h-3.5 text-rose-600" />;
      case 'pest':
        return <Bug className="w-3.5 h-3.5 text-amber-700" />;
      case 'nutrient_deficiency':
        return <Layers className="w-3.5 h-3.5 text-cyan-600" />;
      case 'environmental':
        return <Thermometer className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getPathogenBadgeStyle = (type: Diagnosis['pathogen_type']) => {
    switch (type) {
      case 'fungal':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'bacterial':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'viral':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'pest':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'nutrient_deficiency':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'environmental':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getTreatmentTypeBadge = (type: TreatmentType) => {
    switch (type) {
      case 'organic':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cultural':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'biological':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'chemical':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const sevStyle = getSeverityStyle(diagnosis.severity);

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden transition hover:shadow-md">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-emerald-50/30 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 font-mono">
              #{index + 1}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${getPathogenBadgeStyle(
                diagnosis.pathogen_type
              )}`}
            >
              {getPathogenIcon(diagnosis.pathogen_type)}
              <span className="capitalize">{diagnosis.pathogen_type.replace('_', ' ')} Pathogen</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sevStyle.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${sevStyle.dot} animate-pulse`} />
              {sevStyle.label}
            </span>
          </div>

          <div className="text-xs font-medium text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            Diagnostic Confidence:{' '}
            <span
              className={`font-bold capitalize ${
                diagnosis.confidence === 'high'
                  ? 'text-emerald-700'
                  : diagnosis.confidence === 'medium'
                  ? 'text-amber-700'
                  : 'text-slate-600'
              }`}
            >
              {diagnosis.confidence}
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {diagnosis.disease_name}
        </h3>

        {/* Affected parts */}
        {diagnosis.affected_parts && diagnosis.affected_parts.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-xs text-slate-500 font-medium">Affected structures:</span>
            {diagnosis.affected_parts.map((part, pIdx) => (
              <span
                key={pIdx}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
              >
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Symptoms Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Observed in this specimen */}
          <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Observed In This Specimen
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-800">
              {diagnosis.symptoms_observed.map((sym, sIdx) => (
                <li key={sIdx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common textbook symptoms */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Broader Disease Profile
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {diagnosis.common_symptoms.map((sym, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Immediate Actions Checklist */}
        {diagnosis.immediate_actions && diagnosis.immediate_actions.length > 0 && (
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-700" />
                Immediate Action Checklist (Start Today)
              </h4>
              <span className="text-[11px] text-amber-800 font-medium">
                {Object.values(completedActions).filter(Boolean).length} /{' '}
                {diagnosis.immediate_actions.length} completed
              </span>
            </div>

            <div className="space-y-2">
              {diagnosis.immediate_actions.map((act, aIdx) => {
                const done = completedActions[aIdx];
                return (
                  <button
                    key={aIdx}
                    type="button"
                    onClick={() => toggleAction(aIdx)}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex items-start gap-3 cursor-pointer ${
                      done
                        ? 'bg-emerald-50/80 border-emerald-300 text-slate-500 line-through'
                        : 'bg-white border-amber-200 hover:border-amber-400 text-slate-800'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </span>
                    <span className="text-xs font-medium leading-relaxed">{act}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommended Treatments */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Prescribed Treatment Protocols
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diagnosis.recommended_treatments.map((rx, rIdx) => (
              <div
                key={rIdx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTreatmentTypeBadge(
                        rx.type
                      )}`}
                    >
                      {rx.type} Control
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mb-1.5">
                    {rx.treatment}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rx.application_instructions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatment Duration & Prevention Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-1">
                Recovery Timeline & Duration
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {diagnosis.treatment_duration}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-1">
                Long-Term Prevention Strategy
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {diagnosis.prevention_notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
