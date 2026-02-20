import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface FilteredSummaryViewProps {
  formData: AnamneseFormData;
}

// Helper to check if an object has any true boolean values or non-empty strings
const hasFilledData = (obj: any): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'boolean' && value === true) return true;
    if (typeof value === 'string' && value.trim() !== '') return true;
    if (typeof value === 'object' && hasFilledData(value)) return true;
  }
  return false;
};

// Helper to extract filled fields from an object
const getFilledFields = (obj: any, language: string): string[] => {
  const fields: string[] = [];
  if (!obj || typeof obj !== 'object') return fields;
  
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (key === 'ja' && value === true) continue; // Skip the trigger checkbox
    if (key === 'sonstige' && typeof value === 'string' && value.trim()) {
      fields.push(`${language === 'de' ? 'Sonstiges' : 'Other'}: ${value}`);
    } else if (typeof value === 'boolean' && value === true) {
      fields.push(formatFieldName(key, language));
    } else if (typeof value === 'string' && value.trim() && key !== 'ja') {
      fields.push(`${formatFieldName(key, language)}: ${value}`);
    } else if (typeof value === 'object' && value !== null) {
      const nestedFields = getFilledFields(value, language);
      fields.push(...nestedFields);
    }
  }
  return fields;
};

// Format field names for display
const formatFieldName = (key: string, language: string): string => {
  // Field mappings with ICD-10 codes for medical conditions
  const fieldMappings: Record<string, { de: string; en: string; icd?: string }> = {
    // General (no ICD)
    jahr: { de: 'Jahr', en: 'Year' },
    seit: { de: 'Seit', en: 'Since' },
    psa: { de: 'PSA-Wert', en: 'PSA Value' },

    // Men's health
    bph: { de: 'Gutartige Vergrößerung (BPH)', en: 'Benign Prostatic Hyperplasia', icd: 'N40' },
    prostatitis: { de: 'Prostatitis', en: 'Prostatitis', icd: 'N41.0' },
    prostatakarzinom: { de: 'Prostatakarzinom', en: 'Prostate Cancer', icd: 'C61' },
    hodenentzuendung: { de: 'Hodenentzündung', en: 'Orchitis', icd: 'N45' },
    hodentorsion: { de: 'Hodentorsion', en: 'Testicular Torsion', icd: 'N44' },
    hodenkrebs: { de: 'Hodenkrebs', en: 'Testicular Cancer', icd: 'C62' },
    varikozele: { de: 'Varikozele', en: 'Varicocele', icd: 'I86.1' },
    hydrozele: { de: 'Hydrozele', en: 'Hydrocele', icd: 'N43' },
    epididymitis: { de: 'Nebenhodenentzündung', en: 'Epididymitis', icd: 'N45.1' },
    nebenhodenzyste: { de: 'Nebenhodenzyste', en: 'Spermatocele', icd: 'N43.4' },
    erektileDysfunktion: { de: 'Erektile Dysfunktion', en: 'Erectile Dysfunction', icd: 'N48.4' },

    // Allergies
    pollen: { de: 'Pollenallergie', en: 'Pollen Allergy', icd: 'J30.1' },
    staub: { de: 'Hausstauballergie', en: 'House Dust Allergy', icd: 'J30.4' },
    tierhaare: { de: 'Tierhaarallergie', en: 'Animal Hair Allergy', icd: 'J30.4' },
    schimmel: { de: 'Schimmelpilzallergie', en: 'Mold Allergy', icd: 'J30.4' },
    nickel: { de: 'Nickelallergie', en: 'Nickel Allergy', icd: 'L23.0' },
    latex: { de: 'Latexallergie', en: 'Latex Allergy', icd: 'L23.4' },
    nahrungsmittel: { de: 'Nahrungsmittelallergie', en: 'Food Allergy', icd: 'T78.1' },
    medikamente: { de: 'Medikamentenallergie', en: 'Drug Allergy', icd: 'T88.7' },
    insektenstiche: { de: 'Insektengiftallergie', en: 'Insect Venom Allergy', icd: 'T63.4' },
    kontaktallergie: { de: 'Kontaktallergie', en: 'Contact Allergy', icd: 'L23.9' },

    // Heart & Circulation
    herzinfarkt: { de: 'Herzinfarkt', en: 'Heart Attack', icd: 'I21' },
    bluthochdruck: { de: 'Bluthochdruck', en: 'High Blood Pressure', icd: 'I10' },
    herzrhythmusstoerung: { de: 'Herzrhythmusstörung', en: 'Arrhythmia', icd: 'I49.9' },
    koronareHerzkrankheit: { de: 'Koronare Herzkrankheit', en: 'Coronary Heart Disease', icd: 'I25.9' },
    herzinsuffizienz: { de: 'Herzinsuffizienz', en: 'Heart Failure', icd: 'I50.9' },
    herzklappenerkrankung: { de: 'Herzklappenerkrankung', en: 'Valvular Heart Disease', icd: 'I08' },
    angina: { de: 'Angina pectoris', en: 'Angina Pectoris', icd: 'I20.9' },
    myokarditis: { de: 'Myokarditis', en: 'Myocarditis', icd: 'I40.9' },
    perikarditis: { de: 'Perikarditis', en: 'Pericarditis', icd: 'I30.9' },
    thrombose: { de: 'Thrombose', en: 'Thrombosis', icd: 'I80.9' },
    schlaganfall: { de: 'Schlaganfall', en: 'Stroke', icd: 'I64' },
    pavk: { de: 'Periphere Verschlusskrankheit', en: 'Peripheral Artery Disease', icd: 'I73.9' },
    niedrigerBlutdruck: { de: 'Niedriger Blutdruck', en: 'Hypotension', icd: 'I95.9' },
    krampfadern: { de: 'Krampfadern', en: 'Varicose Veins', icd: 'I83.9' },

    // Lung & Breathing
    asthma: { de: 'Asthma bronchiale', en: 'Bronchial Asthma', icd: 'J45' },
    copd: { de: 'COPD', en: 'COPD', icd: 'J44' },
    bronchitis: { de: 'Chronische Bronchitis', en: 'Chronic Bronchitis', icd: 'J42' },
    lungenentzuendung: { de: 'Lungenentzündung', en: 'Pneumonia', icd: 'J18.9' },
    lungenemphysem: { de: 'Lungenemphysem', en: 'Pulmonary Emphysema', icd: 'J43.9' },
    lungenembolie: { de: 'Lungenembolie', en: 'Pulmonary Embolism', icd: 'I26.9' },
    tuberkulose: { de: 'Tuberkulose', en: 'Tuberculosis', icd: 'A16.9' },
    sarkoidose: { de: 'Sarkoidose', en: 'Sarcoidosis', icd: 'D86.9' },
    lungenfibrose: { de: 'Lungenfibrose', en: 'Pulmonary Fibrosis', icd: 'J84.1' },
    pleuritis: { de: 'Rippenfellentzündung', en: 'Pleurisy', icd: 'R09.1' },
    pneumothorax: { de: 'Pneumothorax', en: 'Pneumothorax', icd: 'J93.9' },
    schlafapnoe: { de: 'Schlafapnoe', en: 'Sleep Apnea', icd: 'G47.3' },
    husten: { de: 'Chronischer Husten', en: 'Chronic Cough', icd: 'R05' },
    atemnot: { de: 'Atemnot (Dyspnoe)', en: 'Shortness of Breath', icd: 'R06.0' },

    // Stomach & Intestines
    gastritis: { de: 'Gastritis', en: 'Gastritis', icd: 'K29.7' },
    magengeschwuer: { de: 'Magengeschwür', en: 'Gastric Ulcer', icd: 'K25.9' },
    reflux: { de: 'Refluxkrankheit', en: 'Gastroesophageal Reflux', icd: 'K21.0' },
    reizdarm: { de: 'Reizdarmsyndrom', en: 'Irritable Bowel Syndrome', icd: 'K58.9' },
    morbusCrohn: { de: 'Morbus Crohn', en: "Crohn's Disease", icd: 'K50' },
    colitisUlcerosa: { de: 'Colitis ulcerosa', en: 'Ulcerative Colitis', icd: 'K51' },
    divertikulitis: { de: 'Divertikulitis', en: 'Diverticulitis', icd: 'K57.9' },
    zoeliakie: { de: 'Zöliakie', en: 'Celiac Disease', icd: 'K90.0' },
    verstopfung: { de: 'Chronische Verstopfung', en: 'Chronic Constipation', icd: 'K59.0' },
    durchfall: { de: 'Chronischer Durchfall', en: 'Chronic Diarrhea', icd: 'K59.1' },
    haemorrhoiden: { de: 'Hämorrhoiden', en: 'Hemorrhoids', icd: 'K64.9' },
    laktoseintoleranz: { de: 'Laktoseintoleranz', en: 'Lactose Intolerance', icd: 'E73.9' },
    fruktoseintoleranz: { de: 'Fruktoseintoleranz', en: 'Fructose Intolerance', icd: 'E74.1' },
    histaminintoleranz: { de: 'Histaminintoleranz', en: 'Histamine Intolerance', icd: 'T78.1' },

    // Liver & Gallbladder
    hepatitisA: { de: 'Hepatitis A', en: 'Hepatitis A', icd: 'B15' },
    hepatitisB: { de: 'Hepatitis B', en: 'Hepatitis B', icd: 'B16' },
    hepatitisC: { de: 'Hepatitis C', en: 'Hepatitis C', icd: 'B17.1' },
    fettleber: { de: 'Fettleber', en: 'Fatty Liver', icd: 'K76.0' },
    leberzirrhose: { de: 'Leberzirrhose', en: 'Liver Cirrhosis', icd: 'K74.6' },
    gallensteine: { de: 'Gallensteine', en: 'Gallstones', icd: 'K80' },
    gallenblasenentzuendung: { de: 'Gallenblasenentzündung', en: 'Cholecystitis', icd: 'K81.9' },
    gilbertSyndrom: { de: 'Gilbert-Syndrom', en: 'Gilbert Syndrome', icd: 'E80.4' },

    // Kidney & Bladder
    nierensteine: { de: 'Nierensteine', en: 'Kidney Stones', icd: 'N20.0' },
    harnwegsinfekt: { de: 'Harnwegsinfektion', en: 'Urinary Tract Infection', icd: 'N39.0' },
    blasenentzuendung: { de: 'Blasenentzündung', en: 'Cystitis', icd: 'N30.9' },
    niereninsuffizienz: { de: 'Niereninsuffizienz', en: 'Renal Insufficiency', icd: 'N18.9' },
    nierenbeckenentzuendung: { de: 'Nierenbeckenentzündung', en: 'Pyelonephritis', icd: 'N10' },
    inkontinenz: { de: 'Inkontinenz', en: 'Incontinence', icd: 'R32' },
    reizblase: { de: 'Reizblase', en: 'Overactive Bladder', icd: 'N32.8' },

    // Hormonal Health
    schilddruesenunterfunktion: { de: 'Schilddrüsenunterfunktion', en: 'Hypothyroidism', icd: 'E03.9' },
    schilddruesenueberfunktion: { de: 'Schilddrüsenüberfunktion', en: 'Hyperthyroidism', icd: 'E05.9' },
    hashimoto: { de: 'Hashimoto-Thyreoiditis', en: "Hashimoto's Thyroiditis", icd: 'E06.3' },
    morbusBasedow: { de: 'Morbus Basedow', en: "Graves' Disease", icd: 'E05.0' },
    diabetesTyp1: { de: 'Diabetes Typ 1', en: 'Type 1 Diabetes', icd: 'E10' },
    diabetesTyp2: { de: 'Diabetes Typ 2', en: 'Type 2 Diabetes', icd: 'E11' },
    nebenniereninsuffizienz: { de: 'Nebenniereninsuffizienz', en: 'Adrenal Insufficiency', icd: 'E27.4' },
    pcos: { de: 'Polyzystisches Ovarialsyndrom', en: 'PCOS', icd: 'E28.2' },
    osteoporose: { de: 'Osteoporose', en: 'Osteoporosis', icd: 'M81.9' },
    cushing: { de: 'Cushing-Syndrom', en: "Cushing's Syndrome", icd: 'E24.9' },

    // Head, Senses & Nervous System
    migraene: { de: 'Migräne', en: 'Migraine', icd: 'G43.9' },
    trigeminus: { de: 'Trigeminusneuralgie', en: 'Trigeminal Neuralgia', icd: 'G50.0' },
    tinnitus: { de: 'Tinnitus', en: 'Tinnitus', icd: 'H93.1' },
    schwindel: { de: 'Schwindel', en: 'Vertigo', icd: 'R42' },
    epilepsie: { de: 'Epilepsie', en: 'Epilepsy', icd: 'G40.9' },
    parkinson: { de: 'Parkinson', en: "Parkinson's Disease", icd: 'G20' },
    multipleSklerose: { de: 'Multiple Sklerose', en: 'Multiple Sclerosis', icd: 'G35' },
    polyneuropathie: { de: 'Polyneuropathie', en: 'Polyneuropathy', icd: 'G62.9' },
    spannungskopfschmerz: { de: 'Spannungskopfschmerz', en: 'Tension Headache', icd: 'G44.2' },
    hoersturz: { de: 'Hörsturz', en: 'Sudden Hearing Loss', icd: 'H91.2' },
    glaukom: { de: 'Glaukom (Grüner Star)', en: 'Glaucoma', icd: 'H40.9' },
    katarakt: { de: 'Katarakt (Grauer Star)', en: 'Cataract', icd: 'H25.9' },
    depression: { de: 'Depression', en: 'Depression', icd: 'F32.9' },
    angststoerung: { de: 'Angststörung', en: 'Anxiety Disorder', icd: 'F41.9' },
    burnout: { de: 'Burnout', en: 'Burnout', icd: 'Z73.0' },
    schlafstoerung: { de: 'Schlafstörung', en: 'Sleep Disorder', icd: 'G47.9' },

    // Women's Health
    endometriose: { de: 'Endometriose', en: 'Endometriosis', icd: 'N80' },
    myome: { de: 'Gebärmuttermyome', en: 'Uterine Fibroids', icd: 'D25.9' },
    zysten: { de: 'Eierstockzysten', en: 'Ovarian Cysts', icd: 'N83.2' },
    wechseljahresbeschwerden: { de: 'Wechseljahresbeschwerden', en: 'Menopausal Symptoms', icd: 'N95.1' },
    menstruationsstoerung: { de: 'Menstruationsstörung', en: 'Menstrual Disorder', icd: 'N92.6' },
    brustkrebs: { de: 'Brustkrebs', en: 'Breast Cancer', icd: 'C50' },
    gebaermutterkrebs: { de: 'Gebärmutterkrebs', en: 'Uterine Cancer', icd: 'C54' },
    eierstockkrebs: { de: 'Eierstockkrebs', en: 'Ovarian Cancer', icd: 'C56' },

    // Spine & Joints / Musculoskeletal
    bandscheibenvorfall: { de: 'Bandscheibenvorfall', en: 'Herniated Disc', icd: 'M51.2' },
    arthrose: { de: 'Arthrose', en: 'Osteoarthritis', icd: 'M19.9' },
    rheuma: { de: 'Rheumatoide Arthritis', en: 'Rheumatoid Arthritis', icd: 'M06.9' },
    fibromyalgie: { de: 'Fibromyalgie', en: 'Fibromyalgia', icd: 'M79.7' },
    gicht: { de: 'Gicht', en: 'Gout', icd: 'M10.9' },
    skoliose: { de: 'Skoliose', en: 'Scoliosis', icd: 'M41.9' },
    morbusBechterew: { de: 'Morbus Bechterew', en: 'Ankylosing Spondylitis', icd: 'M45' },
    karpaltunnelsyndrom: { de: 'Karpaltunnelsyndrom', en: 'Carpal Tunnel Syndrome', icd: 'G56.0' },
    tennisarm: { de: 'Tennisarm', en: 'Tennis Elbow', icd: 'M77.1' },
    fersensporn: { de: 'Fersensporn', en: 'Heel Spur', icd: 'M77.3' },
    hws: { de: 'HWS-Syndrom', en: 'Cervical Spine Syndrome', icd: 'M54.2' },
    lws: { de: 'LWS-Syndrom', en: 'Lumbar Spine Syndrome', icd: 'M54.5' },

    // Skin
    neurodermitis: { de: 'Neurodermitis', en: 'Atopic Dermatitis', icd: 'L20.9' },
    psoriasis: { de: 'Schuppenflechte', en: 'Psoriasis', icd: 'L40.9' },
    akne: { de: 'Akne', en: 'Acne', icd: 'L70.9' },
    urtikaria: { de: 'Nesselsucht', en: 'Urticaria', icd: 'L50.9' },
    ekzem: { de: 'Ekzem', en: 'Eczema', icd: 'L30.9' },
    hautkrebs: { de: 'Hautkrebs', en: 'Skin Cancer', icd: 'C44' },
    rosazea: { de: 'Rosazea', en: 'Rosacea', icd: 'L71.9' },
    vitiligo: { de: 'Vitiligo', en: 'Vitiligo', icd: 'L80' },
    haarausfall: { de: 'Haarausfall', en: 'Hair Loss', icd: 'L65.9' },
    nagelpilz: { de: 'Nagelpilz', en: 'Nail Fungus', icd: 'B35.1' },
    warzen: { de: 'Warzen', en: 'Warts', icd: 'B07' },
    herpes: { de: 'Herpes', en: 'Herpes', icd: 'B00.9' },
    guertelrose: { de: 'Gürtelrose', en: 'Shingles', icd: 'B02.9' },

    // Infections
    borreliose: { de: 'Borreliose', en: 'Lyme Disease', icd: 'A69.2' },
    fsme: { de: 'FSME', en: 'Tick-borne Encephalitis', icd: 'A84.1' },
    hiv: { de: 'HIV', en: 'HIV', icd: 'B20' },
    hepatitis: { de: 'Hepatitis', en: 'Hepatitis', icd: 'B19.9' },
    mononukleose: { de: 'Pfeiffersches Drüsenfieber', en: 'Mononucleosis', icd: 'B27.9' },
    malaria: { de: 'Malaria', en: 'Malaria', icd: 'B54' },
    mrsa: { de: 'MRSA', en: 'MRSA', icd: 'A49.0' },
    covid: { de: 'COVID-19', en: 'COVID-19', icd: 'U07.1' },
    longCovid: { de: 'Long COVID', en: 'Long COVID', icd: 'U09.9' },

    // Cancer
    lungenkrebs: { de: 'Lungenkrebs', en: 'Lung Cancer', icd: 'C34' },
    darmkrebs: { de: 'Darmkrebs', en: 'Colorectal Cancer', icd: 'C18' },
    magenkrebs: { de: 'Magenkrebs', en: 'Stomach Cancer', icd: 'C16' },
    leberkrebs: { de: 'Leberkrebs', en: 'Liver Cancer', icd: 'C22' },
    bauchspeicheldruesenkrebs: { de: 'Bauchspeicheldrüsenkrebs', en: 'Pancreatic Cancer', icd: 'C25' },
    nierenkrebs: { de: 'Nierenkrebs', en: 'Kidney Cancer', icd: 'C64' },
    blasenkrebs: { de: 'Blasenkrebs', en: 'Bladder Cancer', icd: 'C67' },
    lymphom: { de: 'Lymphom', en: 'Lymphoma', icd: 'C85.9' },
    leukaemie: { de: 'Leukämie', en: 'Leukemia', icd: 'C95.9' },
    melanom: { de: 'Melanom', en: 'Melanoma', icd: 'C43' },
    schilddruesenkrebs: { de: 'Schilddrüsenkrebs', en: 'Thyroid Cancer', icd: 'C73' },
    hirntumor: { de: 'Hirntumor', en: 'Brain Tumor', icd: 'C71' },
    kehlkopfkrebs: { de: 'Kehlkopfkrebs', en: 'Laryngeal Cancer', icd: 'C32' },
    speiseroehrenkrebs: { de: 'Speiseröhrenkrebs', en: 'Esophageal Cancer', icd: 'C15' },
    knochenkrebs: { de: 'Knochenkrebs', en: 'Bone Cancer', icd: 'C40' },
  };
  
  const mapping = fieldMappings[key];
  if (mapping) {
    const name = language === 'de' ? mapping.de : mapping.en;
    return mapping.icd ? `${name} (ICD-10: ${mapping.icd})` : name;
  }
  
  // Capitalize first letter as fallback
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
};

const FilteredSummaryView = ({ formData }: FilteredSummaryViewProps) => {
  const { language } = useLanguage();

  // Define all sections to check
  const sections = [
    { key: 'patientendaten', labelDe: 'Patientendaten', labelEn: 'Patient Data' },
    { key: 'beschwerden', labelDe: 'Aktuelle Beschwerden', labelEn: 'Current Complaints' },
    { key: 'allergien', labelDe: 'Allergien & Unverträglichkeiten', labelEn: 'Allergies & Intolerances' },
    { key: 'kopfErkrankungen', labelDe: 'Kopf, Sinne & Nervensystem', labelEn: 'Head, Senses & Nervous System' },
    { key: 'herzKreislauf', labelDe: 'Herz & Kreislauf', labelEn: 'Heart & Circulation' },
    { key: 'lungeAtmung', labelDe: 'Lunge & Atmung', labelEn: 'Lungs & Breathing' },
    { key: 'magenDarm', labelDe: 'Magen & Darm', labelEn: 'Stomach & Intestines' },
    { key: 'leberGalle', labelDe: 'Leber & Galle', labelEn: 'Liver & Gallbladder' },
    { key: 'niereBlase', labelDe: 'Niere & Blase', labelEn: 'Kidney & Bladder' },
    { key: 'hormongesundheit', labelDe: 'Hormongesundheit', labelEn: 'Hormonal Health' },
    { key: 'frauengesundheit', labelDe: 'Frauengesundheit', labelEn: "Women's Health" },
    { key: 'maennergesundheit', labelDe: 'Männergesundheit', labelEn: "Men's Health" },
    { key: 'wirbelsaeuleGelenke', labelDe: 'Wirbelsäule & Gelenke', labelEn: 'Spine & Joints' },
    { key: 'hautErkrankungen', labelDe: 'Hauterkrankungen', labelEn: 'Skin Diseases' },
    { key: 'operationen', labelDe: 'Operationen', labelEn: 'Surgeries' },
    { key: 'krebserkrankungen', labelDe: 'Krebserkrankungen', labelEn: 'Cancer' },
    { key: 'infektionen', labelDe: 'Infektionskrankheiten', labelEn: 'Infectious Diseases' },
    { key: 'impfungen', labelDe: 'Impfungen', labelEn: 'Vaccinations' },
    { key: 'familiengeschichte', labelDe: 'Familiengeschichte', labelEn: 'Family History' },
    { key: 'medikamente', labelDe: 'Medikamente', labelEn: 'Medications' },
    { key: 'lebensstil', labelDe: 'Lebensstil', labelEn: 'Lifestyle' },
    { key: 'soziales', labelDe: 'Soziales Umfeld', labelEn: 'Social Environment' },
    { key: 'umwelt', labelDe: 'Umweltfaktoren', labelEn: 'Environmental Factors' },
    { key: 'praeferenzen', labelDe: 'Behandlungspräferenzen', labelEn: 'Treatment Preferences' },
  ];

  // Filter to only sections with data
  const filledSections = sections.filter(section => {
    const sectionData = formData[section.key as keyof AnamneseFormData];
    return hasFilledData(sectionData);
  });

  if (filledSections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {language === "de" 
          ? "Keine Daten eingegeben. Bitte füllen Sie den Anamnesebogen aus."
          : "No data entered. Please complete the medical history form."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <CheckCircle2 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">
          {language === "de" ? "Zusammenfassung - Nur ausgefüllte Bereiche" : "Summary - Filled Sections Only"}
        </h2>
      </div>
      
      <p className="text-sm text-muted-foreground">
        {language === "de" 
          ? `${filledSections.length} von ${sections.length} Bereichen enthalten Angaben.`
          : `${filledSections.length} of ${sections.length} sections contain entries.`}
      </p>

      <div className="grid gap-4">
        {filledSections.map(section => {
          const sectionData = formData[section.key as keyof AnamneseFormData];
          const filledFields = getFilledFields(sectionData, language);
          
          return (
            <Card key={section.key} className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {language === "de" ? section.labelDe : section.labelEn}
                  <Badge variant="secondary" className="ml-auto">
                    {filledFields.length} {language === "de" ? "Angaben" : "entries"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {filledFields.slice(0, 10).map((field, idx) => (
                    <li key={idx} className="text-muted-foreground">• {field}</li>
                  ))}
                  {filledFields.length > 10 && (
                    <li className="text-muted-foreground italic">
                      ... {language === "de" ? `und ${filledFields.length - 10} weitere` : `and ${filledFields.length - 10} more`}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FilteredSummaryView;
