import { AgroVisionResult, PlantContextNotes } from '../types/pathology';

export interface SampleCase {
  id: string;
  title: string;
  cropName: string;
  diseaseBadge: string;
  badgeType: 'critical' | 'warning' | 'info' | 'healthy';
  description: string;
  notes: PlantContextNotes;
  images: {
    dataUrl: string;
    mimeType: string;
    base64Data: string;
    tag: string;
  }[];
  precomputedResult: AgroVisionResult;
}

// Generate stylized botanical photographic SVGs encoded as data URLs
function createBotanicalSvg(primaryColor: string, accentColor: string, label: string, detailIcon: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#14281d" />
        <stop offset="100%" stop-color="#0a150e" />
      </radialGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="${accentColor}" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
      </filter>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- Botanical Leaf Structure -->
    <g filter="url(#shadow)" transform="translate(400, 300)">
      <!-- Main Stem -->
      <path d="M -15 280 Q 0 80 10 -220" fill="none" stroke="#2d4a22" stroke-width="14" stroke-linecap="round" />
      
      <!-- Leaf Blade -->
      <path d="M 0 -200 C -180 -120 -280 60 -160 190 C -60 250 60 240 160 170 C 260 50 180 -120 0 -200 Z" 
            fill="url(#leafGrad)" stroke="#1a381c" stroke-width="4" />
            
      <!-- Primary Vein -->
      <path d="M 0 -195 C 10 -40 -10 100 -5 180" fill="none" stroke="#1c4420" stroke-width="6" stroke-linecap="round" />
      <!-- Secondary Lateral Veins -->
      <path d="M 5 -120 Q -90 -90 -160 -110" fill="none" stroke="#1c4420" stroke-width="3.5" />
      <path d="M 5 -120 Q 90 -90 160 -100" fill="none" stroke="#1c4420" stroke-width="3.5" />
      <path d="M 0 -40 Q -110 -20 -190 -15" fill="none" stroke="#1c4420" stroke-width="3.5" />
      <path d="M 0 -40 Q 110 -20 180 -10" fill="none" stroke="#1c4420" stroke-width="3.5" />
      <path d="M -2 40 Q -100 70 -160 100" fill="none" stroke="#1c4420" stroke-width="3.5" />
      <path d="M -2 40 Q 100 70 150 90" fill="none" stroke="#1c4420" stroke-width="3.5" />

      <!-- Pathology detail markings -->
      ${detailIcon}
    </g>

    <!-- Lab Specimen Plate Overlay -->
    <g transform="translate(40, 40)">
      <rect width="320" height="58" rx="8" fill="rgba(10, 25, 16, 0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <circle cx="28" cy="29" r="10" fill="#22c55e" opacity="0.8"/>
      <text x="50" y="27" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f0fdf4">AGROVISION SPECIMEN</text>
      <text x="50" y="45" font-family="system-ui, sans-serif" font-size="12" fill="#86efac">${label}</text>
    </g>

    <!-- Camera / Scale reticle -->
    <circle cx="400" cy="300" r="240" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="8 8" />
    <path d="M 380 300 L 420 300 M 400 280 L 400 320" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
  </svg>`;

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

// Early Blight lesion details (concentric rings, bullseye pattern)
const earlyBlightDetail = `
  <!-- Concentric necrotic lesions with chlorotic yellow halo -->
  <g transform="translate(-60, -30)">
    <circle cx="0" cy="0" r="54" fill="#eab308" opacity="0.35" />
    <circle cx="0" cy="0" r="42" fill="#713f12" />
    <circle cx="0" cy="0" r="32" fill="none" stroke="#451a03" stroke-width="4" />
    <circle cx="0" cy="0" r="22" fill="none" stroke="#291002" stroke-width="3" />
    <circle cx="0" cy="0" r="12" fill="#1c0b02" />
  </g>
  <g transform="translate(70, 60)">
    <circle cx="0" cy="0" r="45" fill="#eab308" opacity="0.3" />
    <circle cx="0" cy="0" r="35" fill="#713f12" />
    <circle cx="0" cy="0" r="24" fill="none" stroke="#451a03" stroke-width="3" />
    <circle cx="0" cy="0" r="14" fill="#291002" />
  </g>
  <g transform="translate(-110, 80)">
    <circle cx="0" cy="0" r="28" fill="#854d0e" />
    <circle cx="0" cy="0" r="18" fill="none" stroke="#3b1d07" stroke-width="2.5" />
  </g>
`;

// Citrus greening detail (asymmetric blotchy mottle)
const citrusGreeningDetail = `
  <!-- Asymmetrical chlorotic blotches across veins -->
  <path d="M -120 -80 Q -30 -120 40 -60 Q 90 20 10 70 Q -80 60 -130 -20 Z" fill="#ca8a04" opacity="0.55" />
  <path d="M 20 -100 Q 100 -60 120 40 Q 60 80 10 30 Z" fill="#eab308" opacity="0.4" />
  <path d="M -140 10 Q -60 40 -90 120 Q -150 100 -160 50 Z" fill="#a16207" opacity="0.5" />
  <!-- Thickened corky vein -->
  <path d="M 0 -195 C 15 -40 -5 100 -5 180" fill="none" stroke="#ca8a04" stroke-width="9" stroke-linecap="round" opacity="0.85" />
`;

// Powdery mildew detail (white powdery patches)
const powderyMildewDetail = `
  <!-- Talc-like white fungal colonies on upper surface -->
  <g transform="translate(-50, -40)" filter="url(#shadow)">
    <circle cx="0" cy="0" r="50" fill="#f8fafc" opacity="0.82" />
    <circle cx="10" cy="15" r="35" fill="#e2e8f0" opacity="0.9" />
  </g>
  <g transform="translate(60, 40)">
    <ellipse cx="0" cy="0" rx="65" ry="45" fill="#f8fafc" opacity="0.85" />
    <circle cx="-15" cy="-5" r="28" fill="#ffffff" opacity="0.95" />
  </g>
  <g transform="translate(-90, 70)">
    <circle cx="0" cy="0" r="38" fill="#f1f5f9" opacity="0.75" />
  </g>
  <g transform="translate(40, -100)">
    <ellipse cx="0" cy="0" rx="40" ry="25" fill="#f8fafc" opacity="0.8" />
  </g>
`;

// Iron chlorosis detail (interveinal yellowing with dark green veins)
const ironChlorosisDetail = `
  <!-- Bright yellow leaf tissue between dark veins -->
  <path d="M 0 -200 C -180 -120 -280 60 -160 190 C -60 250 60 240 160 170 C 260 50 180 -120 0 -200 Z" 
        fill="#facc15" opacity="0.65" />
  <!-- Retained dark green primary and lateral veins -->
  <path d="M 0 -195 C 10 -40 -10 100 -5 180" fill="none" stroke="#15803d" stroke-width="10" stroke-linecap="round" />
  <path d="M 5 -120 Q -90 -90 -160 -110" fill="none" stroke="#15803d" stroke-width="6" />
  <path d="M 5 -120 Q 90 -90 160 -100" fill="none" stroke="#15803d" stroke-width="6" />
  <path d="M 0 -40 Q -110 -20 -190 -15" fill="none" stroke="#15803d" stroke-width="6" />
  <path d="M 0 -40 Q 110 -20 180 -10" fill="none" stroke="#15803d" stroke-width="6" />
  <path d="M -2 40 Q -100 70 -160 100" fill="none" stroke="#15803d" stroke-width="5" />
  <path d="M -2 40 Q 100 70 150 90" fill="none" stroke="#15803d" stroke-width="5" />
`;

// Healthy strawberry / pepper leaf (pristine deep green, zero lesions)
const healthyDetail = `
  <!-- Subtle natural gloss sheen -->
  <ellipse cx="-40" cy="-60" rx="80" ry="120" fill="rgba(255,255,255,0.08)" transform="rotate(-25 -40 -60)" />
  <ellipse cx="50" cy="30" rx="60" ry="90" fill="rgba(255,255,255,0.06)" transform="rotate(20 50 30)" />
`;

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'tomato-early-blight',
    title: 'Tomato Lower Foliage Collapse',
    cropName: 'Solanum lycopersicum (Tomato)',
    diseaseBadge: 'Early Blight (Alternaria solani)',
    badgeType: 'warning',
    description: 'Target-like concentric rings with chlorotic yellow halo on lower older foliage following humid rain.',
    notes: {
      speciesHint: 'Roma Tomato (Solanum lycopersicum)',
      location: 'Suburban raised bed, Zone 7b',
      environment: 'outdoor_garden',
      weatherRecent: 'Heavy thunderstorms 4 days ago, followed by humid 82°F (28°C) heat.',
      symptomOnset: 'Started on lowest leaves 1 week ago and is progressing upward toward flowering clusters.',
      wateringHabit: 'Overhead sprinkler every other morning.',
      additionalNotes: 'Plant is 65 days old, lower leaves yellowing and dropping rapidly.',
    },
    images: [
      {
        dataUrl: createBotanicalSvg('#3f6212', '#1e3a8a', 'Solanum lycopersicum - Lower Leaf Lesion', earlyBlightDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#3f6212', '#1e3a8a', 'Solanum lycopersicum - Lower Leaf Lesion', earlyBlightDetail).split(',')[1],
        tag: 'Lower leaf close-up with target spot',
      },
      {
        dataUrl: createBotanicalSvg('#4d7c0f', '#14532d', 'Solanum lycopersicum - Stem & Petiole Node', earlyBlightDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#4d7c0f', '#14532d', 'Solanum lycopersicum - Stem & Petiole Node', earlyBlightDetail).split(',')[1],
        tag: 'Petiole junction and chlorotic margin',
      },
    ],
    precomputedResult: {
      plant_identification: {
        likely_species: 'Solanum lycopersicum (Tomato)',
        confidence: 'high',
      },
      overall_assessment:
        'The specimen exhibits classic Early Blight caused by Alternaria solani, characterized by dark brown concentric lesions bordered by prominent chlorotic yellow halos on lower leaves. Prompt pruning and protective copper sprays will prevent canopy progression.',
      image_quality_notes: null,
      diagnoses: [
        {
          disease_name: 'Early Blight (Alternaria solani)',
          pathogen_type: 'fungal',
          confidence: 'high',
          severity: 'moderate',
          affected_parts: ['lower leaves', 'petioles'],
          symptoms_observed: [
            'Distinctive concentric ring ("bullseye" target) necrotic lesions on leaf lamina',
            'Bright chlorotic (yellow) halo surrounding necrotic lesions',
            'Senescence and upward curling of basal leaflets',
          ],
          common_symptoms: [
            'Circular brown spots with target-like rings on older leaves first',
            'Yellowing of surrounding leaf tissue leading to premature leaf drop',
            'Dark collar rot lesions on lower stems and sunken leathery rot on fruit shoulders',
          ],
          recommended_treatments: [
            {
              treatment: 'Sanitation and lower canopy clearance',
              type: 'cultural',
              application_instructions:
                'Prune off all affected lower leaves up to 12 inches above the soil line using sterilized shears. Bag and dispose of clippings in municipal waste; do not compost.',
            },
            {
              treatment: 'Drip irrigation & soil splash barrier',
              type: 'cultural',
              application_instructions:
                'Cease overhead sprinkler watering immediately. Apply a 2-3 inch layer of clean straw or wood chip mulch over bare soil to prevent fungal spores from splashing onto leaves during rain.',
            },
            {
              treatment: 'Copper-based liquid fungicide (Copper Octanoate or Copper Hydroxide)',
              type: 'organic',
              application_instructions:
                'Apply liquid copper fungicide at 2 to 3 fluid ounces per gallon of water (follow manufacturer label). Spray thorough coverage on both upper and lower leaf surfaces in early morning or late evening every 7 to 10 days until dry weather returns.',
            },
            {
              treatment: 'Bacillus amyloliquefaciens (Bio-fungicide strain D747)',
              type: 'biological',
              application_instructions:
                'Apply preventive bio-fungicide spray weekly as an alternate rotation with copper to suppress fungal spore germination on new upper foliage.',
            },
          ],
          immediate_actions: [
            'Prune and discard all yellowing and spotted lower leaves today.',
            'Disinfect pruning shears in 70% isopropyl alcohol between cuts.',
            'Switch watering from overhead sprinklers to soil-level drip or soaker hose.',
            'Apply straw mulch beneath the plant to stop soil splashback.',
          ],
          treatment_duration: '7–10 days to arrest lesion spread; new upper foliage should remain clean over 3–4 weeks',
          prevention_notes:
            'Rotate tomato crop families (Solanaceae) on a 3-year cycle. Stake or cage plants to maintain upright airflow. Ensure minimum 30-inch spacing between indeterminate plants.',
        },
      ],
      differential_notes:
        'Ruled out Septoria Leaf Spot (Septoria lycopersici) because lesions lack the characteristic tan/gray fungal centers peppered with tiny black pycnidia specks, and instead feature prominent concentric bullseye rings. Ruled out Late Blight (Phytophthora infestans) due to the absence of water-soaked greasy gray lesions with white fungal down on leaf undersides.',
      when_to_consult_a_professional: null,
      follow_up_recommended: true,
    },
  },
  {
    id: 'citrus-greening-hlb',
    title: 'Citrus Greening (HLB Quarantine Alert)',
    cropName: 'Citrus x sinensis (Sweet Orange / Citrus)',
    diseaseBadge: 'Huanglongbing / Citrus Greening',
    badgeType: 'critical',
    description: 'Asymmetric blotchy mottle chlorosis, enlarged corky veins, and twig dieback on backyard citrus.',
    notes: {
      speciesHint: 'Citrus (Sweet Orange or Valencia)',
      location: 'Backyard residential yard, Florida / Gulf Coast region',
      environment: 'outdoor_garden',
      weatherRecent: 'Subtropical warm climate, high humidity and intermittent showers.',
      symptomOnset: 'Leaf pattern appeared over the last 2 months; fruit produced last season was lopsided and sour.',
      wateringHabit: 'Automated lawn sprinkler twice a week.',
      additionalNotes: 'Small jumping winged insects noticed occasionally on new flush.',
    },
    images: [
      {
        dataUrl: createBotanicalSvg('#84cc16', '#a16207', 'Citrus spp. - Asymmetric Mottle', citrusGreeningDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#84cc16', '#a16207', 'Citrus spp. - Asymmetric Mottle', citrusGreeningDetail).split(',')[1],
        tag: 'Blotchy mottle crossing leaf midvein',
      },
    ],
    precomputedResult: {
      plant_identification: {
        likely_species: 'Citrus × sinensis (Sweet Orange / Citrus)',
        confidence: 'high',
      },
      overall_assessment:
        'CRITICAL ALERT: The specimen shows strong morphological indicators of Citrus Greening (Huanglongbing / HLB), a severe bacterial disease vectored by the Asian Citrus Psyllid. This is a regulated quarantine disease with no known home cure.',
      image_quality_notes:
        'Single leaf specimen provided. An inspection of fruit symmetry and root system would provide complete confirmation.',
      diagnoses: [
        {
          disease_name: 'Huanglongbing / Citrus Greening (Candidatus Liberibacter asiaticus)',
          pathogen_type: 'bacterial',
          confidence: 'medium',
          severity: 'advanced',
          affected_parts: ['leaves', 'vascular phloem', 'twigs'],
          symptoms_observed: [
            'Asymmetrical blotchy mottle chlorosis that crosses the main leaf midrib',
            'Vein corking and yellow discoloration of the central vein',
            'Uneven leaf yellowing without bilateral symmetry',
          ],
          common_symptoms: [
            'Asymmetric yellow mottling across leaf veins (unlike symmetrical nutrient deficiencies)',
            'Thickened, corky veins and twig dieback',
            'Small, misshapen, lopsided fruit that remain green at stylar end and have a bitter/salty taste',
            'Premature fruit drop and progressive tree decline',
          ],
          recommended_treatments: [
            {
              treatment: 'Vector control for Asian Citrus Psyllid (Diaphorina citri)',
              type: 'chemical',
              application_instructions:
                'If psyllid nymphs or adults are present on young flush shoots, apply insecticidal soap or horticultural oil (1% to 2% solution) to suppress the vector population.',
            },
            {
              treatment: 'Foliar micronutrient supplementation (Temporary vigor support)',
              type: 'cultural',
              application_instructions:
                'Apply balanced citrus nutritional spray containing chelated iron, zinc, and manganese to mitigate phloem blockage symptoms while awaiting official diagnosis.',
            },
          ],
          immediate_actions: [
            'Do NOT transport plant cuttings, budwood, or fruit outside your local area.',
            'Examine new flush shoots for tiny brown psyllids feeding at a 45-degree angle.',
            'Photograph the entire canopy and submit images to your state Department of Agriculture or University Extension Service.',
          ],
          treatment_duration: 'Incurable systemic bacterial disease; requires containment and vector mitigation',
          prevention_notes:
            'Only purchase certified disease-free nursery stock from registered indoor screenhouses. Monitor regularly for Asian Citrus Psyllid vectors.',
        },
      ],
      differential_notes:
        'Distinguished from Zinc or Iron deficiency chlorosis because HLB creates an asymmetrical blotch where one half of the leaf blade yellows independently of the opposite side. Nutritional chlorosis is bilaterally symmetrical across the midrib.',
      when_to_consult_a_professional:
        'MANDATORY EXTENSION CONTACT: Citrus Greening is a federally and state-regulated quarantine plant disease. Homeowners in citrus-producing regions (e.g. Florida, Texas, California) should contact their local County Agricultural Extension Office or State Department of Agriculture immediately for official PCR confirmation.',
      follow_up_recommended: true,
    },
  },
  {
    id: 'cucurbit-powdery-mildew',
    title: 'Zucchini Powdery Mildew',
    cropName: 'Cucurbita pepo (Zucchini / Squash)',
    diseaseBadge: 'Powdery Mildew (Podosphaera xanthii)',
    badgeType: 'warning',
    description: 'White talcum-powder circular fungal colonies expanding across the upper leaf surface of summer squash.',
    notes: {
      speciesHint: 'Zucchini Squash (Cucurbita pepo)',
      location: 'Community garden plot',
      environment: 'outdoor_garden',
      weatherRecent: 'Warm dry days (78°F) with cool foggy nights.',
      symptomOnset: 'Started as tiny flour-like dust specks 5 days ago, now merging into large patches.',
      wateringHabit: 'Hand hose at base in evening.',
    },
    images: [
      {
        dataUrl: createBotanicalSvg('#166534', '#065f46', 'Cucurbita pepo - Powdery Colonies', powderyMildewDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#166534', '#065f46', 'Cucurbita pepo - Powdery Colonies', powderyMildewDetail).split(',')[1],
        tag: 'Upper leaf surface powdery fungal mycelium',
      },
    ],
    precomputedResult: {
      plant_identification: {
        likely_species: 'Cucurbita pepo (Zucchini / Summer Squash)',
        confidence: 'high',
      },
      overall_assessment:
        'The plant exhibits moderate Powdery Mildew caused by Podosphaera xanthii. The white powdery patches are actively colonizing the upper leaf surface and can be quickly managed with potassium bicarbonate or horticultural neem spray.',
      image_quality_notes: null,
      diagnoses: [
        {
          disease_name: 'Powdery Mildew (Podosphaera xanthii / Erysiphe cichoracearum)',
          pathogen_type: 'fungal',
          confidence: 'high',
          severity: 'moderate',
          affected_parts: ['upper leaves', 'petioles'],
          symptoms_observed: [
            'Circular white, powdery fungal colonies on adaxial (upper) leaf surface',
            'Slight yellowing of leaf tissue beneath fungal pads',
            'Coalescence of fungal colonies into large powdery blankets',
          ],
          common_symptoms: [
            'White superficial fungal mycelium and conidiospores resembling talcum powder',
            'Premature leaf senescence and crisping under sun exposure',
            'Sunscald on exposed developing squash fruit due to leaf loss',
          ],
          recommended_treatments: [
            {
              treatment: 'Potassium Bicarbonate (or horticultural baking soda spray)',
              type: 'organic',
              application_instructions:
                'Mix 1 tablespoon potassium bicarbonate (or sodium bicarbonate) and 1 teaspoon liquid castile soap per gallon of clean water. Spray thoroughly on both leaf sides in early evening.',
            },
            {
              treatment: 'Clarified hydrophobic neem oil (70% extract)',
              type: 'organic',
              application_instructions:
                'Mix 2 tablespoons neem oil per gallon of water with a mild emulsifier. Coat foliage thoroughly. Do not apply when temperatures exceed 85°F (29°C) to avoid leaf burn.',
            },
            {
              treatment: 'Selective thinning for airflow',
              type: 'cultural',
              application_instructions:
                'Prune out the oldest, heavily infested lower leaves to open the plant center and maximize air circulation and sunlight penetration.',
            },
          ],
          immediate_actions: [
            'Prune off heavily colonized leaves (over 50% covered) and discard in trash.',
            'Apply potassium bicarbonate or neem spray this evening.',
            'Ensure adjacent squash plants have adequate spacing.',
          ],
          treatment_duration: '5–7 days to halt active sporulation; repeat spray every 7 days for 3 weeks',
          prevention_notes:
            'Choose PMR (Powdery Mildew Resistant) seed varieties next season. Plant in full all-day sun (6+ hours) and maintain wide row spacing.',
        },
      ],
      differential_notes:
        'Easily distinguished from Downy Mildew (Pseudoperonospora cubensis), which produces angular yellow lesions strictly bound by leaf veins with purplish-gray spores restricted to the underside of the leaf.',
      when_to_consult_a_professional: null,
      follow_up_recommended: true,
    },
  },
  {
    id: 'citrus-iron-chlorosis',
    title: 'Lemon Tree Interveinal Chlorosis',
    cropName: 'Citrus limon (Meyer Lemon)',
    diseaseBadge: 'Iron / Micronutrient Chlorosis',
    badgeType: 'info',
    description: 'Striking yellowing between green veins on newest leaf flush caused by high soil pH or root stress.',
    notes: {
      speciesHint: 'Meyer Lemon (Citrus limon)',
      location: 'Container on sunny patio, Zone 9',
      environment: 'indoor_pot',
      weatherRecent: 'Sunny, warm, tap water used with high mineral hardness (alkaline).',
      symptomOnset: 'New leaves emerged pale yellow over the past 3 weeks.',
      wateringHabit: 'Watered daily; saucer kept full.',
    },
    images: [
      {
        dataUrl: createBotanicalSvg('#15803d', '#ca8a04', 'Citrus limon - Interveinal Chlorosis', ironChlorosisDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#15803d', '#ca8a04', 'Citrus limon - Interveinal Chlorosis', ironChlorosisDetail).split(',')[1],
        tag: 'New growth interveinal chlorosis pattern',
      },
    ],
    precomputedResult: {
      plant_identification: {
        likely_species: 'Citrus limon (Meyer Lemon)',
        confidence: 'high',
      },
      overall_assessment:
        'The plant displays classic Iron (Fe) Deficiency Chlorosis. There is no active infectious pathogen; the symptom is an abiotic physiological disorder commonly caused by alkaline soil pH or waterlogged potting media locking out iron uptake.',
      image_quality_notes: null,
      diagnoses: [
        {
          disease_name: 'Iron (Fe) Deficiency Chlorosis',
          pathogen_type: 'nutrient_deficiency',
          confidence: 'high',
          severity: 'moderate',
          affected_parts: ['youngest leaves', 'new flush'],
          symptoms_observed: [
            'Interveinal chlorosis: bright yellow leaf lamina with dark green vascular veins remaining sharply defined',
            'Symptom predominantly localized on the newest terminal flush shoots',
            'Leaf size slightly reduced on affected growth',
          ],
          common_symptoms: [
            'Yellowing between veins on new growth (iron is immobile in plant tissue)',
            'In severe cases, entire new leaves turn ivory-white and develop necrotic margins',
          ],
          recommended_treatments: [
            {
              treatment: 'Chelated Iron (Fe-EDDHA or Fe-DTPA)',
              type: 'chemical',
              application_instructions:
                'Apply chelated iron soil drench according to packaging (e.g. 1 teaspoon per gallon of water). Fe-EDDHA is particularly effective if soil pH is above 7.0.',
            },
            {
              treatment: 'Pot drainage and root aeration adjustment',
              type: 'cultural',
              application_instructions:
                'Empty the standing drainage saucer immediately. Citrus roots require oxygen to assimilate iron; allow top 2 inches of potting mix to dry between waterings.',
            },
            {
              treatment: 'Acidifying citrus fertilizer',
              type: 'organic',
              application_instructions:
                'Switch to a formulated citrus fertilizer with sulfur to gradually bring potting mix pH down into the ideal 5.8 to 6.5 range.',
            },
          ],
          immediate_actions: [
            'Drain excess water from the container saucer.',
            'Apply a soil drench of chelated iron.',
            'Verify drainage holes in the container are unclogged.',
          ],
          treatment_duration: '10–14 days for new flush to green up; existing bleached leaves will partially recover',
          prevention_notes:
            'Use rainwater or acidified water if municipal tap water has high alkalinity. Repot every 2 years in coarse, well-draining citrus/cactus potting bark mix.',
        },
      ],
      differential_notes:
        'Distinguished from Nitrogen deficiency because Nitrogen is mobile, meaning nitrogen deficiency causes overall yellowing of oldest lower leaves first. Iron deficiency is immobile and appears strictly on the newest upper leaves with dark green veins intact. Distinguished from HLB / Citrus Greening because this pattern is bilaterally symmetrical across the midrib.',
      when_to_consult_a_professional: null,
      follow_up_recommended: true,
    },
  },
  {
    id: 'healthy-strawberry',
    title: 'Healthy Strawberry Specimen',
    cropName: 'Fragaria × ananassa (Garden Strawberry)',
    diseaseBadge: 'Healthy / No Pathogens Detected',
    badgeType: 'healthy',
    description: 'Vibrant trifoliate leaves with robust green color, uniform serrated margins, and zero lesions.',
    notes: {
      speciesHint: 'Strawberry (Fragaria × ananassa)',
      location: 'Raised cedar garden bed',
      environment: 'outdoor_garden',
      weatherRecent: 'Temperate spring weather (68°F), gentle morning sun.',
      symptomOnset: 'No noticeable symptoms; routine health check.',
      wateringHabit: 'Drip line once every two days.',
    },
    images: [
      {
        dataUrl: createBotanicalSvg('#15803d', '#166534', 'Fragaria - Healthy Specimen', healthyDetail),
        mimeType: 'image/svg+xml',
        base64Data: createBotanicalSvg('#15803d', '#166534', 'Fragaria - Healthy Specimen', healthyDetail).split(',')[1],
        tag: 'Crown and trifoliate leaf lamina',
      },
    ],
    precomputedResult: {
      plant_identification: {
        likely_species: 'Fragaria × ananassa (Garden Strawberry)',
        confidence: 'high',
      },
      overall_assessment:
        'The plant appears completely healthy with no visual evidence of fungal, bacterial, viral, or pest damage. Leaf vigor, pigmentation, and cellular turgor are excellent.',
      image_quality_notes: null,
      diagnoses: [],
      differential_notes: null,
      when_to_consult_a_professional: null,
      follow_up_recommended: false,
    },
  },
];
