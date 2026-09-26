import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ContextForm } from './components/ContextForm';
import { SampleCaseSelector } from './components/SampleCaseSelector';
import { DiagnosticResultView } from './components/DiagnosticResultView';
import { JsonViewerModal } from './components/JsonViewerModal';
import { PrintReportModal } from './components/PrintReportModal';
import { AgroVisionResult, PlantContextNotes, UploadedImage } from './types/pathology';
import { SampleCase } from './data/sampleCases';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Microscope,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [notes, setNotes] = useState<PlantContextNotes>({
    environment: 'outdoor_garden',
  });
  const [result, setResult] = useState<AgroVisionResult | null>(null);
  const [rawJson, setRawJson] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [history, setHistory] = useState<
    { id: string; name: string; timestamp: string; result: AgroVisionResult; images: UploadedImage[] }[]
  >([]);

  const handleReset = () => {
    setImages([]);
    setNotes({ environment: 'outdoor_garden' });
    setResult(null);
    setRawJson(undefined);
    setErrorMsg(null);
    setIsAnalyzing(false);
  };

  const handleSelectSample = (sample: SampleCase, runLive: boolean) => {
    const loadedImages: UploadedImage[] = sample.images.map((img, i) => ({
      id: `sample-${sample.id}-${i}`,
      dataUrl: img.dataUrl,
      mimeType: img.mimeType,
      base64Data: img.base64Data,
      fileName: `${sample.id}-${i + 1}.svg`,
      fileSize: Math.round((img.base64Data.length * 3) / 4),
      partTag: img.tag,
    }));

    setImages(loadedImages);
    setNotes(sample.notes);
    setErrorMsg(null);

    if (runLive) {
      // Trigger live diagnosis on the sample images
      executeDiagnosis(loadedImages, sample.notes);
    } else {
      // Instant inspection of precomputed pathology report
      setResult(sample.precomputedResult);
      setRawJson(JSON.stringify(sample.precomputedResult, null, 2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const executeDiagnosis = async (
    targetImages = images,
    targetContext = notes
  ) => {
    if (!targetImages || targetImages.length === 0) {
      setErrorMsg('Please upload at least 1 plant photograph (up to 5) before submitting.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);
    setRawJson(undefined);

    // Methodology progression messages
    const steps = [
      '1/5: Identifying botanical species and leaf morphology...',
      '2/5: Scanning visual evidence for lesions, chlorosis & fungal structures...',
      '3/5: Cross-referencing observed symptom clusters against disease signatures...',
      '4/5: Evaluating and ruling out look-alike conditions (differential analysis)...',
      '5/5: Compiling actionable treatment protocols & safety triage...',
    ];

    let stepIdx = 0;
    setAnalysisStep(steps[0]);
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setAnalysisStep(steps[stepIdx]);
      }
    }, 1800);

    try {
      const payload = {
        images: targetImages.map((img) => ({
          mimeType: img.mimeType,
          base64Data: img.base64Data,
          tag: img.partTag,
        })),
        notes: targetContext,
      };

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      clearInterval(interval);

      const jsonResponse = await res.json();

      if (!res.ok || !jsonResponse.success) {
        throw new Error(jsonResponse.error || 'Failed to complete diagnosis.');
      }

      const diagnosticData: AgroVisionResult = jsonResponse.data;
      setResult(diagnosticData);
      setRawJson(jsonResponse.rawJson || JSON.stringify(diagnosticData, null, 2));

      // Append to session history
      setHistory((prev) => [
        {
          id: Math.random().toString(36).substring(2, 9),
          name: diagnosticData.plant_identification.likely_species || 'Plant Specimen',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          result: diagnosticData,
          images: targetImages,
        },
        ...prev.slice(0, 4),
      ]);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      clearInterval(interval);
      console.error('Diagnosis error:', err);
      setErrorMsg(err.message || 'Error communicating with diagnostic engine.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header
        onReset={handleReset}
        onOpenJson={() => setJsonModalOpen(true)}
        hasResult={!!result}
        isAnalyzing={isAnalyzing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="block font-bold">Diagnostic Triage Alert</strong>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Analyzing Progress State */}
        {isAnalyzing && (
          <div className="border border-emerald-200 bg-white rounded-2xl p-8 sm:p-12 text-center shadow-lg space-y-5 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-25" />
              <div className="relative w-full h-full rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
                <Microscope className="w-9 h-9 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900">
                Executing AgroVision Pathology Analysis
              </h3>
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex items-center gap-2 border border-emerald-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {analysisStep}
              </p>
              <p className="text-xs text-slate-500 pt-2 leading-relaxed">
                Evaluating 1–5 plant images with Gemini 3 vision reasoning. Scanning morphology, chlorosis, lesions, and differential look-alikes.
              </p>
            </div>
          </div>
        )}

        {/* If we have a result, show diagnostic report */}
        {!isAnalyzing && result && (
          <DiagnosticResultView
            result={result}
            images={images}
            onOpenJson={() => setJsonModalOpen(true)}
            onPrint={() => setPrintModalOpen(true)}
          />
        )}

        {/* If no result, show the submission studio */}
        {!isAnalyzing && !result && (
          <div className="space-y-6">
            {/* Introductory Banner */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="max-w-3xl space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  Multimodal Plant Pathology Assistant
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Precise Plant Disease & Stress Diagnostics
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Upload 1 to 5 photos of your affected crop, fruit, or ornamental. AgroVision systematically analyzes foliar lesions, chlorosis patterns, pests, and nutrient deficiencies, differentiating look-alikes to recommend specific organic and conventional treatments.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Species morphology identification
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Differential look-alike elimination
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Quarantine disease detection
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Input Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Image Uploader & Context Notes */}
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
                  <ImageUploader
                    images={images}
                    onChange={setImages}
                    disabled={isAnalyzing}
                  />

                  <ContextForm
                    notes={notes}
                    onChange={setNotes}
                    disabled={isAnalyzing}
                  />

                  {/* Primary Call to Action */}
                  <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {images.length === 0 ? (
                        <span>Upload at least 1 image to begin triage</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          Ready to analyze {images.length} photo(s)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {images.length > 0 && (
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                        >
                          Clear
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={images.length === 0 || isAnalyzing}
                        onClick={() => executeDiagnosis()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-700/20 transition cursor-pointer"
                      >
                        <Microscope className="w-4 h-4" />
                        Run Diagnostic Analysis
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pre-loaded Benchmark Cases */}
                <SampleCaseSelector
                  onSelectCase={handleSelectSample}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Right Column: Pathology Guide & History */}
              <div className="lg:col-span-4 space-y-5">
                {/* 5-Step Methodology Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Methodical Triage Framework
                    </h3>
                  </div>

                  <ol className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span><strong>Plant Identification:</strong> Predicts genus/species from leaf structure & habit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span><strong>Symptom Scan:</strong> Evaluates chlorosis, necrotic halos, wilts, fungal down, pustules & frass.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span><strong>Pattern Matching:</strong> Ranks disease signatures by prevalence & visual match strength.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <span><strong>Differential Elimination:</strong> Distinguishes fungal from bacterial, sunscald & deficiencies.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        5
                      </span>
                      <span><strong>Quality Audit:</strong> Evaluates lighting & resolution, flagging uncertainty honestly.</span>
                    </li>
                  </ol>
                </div>

                {/* Best Practice Photo Tips */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Photography Tips for Growers
                    </h3>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Natural indirect light:</strong> Avoid harsh flash glare or deep shadows.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Leaf underside:</strong> Many fungal spores (downy mildew) hide beneath.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Lesion boundary:</strong> Capture the transition zone between healthy & sick tissue.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Whole canopy:</strong> Shows whether lower, middle, or new growth is impacted.</span>
                    </li>
                  </ul>
                </div>

                {/* Session History (if any) */}
                {history.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Recent Evaluations This Session
                    </h4>
                    <div className="space-y-2">
                      {history.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setResult(item.result);
                            setImages(item.images);
                            setRawJson(JSON.stringify(item.result, null, 2));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 transition flex items-center justify-between text-xs cursor-pointer"
                        >
                          <div className="truncate pr-2">
                            <p className="font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.timestamp} • {item.images.length} photo(s)</p>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold shrink-0">
                            View
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AgroVision • Built on Gemini 3 Pro Vision Architecture</span>
          </p>
          <p className="text-[11px] text-slate-400">
            For agricultural triage & education. Commercial production should corroborate with county extension lab testing.
          </p>
        </div>
      </footer>

      {/* JSON Viewer Modal */}
      <JsonViewerModal
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        result={result}
        rawJson={rawJson}
      />

      {/* Print Report Modal */}
      <PrintReportModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        result={result}
        images={images}
      />
    </div>
  );
}
