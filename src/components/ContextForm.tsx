import React, { useState } from 'react';
import { PlantContextNotes } from '../types/pathology';
import { FileText, ChevronDown, ChevronUp, MapPin, CloudSun, Calendar, Droplets } from 'lucide-react';

interface ContextFormProps {
  notes: PlantContextNotes;
  onChange: (notes: PlantContextNotes) => void;
  disabled?: boolean;
}

export const ContextForm: React.FC<ContextFormProps> = ({
  notes,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const updateField = (field: keyof PlantContextNotes, val: string) => {
    onChange({
      ...notes,
      [field]: val,
    });
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between text-left transition cursor-pointer border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-800">
            Grower Field Notes & Environmental Context
          </span>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            Optional but improves accuracy
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Suspected species */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Suspected Plant Species / Cultivar
              </label>
              <input
                type="text"
                placeholder="e.g. San Marzano Tomato, Meyer Lemon, Courgette"
                value={notes.speciesHint || ''}
                disabled={disabled}
                onChange={(e) => updateField('speciesHint', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Location / Zone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Geographic Region or Climate Zone
              </label>
              <input
                type="text"
                placeholder="e.g. USDA Zone 8b, Pacific Northwest, Mediterranean"
                value={notes.location || ''}
                disabled={disabled}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Growing environment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Growing Setting
              </label>
              <select
                value={notes.environment || 'outdoor_garden'}
                disabled={disabled}
                onChange={(e) => updateField('environment', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="outdoor_garden">Outdoor Garden / In-ground</option>
                <option value="raised_bed">Raised Garden Bed</option>
                <option value="greenhouse">Greenhouse / Polytunnel</option>
                <option value="indoor_pot">Patio Container / Indoor Pot</option>
                <option value="hydroponic">Hydroponic / Aeroponic</option>
                <option value="orchard_field">Small-scale Orchard / Field</option>
              </select>
            </div>

            {/* Weather */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                Recent Weather & Humidity
              </label>
              <input
                type="text"
                placeholder="e.g. Heavy rain 3 days ago, high humidity, heat wave 90°F"
                value={notes.weatherRecent || ''}
                disabled={disabled}
                onChange={(e) => updateField('weatherRecent', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Symptom onset */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                When Did Symptoms Appear?
              </label>
              <input
                type="text"
                placeholder="e.g. 4-5 days ago; started on lower leaves"
                value={notes.symptomOnset || ''}
                disabled={disabled}
                onChange={(e) => updateField('symptomOnset', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Watering */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                Watering / Irrigation Method
              </label>
              <input
                type="text"
                placeholder="e.g. Overhead sprinkler daily, drip tape at soil line, hand wand"
                value={notes.wateringHabit || ''}
                disabled={disabled}
                onChange={(e) => updateField('wateringHabit', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Prior Treatments or Fertilizers Applied
              </label>
              <input
                type="text"
                placeholder="e.g. Applied fish emulsion 2 weeks ago; no fungicides yet"
                value={notes.additionalNotes || ''}
                disabled={disabled}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
