import React from 'react';
import { AgroVisionResult, UploadedImage } from '../types/pathology';
import { X, Printer, Sprout, ShieldCheck } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AgroVisionResult | null;
  images: UploadedImage[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  result,
  images,
}) => {
  if (!isOpen || !result) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:shadow-none print:rounded-none">
        {/* Modal Controls (Hidden in print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            Printable Laboratory Triage Summary
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 sm:p-10 flex-1 overflow-y-auto print:p-0 space-y-6 text-slate-900 text-xs leading-relaxed">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 mb-1">
                <Sprout className="w-5 h-5" />
                <span className="text-base font-extrabold tracking-tight uppercase">
                  AgroVision Pathology Triage Report
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Powered by Gemini 3 Pro Vision Architecture • Automated Agronomy Triage
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-mono">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Ref: AGRO-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Plant ID & Assessment */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Likely Species Identification:</span>
                <h3 className="text-base font-bold text-slate-900">
                  {result.plant_identification.likely_species}
                </h3>
              </div>
              <span className="font-semibold text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                Confidence: <strong className="capitalize">{result.plant_identification.confidence}</strong>
              </span>
            </div>
            <p className="text-slate-700 border-t border-slate-200 pt-2 text-xs">
              <strong>Assessment:</strong> {result.overall_assessment}
            </p>
          </div>

          {/* Specimen Images Row */}
          {images.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">
                Processed Photographic Specimens ({images.length})
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg overflow-hidden p-1 bg-slate-50">
                    <img src={img.dataUrl} alt="Specimen" className="w-full h-24 object-cover rounded" />
                    <p className="text-[10px] text-slate-600 mt-1 truncate">{img.partTag || `Image #${i + 1}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quarantine Alert if applicable */}
          {result.when_to_consult_a_professional && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-950">
              <strong className="block text-rose-900 uppercase text-[10px]">Quarantine / Professional Consultation Notice:</strong>
              <p className="mt-1">{result.when_to_consult_a_professional}</p>
            </div>
          )}

          {/* Diagnoses */}
          {result.diagnoses.length === 0 ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-medium">
              No active pathogens or nutrient deficiencies identified. Specimen is healthy.
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 uppercase text-[11px]">
                Diagnostic Findings ({result.diagnoses.length})
              </h4>
              {result.diagnoses.map((d, idx) => (
                <div key={idx} className="border border-slate-300 rounded-xl p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-sm text-slate-900">
                      {idx + 1}. {d.disease_name}
                    </span>
                    <div className="space-x-2 text-[10px] font-semibold">
                      <span className="uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                        {d.pathogen_type}
                      </span>
                      <span className="uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        {d.severity.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <strong className="text-slate-800">Observed in Specimen:</strong>
                      <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                        {d.symptoms_observed.map((s, si) => (
                          <li key={si}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-slate-800">Immediate Actions:</strong>
                      <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                        {d.immediate_actions.map((act, ai) => (
                          <li key={ai}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px]">
                    <strong className="text-slate-800">Prescribed Treatments:</strong>
                    <div className="mt-1 space-y-1">
                      {d.recommended_treatments.map((rx, ri) => (
                        <div key={ri} className="flex items-start gap-1.5 text-slate-700">
                          <span className="font-semibold uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {rx.type}
                          </span>
                          <span><strong>{rx.treatment}:</strong> {rx.application_instructions}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1 flex justify-between">
                    <span>Duration: {d.treatment_duration}</span>
                    <span>Prevention: {d.prevention_notes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Differential Notes */}
          {result.differential_notes && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <strong className="block text-slate-800 uppercase text-[10px]">Differential Diagnoses Ruled Out:</strong>
              <p className="mt-1 text-slate-600 text-[11px]">{result.differential_notes}</p>
            </div>
          )}

          {/* Signoff / Disclaimer Footer */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 flex justify-between items-center">
            <span>AgroVision Triage Engine • Expert-level initial assessment</span>
            <span>Follow-up Recommended: {result.follow_up_recommended ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
