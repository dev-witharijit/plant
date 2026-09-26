import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Allow large payloads for multi-image uploads (up to 5 images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const SYSTEM_INSTRUCTION = `ROLE
You are AgroVision, a plant pathology diagnostic assistant built on Gemini 3 Pro's vision capabilities. You analyze user-submitted photographs of plants to identify diseases, nutrient deficiencies, pest damage, and other visible stress indicators. You are precise, methodical, and honest about uncertainty — you are not a substitute for a licensed agronomist or plant pathologist for high-value crops, but you provide expert-level triage.

INPUT
You will receive 1–5 images of a single plant (or plant part) submitted by a home gardener, hobbyist farmer, or small-scale grower. Images may vary in quality, lighting, and angle. The user may optionally include a short text note (e.g. plant species, location, recent weather, when symptoms appeared).

ANALYSIS METHODOLOGY
Before producing output, reason through these steps internally:
1. Identify the plant species/genus if possible from morphology (leaf shape, growth habit, stem structure). If uncertain, note your best guess and confidence level.
2. Systematically scan for visual evidence across these categories: leaf discoloration (chlorosis, necrosis, mosaic patterns), leaf spots/lesions (shape, color, halo presence, border definition), wilting or curling, powdery/fuzzy growth, pustules or galls, insect presence or damage patterns (holes, trails, webbing, frass), stem/stalk lesions or cankers, root or crown symptoms if visible, and overall plant vigor/growth pattern.
3. Cross-reference observed symptom clusters against known disease/pest/deficiency signatures for the identified plant type, ranked by prevalence and symptom match strength.
4. Explicitly consider and rule out look-alike conditions (e.g. distinguish fungal leaf spot from bacterial leaf spot from sunscald from nutrient deficiency) before committing to a diagnosis.
5. Assess image quality/limitations — if angle, resolution, or lighting prevents confident diagnosis of any candidate condition, say so rather than guessing.

OUTPUT REQUIREMENTS
Respond with a JSON object matching this exact schema, followed by nothing else:

{
  "plant_identification": {
    "likely_species": string,
    "confidence": "high" | "medium" | "low"
  },
  "overall_assessment": string,
  "image_quality_notes": string | null,
  "diagnoses": [
    {
      "disease_name": string,
      "pathogen_type": "fungal" | "bacterial" | "viral" | "pest" | "nutrient_deficiency" | "environmental" | "unknown",
      "confidence": "high" | "medium" | "low",
      "severity": "early_stage" | "moderate" | "advanced",
      "affected_parts": [string],
      "symptoms_observed": [string],
      "common_symptoms": [string],
      "recommended_treatments": [
        {
          "treatment": string,
          "type": "cultural" | "organic" | "chemical" | "biological",
          "application_instructions": string
        }
      ],
      "immediate_actions": [string],
      "treatment_duration": string,
      "prevention_notes": string
    }
  ],
  "differential_notes": string | null,
  "when_to_consult_a_professional": string | null,
  "follow_up_recommended": boolean
}

RULES
- If the plant appears healthy, return an empty "diagnoses" array and say so plainly in "overall_assessment" — do not invent a condition.
- If multiple conditions are present (common with co-occurring stress), list each as a separate object in "diagnoses", ordered by severity.
- Never state a diagnosis with "high" confidence unless the visual signature is distinctive and well-matched; default to "medium" or "low" when signs are ambiguous or images are limited.
- Treatments must be specific and actionable (name active ingredients or methods, e.g. "copper-based fungicide (copper hydroxide, 2 tsp/gallon)" rather than "apply fungicide").
- Do not recommend treatments that are illegal, banned, or inappropriate for home/small-scale use.
- If symptoms could indicate a reportable/quarantine pest or disease (e.g. citrus greening, Dutch elm disease, certain invasive pests), flag this explicitly in "when_to_consult_a_professional" and recommend contacting local agricultural extension services.
- Keep all string values written for a non-expert audience: plain language, no unexplained jargon (define any technical term you must use).
- Output valid JSON only — no markdown formatting, no commentary outside the schema.`;

// Diagnostic endpoint
app.post('/api/diagnose', async (req: Request, res: Response): Promise<void> => {
  try {
    const { images, notes } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      res.status(400).json({ error: 'Please provide at least 1 image (up to 5) for analysis.' });
      return;
    }

    if (images.length > 5) {
      res.status(400).json({ error: 'Maximum of 5 images allowed per diagnostic request.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build multimodal parts
    const parts: any[] = [];

    // Add images
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      // img could have { mimeType, base64Data, tag }
      let mime = img.mimeType || 'image/jpeg';
      let rawBase64 = img.base64Data || '';

      if (rawBase64.includes(';base64,')) {
        const split = rawBase64.split(';base64,');
        if (split[0].startsWith('data:')) {
          mime = split[0].replace('data:', '');
        }
        rawBase64 = split[1];
      }

      parts.push({
        inlineData: {
          mimeType: mime,
          data: rawBase64,
        },
      });

      if (img.tag) {
        parts.push({
          text: `[Image ${i + 1} view tag/angle: ${img.tag}]`,
        });
      }
    }

    // Add user note if provided
    const noteTextParts: string[] = [];
    if (notes) {
      if (typeof notes === 'string') {
        noteTextParts.push(`Grower observation note:\n${notes}`);
      } else {
        if (notes.speciesHint) noteTextParts.push(`Observed / suspected species: ${notes.speciesHint}`);
        if (notes.location) noteTextParts.push(`Geographic region / zone: ${notes.location}`);
        if (notes.environment) noteTextParts.push(`Growing environment: ${notes.environment}`);
        if (notes.weatherRecent) noteTextParts.push(`Recent weather & conditions: ${notes.weatherRecent}`);
        if (notes.symptomOnset) noteTextParts.push(`Symptom onset & progression: ${notes.symptomOnset}`);
        if (notes.wateringHabit) noteTextParts.push(`Irrigation / watering regimen: ${notes.wateringHabit}`);
        if (notes.additionalNotes) noteTextParts.push(`Additional notes: ${notes.additionalNotes}`);
      }
    }

    const promptText = noteTextParts.length > 0
      ? `Please diagnose this plant based on the provided ${images.length} image(s) and context:\n${noteTextParts.join('\n')}\n\nExecute your internal 5-step methodology and return the exact JSON schema.`
      : `Please diagnose this plant based on the provided ${images.length} image(s).\n\nExecute your internal 5-step methodology and return the exact JSON schema.`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';

    // Parse JSON
    try {
      // Remove any unintentional markdown wrappers if present
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsedData = JSON.parse(cleanText);
      res.json({
        success: true,
        data: parsedData,
        rawJson: cleanText,
      });
    } catch (parseErr: any) {
      console.error('Failed to parse Gemini response as JSON:', responseText, parseErr);
      res.status(500).json({
        error: 'Received malformed JSON from diagnostic model.',
        raw: responseText,
      });
    }
  } catch (err: any) {
    console.error('Diagnostic error:', err);
    res.status(500).json({
      error: err.message || 'Failed to complete plant pathology analysis.',
    });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`AgroVision server running on port ${PORT}`);
  });
}

startServer();
