export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type SeverityLevel = 'early_stage' | 'moderate' | 'advanced';
export type PathogenType =
  | 'fungal'
  | 'bacterial'
  | 'viral'
  | 'pest'
  | 'nutrient_deficiency'
  | 'environmental'
  | 'unknown';

export type TreatmentType = 'cultural' | 'organic' | 'chemical' | 'biological';

export interface Treatment {
  treatment: string;
  type: TreatmentType;
  application_instructions: string;
}

export interface Diagnosis {
  disease_name: string;
  pathogen_type: PathogenType;
  confidence: ConfidenceLevel;
  severity: SeverityLevel;
  affected_parts: string[];
  symptoms_observed: string[];
  common_symptoms: string[];
  recommended_treatments: Treatment[];
  immediate_actions: string[];
  treatment_duration: string;
  prevention_notes: string;
}

export interface PlantIdentification {
  likely_species: string;
  confidence: ConfidenceLevel;
}

export interface AgroVisionResult {
  plant_identification: PlantIdentification;
  overall_assessment: string;
  image_quality_notes: string | null;
  diagnoses: Diagnosis[];
  differential_notes: string | null;
  when_to_consult_a_professional: string | null;
  follow_up_recommended: boolean;
}

export interface UploadedImage {
  id: string;
  dataUrl: string;
  mimeType: string;
  base64Data: string;
  fileName: string;
  fileSize: number;
  partTag?: string;
}

export interface PlantContextNotes {
  speciesHint?: string;
  location?: string;
  environment?: string;
  weatherRecent?: string;
  symptomOnset?: string;
  wateringHabit?: string;
  additionalNotes?: string;
}
