import React, { useState } from 'react';
import { AgroVisionResult, UploadedImage } from '../types/pathology';
import { DiagnosisCard } from './DiagnosisCard';
import { DifferentialNotes } from './DifferentialNotes';
import {
  Sprout,
  ShieldAlert,
  Camera,
  CheckCircle,
  AlertOctagon,
  Copy,
  Printer,
  Code2,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DiagnosticResultViewProps {
  result: AgroVisionResult;
  images: UploadedImage[];
  onOpenJson: () => void;
  onPrint: () => void;
}

export const DiagnosticResultView: React.FC<DiagnosticResultViewProps> = ({
  result,
  images,
  onOpenJson,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  const copySummary = () => {
    const lines = [
      `AGROVISION PLANT PATHOLOGY TRIAGE REPORT`,
      `Species: ${result.plant_identification.likely_species} (${result.plant_identification.confidence} confidence)`,
      `Assessment: ${result.overall_assessment}`,
      '',
    ];

    if (result.diagnoses.length === 0) {
      lines.push('Result: No active diseases or pathogens detected. Plant appears healthy.');
    } else {
      lines.push(`Diagnoses (${result.diagnoses.length}):`);
      result.diagnoses.forEach((d, i) => {
        lines.push(`${i + 1}. ${d.disease_name} [${d.severity.toUpperCase()}, ${d.pathogen_type}]`);
        lines.push(`   Observed: ${d.symptoms_observed.join(', ')}`);
        lines.push(`   Immediate Actions:`);
        d.immediate_actions.forEach((act) => lines.push(`   - ${act}`));
        lines.push(`   Treatment: ${d.treatment_duration}`);
        lines.push('');
      });
    }

    if (result.differential_notes) {
      lines.push(`Differential Analysis: ${result.differential_notes}`);
      lines.push('');
    }

    if (result.when_to_consult_a_professional) {
      lines.push(`PROFESSIONAL / QUARANTINE ADVISORY: ${result.when_to_consult_a_professional}`);
      lines.push('');
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHealthy = result.diagnoses.length === 0;

  return (
    <div className="space-y-6">
      {/* Plant Identification & Overall Assessment Banner */}
      <div className="border border-emerald-950/20 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
        {/* Subtle background botanical watermark */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-5 pointer-events-none">
          <Sprout className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <Sprout className="w-3.5 h-3.5" />
              Taxonomic Morphology Match
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">ID Confidence:</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  result.plant_identification.confidence === 'high'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                    : result.plant_identification.confidence === 'medium'
                    ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-700 text-slate-300 border border-slate-600'
                }`}
              >
                {result.plant_identification.confidence}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.plant_identification.likely_species}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed max-w-4xl">
              {result.overall_assessment}
            </p>
          </div>

          {/* Quick stats / overview pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 border-t border-slate-700/60">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isHealthy ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              {isHealthy ? 'Pathology Negative (Healthy)' : `${result.diagnoses.length} Diagnostic Finding(s)`}
            </span>
            <span>•</span>
            <span>{images.length} specimen image(s) processed</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Gemini 3 Multimodal Vision</span>
          </div>
        </div>
      </div>

      {/* Image Quality Limitations Banner (if any) */}
      {result.image_quality_notes && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-2xs">
          <Camera className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-amber-950">
              Photographic Diagnostic Constraints
            </h4>
            <p className="leading-relaxed">{result.image_quality_notes}</p>
          </div>
        </div>
      )}

      {/* When to Consult a Professional / Quarantine Alert Banner */}
      {result.when_to_consult_a_professional && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-rose-900">
                  Official Advisory / Professional Consultation Notice
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 uppercase">
                  High Priority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                {result.when_to_consult_a_professional}
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs text-rose-800">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  Prevent Quarantine Spread
                </span>
                <span>•</span>
                <span>Contact your State or County Agricultural Extension Office</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Healthy Specimen Banner if diagnoses is empty */}
      {isHealthy && (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950">
            Specimen Appears Vigorous & Pathogen-Free
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 max-w-2xl mx-auto leading-relaxed">
            No fungal leaf spots, bacterial wilts, viral mosaics, nutrient deficiency chlorosis, or active pest feeding damage were detected on the submitted imagery. Continue standard watering and preventive cultural hygiene.
          </p>
        </div>
      )}

      {/* Diagnoses List */}
      {!isHealthy && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Identified Pathology & Stress Diagnoses
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Ordered by Severity
            </span>
          </div>

          {result.diagnoses.map((diagnosis, idx) => (
            <DiagnosisCard key={idx} diagnosis={diagnosis} index={idx} />
          ))}
        </div>
      )}

      {/* Differential Notes (Rules out look-alikes) */}
      <DifferentialNotes notes={result.differential_notes} />

      {/* Follow-up reminder if recommended */}
      {result.follow_up_recommended && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Follow-Up Recommended:</strong> Re-photograph the plant in 7 to 10 days to confirm that lesion expansion has ceased and new terminal growth remains asymptomatic.
            </span>
          </div>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="pt-3 pb-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            {copied ? 'Summary Copied!' : 'Copy Summary'}
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Report
          </button>

          <button
            type="button"
            onClick={onOpenJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            Raw Schema JSON
          </button>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          AgroVision provides triage recommendations. High-value commercial crops should consult a certified agronomist.
        </p>
      </div>
    </div>
  );
};
