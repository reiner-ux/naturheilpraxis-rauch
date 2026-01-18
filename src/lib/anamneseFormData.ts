// Complete form sections based on the 41-page Anamnesebogen document
export interface FormSection {
  id: string;
  titleDe: string;
  titleEn: string;
  emoji: string;
  icon: string;
  color: string;
  iconColor: string;
}

export const formSections: FormSection[] = [
  { id: "intro", titleDe: "Willkommen", titleEn: "Welcome", emoji: "👋", icon: "Sparkles", color: "bg-emerald-100 dark:bg-emerald-950/30", iconColor: "text-emerald-500" },
  { id: "patientData", titleDe: "I. Patientendaten", titleEn: "I. Patient Data", emoji: "👤", icon: "User", color: "bg-blue-100 dark:bg-blue-950/30", iconColor: "text-blue-500" },
  { id: "familyHistory", titleDe: "II. Familiengeschichte", titleEn: "II. Family History", emoji: "👨‍👩‍👧", icon: "Users", color: "bg-cyan-100 dark:bg-cyan-950/30", iconColor: "text-cyan-500" },
  { id: "medicalHistory", titleDe: "III. Eigene Erkrankungen", titleEn: "III. Medical History", emoji: "🩺", icon: "Stethoscope", color: "bg-orange-100 dark:bg-orange-950/30", iconColor: "text-orange-500" },
  { id: "womenHealth", titleDe: "IV. Frauengesundheit", titleEn: "IV. Women's Health", emoji: "👩", icon: "Heart", color: "bg-pink-100 dark:bg-pink-950/30", iconColor: "text-pink-500" },
  { id: "surgeries", titleDe: "V. Unfälle & Operationen", titleEn: "V. Accidents & Surgeries", emoji: "🏥", icon: "Building2", color: "bg-red-100 dark:bg-red-950/30", iconColor: "text-red-500" },
  { id: "cancer", titleDe: "VI. Krebserkrankung", titleEn: "VI. Cancer", emoji: "⚠️", icon: "AlertTriangle", color: "bg-amber-100 dark:bg-amber-950/30", iconColor: "text-amber-600" },
  { id: "allergies", titleDe: "VII. Allergien", titleEn: "VII. Allergies", emoji: "🤧", icon: "ShieldAlert", color: "bg-yellow-100 dark:bg-yellow-950/30", iconColor: "text-yellow-600" },
  { id: "medications", titleDe: "VIII. Medikamente", titleEn: "VIII. Medications", emoji: "💊", icon: "Pill", color: "bg-purple-100 dark:bg-purple-950/30", iconColor: "text-purple-500" },
  { id: "lifestyle", titleDe: "IX. Lebensweise", titleEn: "IX. Lifestyle", emoji: "🌿", icon: "Leaf", color: "bg-green-100 dark:bg-green-950/30", iconColor: "text-green-500" },
  { id: "environment", titleDe: "X. Umweltbelastungen", titleEn: "X. Environmental Factors", emoji: "🌍", icon: "Globe", color: "bg-teal-100 dark:bg-teal-950/30", iconColor: "text-teal-500" },
  { id: "infections", titleDe: "XI. Infektionskrankheiten", titleEn: "XI. Infections", emoji: "🦠", icon: "Bug", color: "bg-rose-100 dark:bg-rose-950/30", iconColor: "text-rose-500" },
  { id: "vaccinations", titleDe: "XII. Impfstatus", titleEn: "XII. Vaccination Status", emoji: "💉", icon: "Syringe", color: "bg-indigo-100 dark:bg-indigo-950/30", iconColor: "text-indigo-500" },
  { id: "complaints", titleDe: "XIII. Beschwerden", titleEn: "XIII. Complaints", emoji: "📋", icon: "ClipboardList", color: "bg-slate-100 dark:bg-slate-950/30", iconColor: "text-slate-500" },
  { id: "preferences", titleDe: "XIV. Behandlungspräferenzen", titleEn: "XIV. Treatment Preferences", emoji: "✨", icon: "Wand2", color: "bg-violet-100 dark:bg-violet-950/30", iconColor: "text-violet-500" },
  { id: "social", titleDe: "XV. Persönliche Umstände", titleEn: "XV. Personal Circumstances", emoji: "🏠", icon: "Home", color: "bg-sky-100 dark:bg-sky-950/30", iconColor: "text-sky-500" },
  { id: "signature", titleDe: "XVI. Unterschrift", titleEn: "XVI. Signature", emoji: "✍️", icon: "PenTool", color: "bg-stone-100 dark:bg-stone-950/30", iconColor: "text-stone-500" },
];

// Initial form state with all fields
export const initialFormData = {
  // I. Patientendaten - Personalia
  nachname: "",
  vorname: "",
  geburtsdatum: "",
  nationalitaet: "",
  geschlecht: "",
  zivilstand: "",
  
  // Kontaktdaten
  strasse: "",
  plz: "",
  wohnort: "",
  telefonPrivat: "",
  telefonBeruflich: "",
  mobil: "",
  email: "",
  
  // Mitversicherte
  mitversicherte: [] as { name: string; verhaeltnis: string; geburtsdatum: string }[],
  
  // Versicherungsdaten
  versicherungstyp: "", // privat | gesetzlich
  versicherungsname: "",
  versicherungsnummer: "",
  tarif: "",
  kostenuebernahmeNaturheilkunde: false,
  
  // Berufliche Situation
  beruf: "",
  arbeitgeber: "",
  branche: "",
  arbeitsunfaehigSeit: "",
  berentnerSeit: "",
  unfallrenteProzent: "",
  schwerbehinderungProzent: "",
  
  // Körperliche Grunddaten
  koerpergroesse: "",
  gewicht: "",
  
  // Informationsquelle
  informationsquelle: "",
  empfehlungVon: "",
  
  // Vorbehandler
  hausarzt: "",
  fachaerzte: "",
  heilpraktiker: "",
  physiotherapeut: "",
  psychotherapeut: "",
  sonstigeTherapeutenn: "",
  
  // II. Familiengeschichte
  familyHistory: {
    hoherBlutdruck: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    herzinfarkt: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    schlaganfall: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    diabetes: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    gicht: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    lungenasthma: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    lungentuberkulose: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    nervenleiden: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    krebs: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false, welches: "" },
    allergien: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    sucht: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
    autoimmun: { ja: false, vater: false, mutter: false, grosseltern: false, geschwister: false },
  },
  
  // III. Eigene Erkrankungen - Kopf, Sinne & Nervensystem
  kopfErkrankungen: {
    augenerkrankung: { ja: false, jahr: "", netzhaut: false, grauerStar: false, gruenerStar: false, makula: false },
    schwerhoerig: { ja: false, jahr: "", links: false, rechts: false, beidseitig: false },
    ohrenerkrankung: { ja: false, jahr: "", details: "" },
    sinusitis: { ja: false, jahr: "", chronisch: false, akut: false },
    mandelentzuendung: { ja: false, jahr: "" },
    kopfschmerzen: { ja: false, seit: "", rechts: false, links: false, hinterkopf: false, stirn: false, migraene: false },
    schwindel: { ja: false, seit: "", lagerung: false, dreh: false, schwank: false },
  },
  
  // Schlaf & Psychische Symptome
  schlafSymptome: {
    schlafstörung: { ja: false, seit: "" },
    einschlafstörung: { ja: false, dauerMinuten: "" },
    durchschlafstörung: { ja: false, wieOft: "" },
    fruehAufwachen: { ja: false, uhrzeit: "" },
    konzentrationsstörung: { ja: false, seit: "", morgens: false, tagsueber: false, abends: false },
    muedigkeit: { ja: false, seit: "", staendig: false, prozentVergleich: "" },
    leistungsabfall: { ja: false, seit: "", kurzfristig: false, langfristig: false },
    vergesslichkeit: { ja: false, seit: "" },
    angstzustaende: { ja: false, seit: "" },
    stress: { ja: false, seit: "", beruflich: false, privat: false, beides: false },
    partnerschaftsprobleme: { ja: false, seit: "" },
    sexualprobleme: { ja: false, seit: "", libidoverlust: false, potenzstörung: false },
  },
  
  // Psychische Erkrankungen
  psychischeErkrankungen: {
    depression: { ja: false, jahr: "", behandlung: false },
    schizophrenie: { ja: false, jahr: "", behandlung: false },
    psychose: { ja: false, jahr: "", behandlung: false },
    zwangsgedanken: { ja: false, jahr: "", behandlung: false },
    phobien: { ja: false, jahr: "", behandlung: false, agoraphobie: false, sozialePhobie: false, spezifisch: "" },
    epilepsie: { ja: false, jahr: "", behandlung: false },
    trauma: { ja: false, jahr: "", psychotherapie: false },
    mobbing: { ja: false, beruflich: false, schulisch: false, privat: false },
  },
  
  // Herz & Kreislauf
  herzKreislauf: {
    blutdruckWechselhaft: { ja: false, jahr: "", systolisch: "", diastolisch: "" },
    blutdruckNiedrig: { ja: false, jahr: "", symptome: "" },
    blutdruckHoch: { ja: false, jahr: "", grad: "" },
    herzrhythmusstörung: { ja: false, jahr: "", vorhofflimmern: false, extrasystolen: false },
    herzschrittmacher: { ja: false, jahr: "" },
    herzschmerzen: { ja: false, jahr: "", belastung: false, ruhe: false },
    herzinfarkt: { ja: false, jahr: "" },
    stent: { ja: false, jahr: "", anzahl: "" },
    herzklappenfehler: { ja: false, jahr: "", aorta: false, mitral: false, trikuspidal: false },
    krampfadern: { ja: false, jahr: "", rechts: false, links: false, beidseitig: false },
    thrombose: { ja: false, jahr: "", bein: false, lunge: false, arm: false },
    oedeme: { ja: false, seit: "", morgens: false, abends: false, staendig: false },
  },
  
  // Lunge & Atmung
  lungeAtmung: {
    asthma: { ja: false, jahr: "", allergisch: false, nichtAllergisch: false },
    lungenentzuendung: { ja: false, jahr: "" },
    rippenfellentzuendung: { ja: false, jahr: "" },
    bronchitis: { ja: false, jahr: "", akut: false, chronisch: false },
    tuberkulose: { ja: false, jahr: "" },
    sarkoidose: { ja: false, jahr: "", stadium: "" },
    husten: { ja: false, seit: "", trocken: false, mitAuswurf: false },
    auswurf: { ja: false, seit: "", farbe: "" },
    atemnot: { ja: false, seit: "", belastung: false, ruhe: false },
  },
  
  // Magen & Darm
  magenDarm: {
    magengeschwuer: { ja: false, jahr: "" },
    duennDarmgeschwuer: { ja: false, jahr: "" },
    sodbrennen: { ja: false, jahr: "", regelmaessig: false, gelegentlich: false },
    magensaeurehemmer: { ja: false, seit: "" },
    uebelkeit: { ja: false, seit: "", morgens: false, nachEssen: false, staendig: false },
    erbrechen: { ja: false, seit: "", haeufigkeit: "" },
    verstopfung: { ja: false, seit: "", haeufigkeit: "" },
    durchfall: { ja: false, seit: "", haeufigkeit: "" },
    blaehungen: { ja: false, seit: "", morgens: false, nachEssen: false, staendig: false },
    bauchschmerzen: { ja: false, seit: "", lokalisation: "" },
    zoeliakie: { ja: false, diagnostiziert: false },
    morbusCrohn: { ja: false, jahr: "", stadium: "" },
    colitis: { ja: false, jahr: "", bereich: "" },
    reizdarm: { ja: false, jahr: "", diarrhoe: false, obstipation: false, wechselnd: false },
  },
  durst: "",
  appetit: "",
  ernaehrungstyp: "",
  
  // Leber & Gallenblase
  leberGalle: {
    lebererkrankung: { ja: false, jahr: "", hepatitisA: false, hepatitisB: false, hepatitisC: false, fettleber: false },
    gelbsucht: { ja: false, jahr: "" },
    gallenleiden: { ja: false, jahr: "", symptomatisch: false, asymptomatisch: false },
    gallenblasenentfernung: { ja: false, jahr: "", grund: "" },
  },
  
  // Niere & Blase
  niereBlase: {
    nierenerkrankung: { ja: false, jahr: "", stadium: "", blasenentzuendung: false, chronisch: false },
    blasenleiden: { ja: false, jahr: "" },
    miktionsfrequenz: "",
    nykturie: { ja: false, seit: "", anzahlProNacht: "" },
    miktionsbeschwerden: { ja: false, seit: "", brennen: false, schmerz: false, drang: false },
    inkontinenz: { ja: false, seit: "", belastung: false, drang: false, ueberlauf: false },
    prostata: { ja: false, jahr: "", bph: false, prostatitis: false, krebs: false },
    psa: "",
    haematurie: { ja: false, seit: "" },
  },
  
  // Wirbelsäule & Gelenke
  wirbelsaeuleGelenke: {
    hws: { ja: false, seit: "", verspannung: false, bsv: false, arthrose: false },
    bws: { ja: false, seit: "", verspannung: false, bsv: false, arthrose: false },
    lws: { ja: false, seit: "", verspannung: false, bsv: false, arthrose: false },
    iliosakral: { ja: false, seit: "" },
    schulter: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    ellbogen: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    handgelenk: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    finger: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    huefte: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    knie: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    fuss: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    zehen: { ja: false, seit: "", rechts: false, links: false, beidseitig: false },
    rheuma: { ja: false, seit: "", stadium: "" },
  },
  
  // Haut & Infektionen
  hautInfektionen: {
    hauterkrankung: { ja: false, jahr: "", details: "" },
    ekzem: { ja: false, jahr: "", atopisch: false, kontakt: false, sonstige: false },
    psoriasis: { ja: false, jahr: "", leicht: false, mittel: false, schwer: false },
    urticaria: { ja: false, seit: "", akut: false, chronisch: false },
    juckreiz: { ja: false, seit: "" },
    akne: { ja: false, seit: "", mild: false, moderat: false, schwer: false },
    rosazea: { ja: false, seit: "" },
    geschlechtskrankheit: { ja: false, jahr: "", behandlung: "" },
    hyperhidrose: { ja: false, seit: "", haende: false, fuesse: false, achseln: false, gesicht: false },
    nachtschweiss: false,
    stressSchweiss: false,
    staendigSchweiss: false,
  },
  
  // IV. Frauengesundheit
  frauengesundheit: {
    geburtsgewicht: "",
    fruehgeburt: { ja: false, woche: "" },
    gebaermuttererkrankung: { ja: false, welche: "" },
    pille: { ja: false, von: "", bis: "" },
    hormonbehandlung: { ja: false, welche: "" },
    periodeNormal: { ja: false, zyklusTage: "" },
    periodeSchwach: { ja: false, tageBlutung: "" },
    periodeStark: false,
    periodeUnregelmaessig: { ja: false, muster: "" },
    periodenbeschwerden: { ja: false, schmerz: false, uebelkeit: false, kopf: false, sonstige: false },
    menopause: { ja: false, beginn: "", symptome: "" },
    schwangerschaften: { anzahl: "", letzte: "" },
    fehlgeburten: { anzahl: "", wann: "" },
    geburten: { anzahl: "", vaginal: false, kaiserschnitt: false },
    wochenbettdepression: { ja: false, nachGeburt: "" },
  },
  
  // V. Unfälle, Operationen & Hospitalisierung
  unfaelleOperationen: {
    unfall: { ja: false, jahr: "", lokalisation: "" },
    knochenbruch: { ja: false, jahr: "", welcher: "" },
    kopfverletzung: { ja: false, jahr: "", schweregrad: "" },
    operationen: [] as { jahr: string; grund: string }[],
    krankenhausaufenthalt: { ja: false, jahr: "", grund: "" },
    kuraufenthalt: { ja: false, jahr: "", art: "" },
    bluttransfusion: { ja: false, jahr: "", grund: "" },
    chemotherapie: { ja: false, jahr: "", art: "" },
    strahlentherapie: { ja: false, bereich: "" },
    szintigraphie: { ja: false, datum: "", grund: "" },
  },
  
  // VI. Krebserkrankung
  krebserkrankung: {
    hatKrebs: false,
    welche: "",
    diagnoseJahr: "",
    betroffeneOrgane: "",
    tnmStadium: { t: "", n: "", m: "" },
    operationDurchgefuehrt: { ja: false, welche: "" },
    chemotherapieErhalten: { ja: false, von: "", bis: "", welche: "" },
    strahlentherapieErhalten: { ja: false, bereich: "", dauerWochen: "" },
    metastasen: { ja: false, organe: "" },
    aktuelleTumortherapie: { ja: false, welche: "" },
    krebsBestaetigung: false,
  },
  
  // VII. Allergien & Unverträglichkeiten
  allergien: {
    inhalation: { ja: false, pollen: false, staub: false, tierhaare: false, schimmel: false },
    tierepithelien: { ja: false, hund: false, katze: false, pferd: false, sonstige: "" },
    nahrungsmittel: { ja: false, details: "" },
    medikamente: { ja: false, details: "" },
    kontakt: { ja: false, nickel: false, latex: false, sonstige: "" },
    laktose: { ja: false, mild: false, moderat: false, schwer: false },
    gluten: { ja: false, diagnostiziert: false },
    fruktose: { ja: false, details: "" },
    histamin: { ja: false, mild: false, moderat: false, schwer: false },
    sonstigeUnvertraeglichkeit: "",
  },
  
  // VIII. Medikamente & Ärztliche Behandlung
  medikamente: {
    inAerztlicherBehandlung: { ja: false, beiWem: "" },
    fachaerzte: "",
    aktuelle: [] as { name: string; dosierung: string; taeglich: boolean; proWoche: string; grund: string; seit: string }[],
    unvertraeglichkeiten: [] as { name: string; allergie: boolean; unvertraeglichkeit: boolean; reaktion: string }[],
  },
  
  // IX. Lebensweise & Gewohnheiten
  lebensweise: {
    raucher: "", // aktiv | ehemals | nein
    raucherSeitWann: "",
    zigarettenProTag: "",
    exRaucherBisWann: "",
    passivRauchen: "",
    alkohol: { ja: false, seitWann: "", mengeProTag: "", typ: "" },
    sport: { ja: false, proWoche: "", art: "" },
    taeglicheBewegung: { ja: false, details: "" },
    spaziergang: { ja: false, proWoche: "", dauerMinuten: "" },
    meterZuFuss: "",
    schlafQualitaet: "",
    schlafDauer: "",
    stressLevel: "",
    ernaehrungsgewohnheiten: "",
  },
  
  // X. Umweltbelastungen & Sensitivitäten
  umweltbelastungen: {
    chemosensibilitaet: {
      dieselAbgase: { ja: false, staerke: "" },
      tabakrauch: { ja: false, staerke: "" },
      pestizide: { ja: false, staerke: "" },
      benzin: { ja: false, staerke: "" },
      farben: { ja: false, staerke: "" },
      desinfektionsmittel: { ja: false, staerke: "" },
      reiniger: { ja: false, staerke: "" },
      parfuems: { ja: false, staerke: "" },
      teer: { ja: false, staerke: "" },
      nagellack: { ja: false, staerke: "" },
      haarspray: { ja: false, staerke: "" },
      neueRaumausstattung: { ja: false, staerke: "" },
      kunststoff: { ja: false, staerke: "" },
      neuesAuto: { ja: false, staerke: "" },
    },
    koerperbelastungen: {
      strahlung: { ja: false, geopathie: false, elektrosmog: false, hochspannung: false, funkmasten: false, wlan: false },
      zahnherde: { ja: false, wurzelbehandlungen: false, welcheZaehne: "" },
      quecksilber: { ja: false, welcheZaehne: "" },
      zahnbeschwerden: { ja: false, welcheZaehne: "" },
      metalleImMund: { ja: false, welcheZaehne: "" },
      implantate: { ja: false, welcheZaehne: "" },
      nebenhoehlen: { ja: false, stirn: false, kiefer: false, beide: false },
      tonsillen: { ja: false, details: "" },
      narben: { ja: false, lokalisation: "" },
      mangelzustaende: { ja: false, vitamine: false, mineralien: false, spurenelemente: false, enzyme: false, fluessigkeit: false },
      mikroorganismen: { ja: false, viren: false, bakterien: false, pilze: false, parasiten: false },
      toxisch: { ja: false, schwermetalle: false, chemikalien: false, pestizide: false, erbtoxine: false },
    },
  },
  
  // XI. Infektionskrankheiten & Zoonosen
  infektionen: {
    tropenReise: { ja: false, jahr: "", laender: "" },
    zeckenbiss: { ja: false, seit: "", roterHof: false },
    borreliose: { ja: false, jahr: "", stadium: "" },
    fsmeImpfung: { ja: false, jahr: "" },
    hund: { ja: false, rasse: "" },
    katze: { ja: false, rasse: "" },
    pferd: { ja: false, kontakt: "" },
    andereHaustiere: { ja: false, welche: "" },
  },
  
  // XII. Impfstatus & COVID-19
  impfungen: {
    mmr: { ja: false, jahr: "" },
    tetanus: { ja: false, jahr: "" },
    diphtherie: { ja: false, jahr: "" },
    keuchhusten: { ja: false, jahr: "" },
    polio: { ja: false, jahr: "" },
    hepatitisA: { ja: false, jahr: "" },
    hepatitisB: { ja: false, jahr: "" },
    windpocken: { ja: false, jahr: "" },
    influenza: { ja: false, zuletzt: "" },
    pneumokokken: { ja: false, jahr: "" },
    covid: {
      geimpft: false,
      dosis1: { ja: false, datum: "", hersteller: "" },
      dosis2: { ja: false, datum: "", hersteller: "" },
      dosis3: { ja: false, datum: "", hersteller: "" },
      dosis4: { ja: false, datum: "", hersteller: "" },
      weitereAnzahl: "",
      impfreaktionen: { ja: false, art: "" },
      infiziert: { ja: false, wann: "", schwere: "" },
      longCovid: { ja: false, welche: "" },
    },
  },
  
  // XIII. Beschwerden & Beschwerdebeschreibung
  beschwerden: {
    hauptbeschwerde: "",
    weitereBeschwerden: "",
    beginnDerBeschwerden: "",
    verlauf: "", // konstant | zunehmend | abnehmend | wechselhaft
    auftreten: [] as string[], // ständig, tagsüber, nachts, nach Mahlzeiten, bei Belastung, in Ruhephasen, unregelmäßig
    ausstrahlung: "",
    artDerBeschwerden: [] as string[], // Schmerz, körperliche Störung, Funktionsstörung, psychische Belastung
    schmerzqualitaet: [] as string[], // dumpf, stechend, brennend, ziehend, krampfartig, elektrisierend
    schmerzintensitaet: "", // 0-10
    verschlimmerung: [] as string[], // Kälte, Wärme, Anstrengung, Ruhe, Mahlzeiten, bestimmte Nahrung, Stress, Wetter, Tageszeit
    verbesserung: [] as string[], // Kälte, Wärme, Bewegung, Ruhe, spezifische Nahrung, Lagerung, Meditation, bestimmte Aktivität
    bisherigeBehandlungen: "",
    ergebnisBisherigerBehandlungen: "", // gut geholfen, teilweise geholfen, nicht geholfen, verschlimmert
  },
  
  // XIV. Behandlungspräferenzen
  behandlungspraeferenzen: {
    homoeopathie: { interesse: false, erfahren: false },
    biophysikalisch: { interesse: false, erfahren: false },
    metatron: { interesse: false, erfahren: false },
    trikombin: { interesse: false, erfahren: false },
    zapper: { interesse: false, erfahren: false },
    eav: { interesse: false, erfahren: false },
    mineralTestung: { interesse: false, erfahren: false },
    akupunktur: { interesse: false, erfahren: false },
    phytotherapie: { interesse: false, erfahren: false },
    bachblueten: { interesse: false, erfahren: false },
    sanum: { interesse: false, erfahren: false },
    hypnotherapie: { interesse: false, erfahren: false },
  },
  therapieerwartungen: "",
  gesundheitsziele: "",
  
  // XV. Weitere Erkrankungen/Symptome
  weitereErkrankungen: "",
  
  // Persönliche Umstände & Soziales
  soziales: {
    familienstand: "",
    kinderAnzahl: "",
    kinderAlter: "",
    wohnumfeld: "", // Stadt, Vorstadt, Land
    wohntyp: "", // Haus, Wohnung, Sonstige
    berufStress: "", // keine, mild, moderat, extrem
    finanzBelastung: "", // keine, mild, moderat, erheblich
    sozialesNetzwerk: "", // gut, ausreichend, begrenzt, isoliert
    hobbys: "",
  },
  
  // XVI. Unterschrift & Bestätigung
  unterschrift: {
    ort: "Augsburg",
    datum: "",
    nameInDruckbuchstaben: "",
    bestaetigung: false,
    bestaetigung2fa: false,
    erziehungsberechtigter: "",
  },
  
  // Zusätzliche Informationen
  zusaetzlicheInfos: "",
};

export type AnamneseFormData = typeof initialFormData;
