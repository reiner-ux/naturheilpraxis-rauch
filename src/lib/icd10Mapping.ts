/**
 * ICD-10 Fixed Mapping for clearly identifiable conditions from the Anamnesebogen.
 * Maps form data field paths to ICD-10 codes with German/English descriptions.
 * 
 * DSGVO: This mapping contains no patient data – only medical code definitions.
 */

export interface ICD10Entry {
  code: string;
  descDe: string;
  descEn: string;
  category: string;
}

export interface ICD10Result {
  code: string;
  descDe: string;
  descEn: string;
  category: string;
  source: "fixed" | "ai";
  confidence?: number;
  sourceField?: string;
}

// Fixed mapping: form field path → ICD-10 code(s)
export const icd10FixedMapping: Record<string, ICD10Entry[]> = {
  // === Kopf & Sinne (Neurology) ===
  "kopfErkrankungen.augenerkrankung.grauerStar": [{ code: "H25.9", descDe: "Grauer Star (Katarakt)", descEn: "Cataract", category: "Auge" }],
  "kopfErkrankungen.augenerkrankung.gruenerStar": [{ code: "H40.9", descDe: "Grüner Star (Glaukom)", descEn: "Glaucoma", category: "Auge" }],
  "kopfErkrankungen.augenerkrankung.makula": [{ code: "H35.3", descDe: "Makuladegeneration", descEn: "Macular degeneration", category: "Auge" }],
  "kopfErkrankungen.augenerkrankung.trockeneAugen": [{ code: "H04.1", descDe: "Trockene Augen (Sicca-Syndrom)", descEn: "Dry eye syndrome", category: "Auge" }],
  "kopfErkrankungen.augenerkrankung.bindehautentzuendung": [{ code: "H10.9", descDe: "Bindehautentzündung", descEn: "Conjunctivitis", category: "Auge" }],
  "kopfErkrankungen.augenerkrankung.hornhautentzuendung": [{ code: "H16.9", descDe: "Hornhautentzündung (Keratitis)", descEn: "Keratitis", category: "Auge" }],
  "kopfErkrankungen.schwerhoerig.ja": [{ code: "H91.9", descDe: "Schwerhörigkeit", descEn: "Hearing loss", category: "Ohr" }],
  "kopfErkrankungen.ohrenerkrankung.tinnitus": [{ code: "H93.1", descDe: "Tinnitus", descEn: "Tinnitus", category: "Ohr" }],
  "kopfErkrankungen.ohrenerkrankung.hoersturz": [{ code: "H91.2", descDe: "Hörsturz", descEn: "Sudden hearing loss", category: "Ohr" }],
  "kopfErkrankungen.ohrenerkrankung.mittelohrentzuendung": [{ code: "H66.9", descDe: "Mittelohrentzündung (Otitis media)", descEn: "Otitis media", category: "Ohr" }],
  "kopfErkrankungen.ohrenerkrankung.morbusMeniere": [{ code: "H81.0", descDe: "Morbus Menière", descEn: "Ménière's disease", category: "Ohr" }],
  "kopfErkrankungen.sinusitis.ja": [{ code: "J32.9", descDe: "Sinusitis (Nasennebenhöhlenentzündung)", descEn: "Sinusitis", category: "HNO" }],
  "kopfErkrankungen.mandelentzuendung.ja": [{ code: "J03.9", descDe: "Mandelentzündung (Tonsillitis)", descEn: "Tonsillitis", category: "HNO" }],
  "kopfErkrankungen.kopfschmerzen.migraene": [{ code: "G43.9", descDe: "Migräne", descEn: "Migraine", category: "Neurologie" }],
  "kopfErkrankungen.kopfschmerzen.spannungskopfschmerz": [{ code: "G44.2", descDe: "Spannungskopfschmerz", descEn: "Tension-type headache", category: "Neurologie" }],
  "kopfErkrankungen.kopfschmerzen.clusterkopfschmerz": [{ code: "G44.0", descDe: "Clusterkopfschmerz", descEn: "Cluster headache", category: "Neurologie" }],
  "kopfErkrankungen.schwindel.ja": [{ code: "R42", descDe: "Schwindel", descEn: "Dizziness/Vertigo", category: "Neurologie" }],
  "kopfErkrankungen.neuralgien.trigeminus": [{ code: "G50.0", descDe: "Trigeminusneuralgie", descEn: "Trigeminal neuralgia", category: "Neurologie" }],

  // === Schlaf & Psyche ===
  "schlafSymptome.schlafstörung.ja": [{ code: "G47.0", descDe: "Schlafstörung (Insomnie)", descEn: "Insomnia", category: "Schlaf" }],
  "schlafSymptome.konzentrationsstörung.ja": [{ code: "R41.3", descDe: "Konzentrationsstörung", descEn: "Concentration disorder", category: "Neurologie" }],
  "schlafSymptome.angstzustaende.ja": [{ code: "F41.9", descDe: "Angststörung", descEn: "Anxiety disorder", category: "Psyche" }],
  "psychischeErkrankungen.depression.ja": [{ code: "F32.9", descDe: "Depression", descEn: "Depression", category: "Psyche" }],
  "psychischeErkrankungen.schizophrenie.ja": [{ code: "F20.9", descDe: "Schizophrenie", descEn: "Schizophrenia", category: "Psyche" }],
  "psychischeErkrankungen.epilepsie.ja": [{ code: "G40.9", descDe: "Epilepsie", descEn: "Epilepsy", category: "Neurologie" }],
  "psychischeErkrankungen.phobien.agoraphobie": [{ code: "F40.0", descDe: "Agoraphobie", descEn: "Agoraphobia", category: "Psyche" }],
  "psychischeErkrankungen.phobien.sozialePhobie": [{ code: "F40.1", descDe: "Soziale Phobie", descEn: "Social phobia", category: "Psyche" }],

  // === Herz & Kreislauf ===
  "herzKreislauf.blutdruckHoch.ja": [{ code: "I10", descDe: "Arterielle Hypertonie (Bluthochdruck)", descEn: "Essential hypertension", category: "Herz" }],
  "herzKreislauf.blutdruckNiedrig.ja": [{ code: "I95.9", descDe: "Hypotonie (niedriger Blutdruck)", descEn: "Hypotension", category: "Herz" }],
  "herzKreislauf.herzrhythmusstörung.vorhofflimmern": [{ code: "I48.9", descDe: "Vorhofflimmern", descEn: "Atrial fibrillation", category: "Herz" }],
  "herzKreislauf.herzrhythmusstörung.extrasystolen": [{ code: "I49.4", descDe: "Extrasystolen", descEn: "Premature beats", category: "Herz" }],
  "herzKreislauf.herzschrittmacher.ja": [{ code: "Z95.0", descDe: "Herzschrittmacher", descEn: "Cardiac pacemaker in situ", category: "Herz" }],
  "herzKreislauf.herzinfarkt.ja": [{ code: "I25.2", descDe: "Z.n. Herzinfarkt", descEn: "Old myocardial infarction", category: "Herz" }],
  "herzKreislauf.stent.ja": [{ code: "Z95.5", descDe: "Z.n. koronarem Stent", descEn: "Coronary stent in situ", category: "Herz" }],
  "herzKreislauf.krampfadern.ja": [{ code: "I83.9", descDe: "Krampfadern (Varizen)", descEn: "Varicose veins", category: "Gefäße" }],
  "herzKreislauf.thrombose.ja": [{ code: "I80.9", descDe: "Thrombose", descEn: "Thrombosis", category: "Gefäße" }],
  "herzKreislauf.oedeme.ja": [{ code: "R60.0", descDe: "Ödeme", descEn: "Edema", category: "Gefäße" }],

  // === Lunge & Atmung ===
  "lungeAtmung.asthma.ja": [{ code: "J45.9", descDe: "Asthma bronchiale", descEn: "Asthma", category: "Lunge" }],
  "lungeAtmung.bronchitis.chronisch": [{ code: "J42", descDe: "Chronische Bronchitis", descEn: "Chronic bronchitis", category: "Lunge" }],
  "lungeAtmung.copd.ja": [{ code: "J44.9", descDe: "COPD", descEn: "COPD", category: "Lunge" }],
  "lungeAtmung.lungenentzuendung.ja": [{ code: "J18.9", descDe: "Pneumonie (Lungenentzündung)", descEn: "Pneumonia", category: "Lunge" }],
  "lungeAtmung.tuberkulose.ja": [{ code: "A15.9", descDe: "Lungentuberkulose", descEn: "Pulmonary tuberculosis", category: "Lunge" }],
  "lungeAtmung.sarkoidose.ja": [{ code: "D86.9", descDe: "Sarkoidose", descEn: "Sarcoidosis", category: "Lunge" }],
  "lungeAtmung.atemnot.ja": [{ code: "R06.0", descDe: "Dyspnoe (Atemnot)", descEn: "Dyspnea", category: "Lunge" }],
  "lungeAtmung.lungenembolie.ja": [{ code: "I26.9", descDe: "Lungenembolie", descEn: "Pulmonary embolism", category: "Lunge" }],

  // === Magen & Darm ===
  "magenDarm.magengeschwuer.ja": [{ code: "K25.9", descDe: "Magengeschwür (Ulcus ventriculi)", descEn: "Gastric ulcer", category: "Magen-Darm" }],
  "magenDarm.sodbrennen.ja": [{ code: "K21.0", descDe: "Gastroösophagealer Reflux (Sodbrennen)", descEn: "Gastroesophageal reflux", category: "Magen-Darm" }],
  "magenDarm.zoeliakie.ja": [{ code: "K90.0", descDe: "Zöliakie", descEn: "Celiac disease", category: "Magen-Darm" }],
  "magenDarm.morbusCrohn.ja": [{ code: "K50.9", descDe: "Morbus Crohn", descEn: "Crohn's disease", category: "Magen-Darm" }],
  "magenDarm.colitis.ja": [{ code: "K51.9", descDe: "Colitis ulcerosa", descEn: "Ulcerative colitis", category: "Magen-Darm" }],
  "magenDarm.reizdarm.ja": [{ code: "K58.9", descDe: "Reizdarmsyndrom", descEn: "Irritable bowel syndrome", category: "Magen-Darm" }],
  "magenDarm.verstopfung.ja": [{ code: "K59.0", descDe: "Obstipation (Verstopfung)", descEn: "Constipation", category: "Magen-Darm" }],
  "magenDarm.durchfall.ja": [{ code: "K59.1", descDe: "Funktionelle Diarrhö", descEn: "Functional diarrhea", category: "Magen-Darm" }],

  // === Leber & Galle ===
  "leberGalle.lebererkrankung.hepatitisA": [{ code: "B15.9", descDe: "Hepatitis A", descEn: "Hepatitis A", category: "Leber" }],
  "leberGalle.lebererkrankung.hepatitisB": [{ code: "B16.9", descDe: "Hepatitis B", descEn: "Hepatitis B", category: "Leber" }],
  "leberGalle.lebererkrankung.hepatitisC": [{ code: "B17.1", descDe: "Hepatitis C", descEn: "Hepatitis C", category: "Leber" }],
  "leberGalle.lebererkrankung.fettleber": [{ code: "K76.0", descDe: "Fettleber", descEn: "Fatty liver", category: "Leber" }],
  "leberGalle.leberzirrhose.ja": [{ code: "K74.6", descDe: "Leberzirrhose", descEn: "Liver cirrhosis", category: "Leber" }],
  "leberGalle.gallensteine.ja": [{ code: "K80.2", descDe: "Gallensteine (Cholelithiasis)", descEn: "Gallstones", category: "Galle" }],

  // === Niere & Blase ===
  "niereBlase.nierenerkrankung.blasenentzuendung": [{ code: "N30.9", descDe: "Blasenentzündung (Zystitis)", descEn: "Cystitis", category: "Niere/Blase" }],
  "niereBlase.inkontinenz.ja": [{ code: "R32", descDe: "Harninkontinenz", descEn: "Urinary incontinence", category: "Niere/Blase" }],
  "niereBlase.nierensteine.ja": [{ code: "N20.0", descDe: "Nierensteine", descEn: "Kidney stones", category: "Niere/Blase" }],

  // === Hormone ===
  "hormongesundheit.schilddruese.unterfunktion": [{ code: "E03.9", descDe: "Schilddrüsenunterfunktion (Hypothyreose)", descEn: "Hypothyroidism", category: "Hormone" }],
  "hormongesundheit.schilddruese.ueberfunktion": [{ code: "E05.9", descDe: "Schilddrüsenüberfunktion (Hyperthyreose)", descEn: "Hyperthyroidism", category: "Hormone" }],
  "hormongesundheit.schilddruese.hashimoto": [{ code: "E06.3", descDe: "Hashimoto-Thyreoiditis", descEn: "Hashimoto's thyroiditis", category: "Hormone" }],
  "hormongesundheit.schilddruese.basedow": [{ code: "E05.0", descDe: "Morbus Basedow", descEn: "Graves' disease", category: "Hormone" }],
  "hormongesundheit.nebenniere.cushingSyndrom": [{ code: "E24.9", descDe: "Cushing-Syndrom", descEn: "Cushing's syndrome", category: "Hormone" }],

  // === Bewegungsapparat ===
  "wirbelsaeuleGelenke.hws.bsv": [{ code: "M50.1", descDe: "Bandscheibenvorfall HWS", descEn: "Cervical disc herniation", category: "Wirbelsäule" }],
  "wirbelsaeuleGelenke.bws.bsv": [{ code: "M51.1", descDe: "Bandscheibenvorfall BWS", descEn: "Thoracic disc herniation", category: "Wirbelsäule" }],
  "wirbelsaeuleGelenke.lws.bsv": [{ code: "M51.1", descDe: "Bandscheibenvorfall LWS", descEn: "Lumbar disc herniation", category: "Wirbelsäule" }],
  "wirbelsaeuleGelenke.rheuma.ja": [{ code: "M06.9", descDe: "Rheumatoide Arthritis", descEn: "Rheumatoid arthritis", category: "Gelenke" }],

  // === Haut ===
  "hautInfektionen.psoriasis.ja": [{ code: "L40.9", descDe: "Psoriasis (Schuppenflechte)", descEn: "Psoriasis", category: "Haut" }],
  "hautInfektionen.ekzem.atopisch": [{ code: "L20.9", descDe: "Atopisches Ekzem (Neurodermitis)", descEn: "Atopic dermatitis", category: "Haut" }],
  "hautInfektionen.urticaria.ja": [{ code: "L50.9", descDe: "Urtikaria (Nesselsucht)", descEn: "Urticaria", category: "Haut" }],
  "hautInfektionen.rosazea.ja": [{ code: "L71.9", descDe: "Rosazea", descEn: "Rosacea", category: "Haut" }],
  "hautInfektionen.akne.ja": [{ code: "L70.9", descDe: "Akne", descEn: "Acne", category: "Haut" }],

  // === Frauengesundheit ===
  "frauengesundheit.endometriose.ja": [{ code: "N80.9", descDe: "Endometriose", descEn: "Endometriosis", category: "Gynäkologie" }],
  "frauengesundheit.myome.ja": [{ code: "D25.9", descDe: "Uterusmyom", descEn: "Uterine leiomyoma", category: "Gynäkologie" }],
  "frauengesundheit.eierstockzyste.ja": [{ code: "N83.2", descDe: "Eierstockzyste", descEn: "Ovarian cyst", category: "Gynäkologie" }],

  // === Männergesundheit ===
  "maennergesundheit.prostata.bph": [{ code: "N40", descDe: "Benigne Prostatahyperplasie (BPH)", descEn: "Benign prostatic hyperplasia", category: "Urologie" }],
  "maennergesundheit.prostata.prostatitis": [{ code: "N41.9", descDe: "Prostatitis", descEn: "Prostatitis", category: "Urologie" }],
  "maennergesundheit.erektionsstoerung.ja": [{ code: "N48.4", descDe: "Erektile Dysfunktion", descEn: "Erectile dysfunction", category: "Urologie" }],

  // === Krebs (allgemein) ===
  "krebserkrankung.ja": [{ code: "C80.1", descDe: "Bösartige Neubildung (unspezifisch)", descEn: "Malignant neoplasm, unspecified", category: "Onkologie" }],

  // === Allergien ===
  "allergien.heuschnupfen": [{ code: "J30.1", descDe: "Heuschnupfen (allergische Rhinitis)", descEn: "Allergic rhinitis (pollen)", category: "Allergie" }],
  "allergien.hausstaubmilbe": [{ code: "J30.3", descDe: "Hausstaubmilbenallergie", descEn: "Dust mite allergy", category: "Allergie" }],
  "allergien.tierhaarallergie": [{ code: "J30.3", descDe: "Tierhaarallergie", descEn: "Animal dander allergy", category: "Allergie" }],
  "allergien.nahrungsmittel": [{ code: "T78.1", descDe: "Nahrungsmittelallergie", descEn: "Food allergy", category: "Allergie" }],
  "allergien.medikamente": [{ code: "T88.7", descDe: "Medikamentenallergie", descEn: "Drug allergy", category: "Allergie" }],
  "allergien.kontaktallergie": [{ code: "L23.9", descDe: "Kontaktallergie", descEn: "Contact allergy", category: "Allergie" }],

  // === Familienanamnese ===
  "familyHistory.diabetes.ja": [{ code: "Z83.3", descDe: "Familienanamnese: Diabetes mellitus", descEn: "Family history: Diabetes", category: "Familie" }],
  "familyHistory.hoherBlutdruck.ja": [{ code: "Z82.4", descDe: "Familienanamnese: Hypertonie", descEn: "Family history: Hypertension", category: "Familie" }],
  "familyHistory.herzinfarkt.ja": [{ code: "Z82.4", descDe: "Familienanamnese: Herzinfarkt", descEn: "Family history: Myocardial infarction", category: "Familie" }],
  "familyHistory.krebs.ja": [{ code: "Z80.9", descDe: "Familienanamnese: Krebserkrankung", descEn: "Family history: Cancer", category: "Familie" }],
};

/**
 * Extract fixed ICD-10 codes from form data by checking boolean flags.
 * Traverses nested objects to match mapping paths.
 */
export function extractFixedICD10(formData: Record<string, any>): ICD10Result[] {
  const results: ICD10Result[] = [];
  const seen = new Set<string>();

  for (const [path, entries] of Object.entries(icd10FixedMapping)) {
    const value = getNestedValue(formData, path);
    if (value === true) {
      for (const entry of entries) {
        const key = `${entry.code}-${path}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            ...entry,
            source: "fixed",
            confidence: 1.0,
            sourceField: path,
          });
        }
      }
    }
  }

  return results;
}

function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[key];
  }
  return current;
}

/**
 * Collect free-text fields that may contain symptoms not covered by fixed mapping.
 * These are sent (encrypted context, no PII) to AI for ICD-10 suggestion.
 */
export function collectFreeTextSymptoms(formData: Record<string, any>): string[] {
  const texts: string[] = [];
  
  const freeTextFields = [
    "weitereErkrankungen",
    "zusaetzlicheInfos",
    "herzKreislauf.sonstige",
    "lungeAtmung.sonstige",
    "magenDarm.sonstige",
    "leberGalle.sonstige",
    "niereBlase.sonstige",
    "hormongesundheit.sonstige",
    "wirbelsaeuleGelenke.sonstige",
    "maennergesundheit.sonstige",
  ];

  for (const field of freeTextFields) {
    const value = getNestedValue(formData, field);
    if (typeof value === "string" && value.trim().length > 2) {
      texts.push(value.trim());
    }
  }

  return texts;
}
