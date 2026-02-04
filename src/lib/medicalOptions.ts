// Comprehensive medical options for the Anamnesebogen form

// Chemotherapy types/regimens
export const chemotherapyTypes = [
  { value: "folfox", labelDe: "FOLFOX (Oxaliplatin)", labelEn: "FOLFOX (Oxaliplatin)" },
  { value: "folfiri", labelDe: "FOLFIRI (Irinotecan)", labelEn: "FOLFIRI (Irinotecan)" },
  { value: "folfirinox", labelDe: "FOLFIRINOX", labelEn: "FOLFIRINOX" },
  { value: "capox", labelDe: "CAPOX/XELOX", labelEn: "CAPOX/XELOX" },
  { value: "ac", labelDe: "AC (Adriamycin/Cyclophosphamid)", labelEn: "AC (Adriamycin/Cyclophosphamide)" },
  { value: "flot", labelDe: "FLOT", labelEn: "FLOT" },
  { value: "taxane", labelDe: "Taxane (Paclitaxel, Docetaxel)", labelEn: "Taxanes (Paclitaxel, Docetaxel)" },
  { value: "cisplatin", labelDe: "Cisplatin/Carboplatin", labelEn: "Cisplatin/Carboplatin" },
  { value: "anthracyclin", labelDe: "Anthracycline (Doxorubicin)", labelEn: "Anthracyclines (Doxorubicin)" },
  { value: "gemcitabin", labelDe: "Gemcitabin", labelEn: "Gemcitabine" },
  { value: "5fu", labelDe: "5-Fluorouracil (5-FU)", labelEn: "5-Fluorouracil (5-FU)" },
  { value: "vincristin", labelDe: "Vincristin/Vinblastin", labelEn: "Vincristine/Vinblastine" },
];

// Scintigraphy reasons
export const scintigraphyReasons = [
  { value: "schilddruese", labelDe: "Schilddrüsendiagnostik", labelEn: "Thyroid diagnostics" },
  { value: "knochenMetastasen", labelDe: "Knochenmetastasen-Suche", labelEn: "Bone metastases detection" },
  { value: "herzPerfusion", labelDe: "Herzmuskel-Perfusion", labelEn: "Myocardial perfusion" },
  { value: "nierenFunktion", labelDe: "Nierenfunktion", labelEn: "Kidney function" },
  { value: "parathyreoidea", labelDe: "Nebenschilddrüse", labelEn: "Parathyroid" },
  { value: "lungenPerfusion", labelDe: "Lungenperfusion", labelEn: "Lung perfusion" },
  { value: "entzuendungSuche", labelDe: "Entzündungssuche", labelEn: "Inflammation detection" },
  { value: "tumorSuche", labelDe: "Tumorsuche", labelEn: "Tumor detection" },
];

// PET-CT reasons
export const petCtReasons = [
  { value: "tumorStaging", labelDe: "Tumor-Staging", labelEn: "Tumor staging" },
  { value: "metastasenSuche", labelDe: "Metastasen-Suche", labelEn: "Metastases detection" },
  { value: "therapieKontrolle", labelDe: "Therapiekontrolle", labelEn: "Therapy monitoring" },
  { value: "rezidivSuche", labelDe: "Rezidiv-Suche", labelEn: "Recurrence detection" },
  { value: "lymphom", labelDe: "Lymphom-Diagnostik", labelEn: "Lymphoma diagnostics" },
  { value: "gehirn", labelDe: "Gehirndiagnostik (Alzheimer, Epilepsie)", labelEn: "Brain diagnostics (Alzheimer's, Epilepsy)" },
  { value: "herzViabilität", labelDe: "Herz-Vitalität", labelEn: "Cardiac viability" },
];

// Radiotherapy reasons
export const radiotherapyReasons = [
  { value: "kurativ", labelDe: "Kurative Bestrahlung", labelEn: "Curative radiotherapy" },
  { value: "palliativ", labelDe: "Palliative Bestrahlung", labelEn: "Palliative radiotherapy" },
  { value: "adjuvant", labelDe: "Adjuvante Bestrahlung (nach OP)", labelEn: "Adjuvant radiotherapy (after surgery)" },
  { value: "neoadjuvant", labelDe: "Neoadjuvante Bestrahlung (vor OP)", labelEn: "Neoadjuvant radiotherapy (before surgery)" },
  { value: "gehirnMetastasen", labelDe: "Gehirnmetastasen", labelEn: "Brain metastases" },
  { value: "knochenMetastasen", labelDe: "Knochenmetastasen", labelEn: "Bone metastases" },
  { value: "brust", labelDe: "Brustkrebs", labelEn: "Breast cancer" },
  { value: "prostata", labelDe: "Prostatakrebs", labelEn: "Prostate cancer" },
];

// Cancer types
export const cancerTypes = [
  { value: "brustkrebs", labelDe: "Brustkrebs", labelEn: "Breast cancer" },
  { value: "prostatakrebs", labelDe: "Prostatakrebs", labelEn: "Prostate cancer" },
  { value: "lungenkrebs", labelDe: "Lungenkrebs", labelEn: "Lung cancer" },
  { value: "darmkrebs", labelDe: "Darmkrebs (Kolorektal)", labelEn: "Colorectal cancer" },
  { value: "hautkrebs", labelDe: "Hautkrebs (Melanom)", labelEn: "Skin cancer (Melanoma)" },
  { value: "basaliom", labelDe: "Basaliom (weißer Hautkrebs)", labelEn: "Basal cell carcinoma" },
  { value: "leberkrebs", labelDe: "Leberkrebs", labelEn: "Liver cancer" },
  { value: "magenkrebs", labelDe: "Magenkrebs", labelEn: "Stomach cancer" },
  { value: "bauchspeicheldruesenkrebs", labelDe: "Bauchspeicheldrüsenkrebs", labelEn: "Pancreatic cancer" },
  { value: "nierenkrebs", labelDe: "Nierenkrebs", labelEn: "Kidney cancer" },
  { value: "blasenkrebs", labelDe: "Blasenkrebs", labelEn: "Bladder cancer" },
  { value: "gebaermutterkrebs", labelDe: "Gebärmutterkrebs", labelEn: "Uterine cancer" },
  { value: "eierstockkrebs", labelDe: "Eierstockkrebs", labelEn: "Ovarian cancer" },
  { value: "hodenkrebs", labelDe: "Hodenkrebs", labelEn: "Testicular cancer" },
  { value: "schilddruesenkrebs", labelDe: "Schilddrüsenkrebs", labelEn: "Thyroid cancer" },
  { value: "lymphom", labelDe: "Lymphom (Hodgkin/Non-Hodgkin)", labelEn: "Lymphoma (Hodgkin/Non-Hodgkin)" },
  { value: "leukaemie", labelDe: "Leukämie", labelEn: "Leukemia" },
  { value: "gehirnTumor", labelDe: "Gehirntumor", labelEn: "Brain tumor" },
  { value: "speiseroehrenkrebs", labelDe: "Speiseröhrenkrebs", labelEn: "Esophageal cancer" },
  { value: "kehlkopfkrebs", labelDe: "Kehlkopfkrebs", labelEn: "Laryngeal cancer" },
];

// Organs for affected organs and metastases
export const organs = [
  { value: "leber", labelDe: "Leber", labelEn: "Liver" },
  { value: "lunge", labelDe: "Lunge", labelEn: "Lung" },
  { value: "knochen", labelDe: "Knochen", labelEn: "Bones" },
  { value: "gehirn", labelDe: "Gehirn", labelEn: "Brain" },
  { value: "lymphknoten", labelDe: "Lymphknoten", labelEn: "Lymph nodes" },
  { value: "nebenniere", labelDe: "Nebenniere", labelEn: "Adrenal gland" },
  { value: "milz", labelDe: "Milz", labelEn: "Spleen" },
  { value: "bauchfell", labelDe: "Bauchfell (Peritoneum)", labelEn: "Peritoneum" },
  { value: "haut", labelDe: "Haut", labelEn: "Skin" },
  { value: "niere", labelDe: "Niere", labelEn: "Kidney" },
  { value: "brust", labelDe: "Brust", labelEn: "Breast" },
  { value: "prostata", labelDe: "Prostata", labelEn: "Prostate" },
  { value: "gebaermutter", labelDe: "Gebärmutter", labelEn: "Uterus" },
  { value: "eierstock", labelDe: "Eierstock", labelEn: "Ovary" },
  { value: "darm", labelDe: "Darm", labelEn: "Intestine" },
  { value: "magen", labelDe: "Magen", labelEn: "Stomach" },
];

// Current tumor therapies
export const tumorTherapies = [
  { value: "immunotherapie", labelDe: "Immuntherapie (Checkpoint-Inhibitoren)", labelEn: "Immunotherapy (Checkpoint inhibitors)" },
  { value: "targeted", labelDe: "Zielgerichtete Therapie", labelEn: "Targeted therapy" },
  { value: "antikoerper", labelDe: "Antikörpertherapie", labelEn: "Antibody therapy" },
  { value: "hormontherapie", labelDe: "Hormontherapie", labelEn: "Hormone therapy" },
  { value: "chemotherapie", labelDe: "Chemotherapie", labelEn: "Chemotherapy" },
  { value: "strahlentherapie", labelDe: "Strahlentherapie", labelEn: "Radiotherapy" },
  { value: "radioiod", labelDe: "Radioiodtherapie", labelEn: "Radioiodine therapy" },
  { value: "stammzell", labelDe: "Stammzelltransplantation", labelEn: "Stem cell transplant" },
  { value: "carT", labelDe: "CAR-T-Zelltherapie", labelEn: "CAR-T cell therapy" },
];

// Food allergies (The Big 9 + more common ones)
export const foodAllergens = [
  { value: "milch", labelDe: "Milch/Milchprodukte", labelEn: "Milk/Dairy" },
  { value: "eier", labelDe: "Eier", labelEn: "Eggs" },
  { value: "erdnuesse", labelDe: "Erdnüsse", labelEn: "Peanuts" },
  { value: "baumnuesse", labelDe: "Baumnüsse (Mandeln, Walnüsse, Haselnüsse)", labelEn: "Tree nuts (Almonds, Walnuts, Hazelnuts)" },
  { value: "fisch", labelDe: "Fisch", labelEn: "Fish" },
  { value: "schalentiere", labelDe: "Schalentiere/Krustentiere", labelEn: "Shellfish/Crustaceans" },
  { value: "weizen", labelDe: "Weizen/Gluten", labelEn: "Wheat/Gluten" },
  { value: "soja", labelDe: "Soja", labelEn: "Soy" },
  { value: "sesam", labelDe: "Sesam", labelEn: "Sesame" },
  { value: "senf", labelDe: "Senf", labelEn: "Mustard" },
  { value: "sellerie", labelDe: "Sellerie", labelEn: "Celery" },
  { value: "lupine", labelDe: "Lupine", labelEn: "Lupine" },
  { value: "weichtiere", labelDe: "Weichtiere (Schnecken, Muscheln)", labelEn: "Mollusks (Snails, Mussels)" },
  { value: "zitrusfruechte", labelDe: "Zitrusfrüchte", labelEn: "Citrus fruits" },
  { value: "steinobst", labelDe: "Steinobst (Pfirsich, Kirsche)", labelEn: "Stone fruit (Peach, Cherry)" },
];

// Medication allergies
export const medicationAllergens = [
  { value: "penicillin", labelDe: "Penicillin/Antibiotika", labelEn: "Penicillin/Antibiotics" },
  { value: "sulfonamide", labelDe: "Sulfonamide", labelEn: "Sulfonamides" },
  { value: "aspirin", labelDe: "Aspirin/ASS", labelEn: "Aspirin/ASA" },
  { value: "nsaid", labelDe: "Ibuprofen/NSAIDs", labelEn: "Ibuprofen/NSAIDs" },
  { value: "cephalosporin", labelDe: "Cephalosporine", labelEn: "Cephalosporins" },
  { value: "lokalanästhetika", labelDe: "Lokalanästhetika", labelEn: "Local anesthetics" },
  { value: "kontrastmittel", labelDe: "Kontrastmittel (CT/MRT)", labelEn: "Contrast agents (CT/MRI)" },
  { value: "antikonvulsiva", labelDe: "Antikonvulsiva", labelEn: "Anticonvulsants" },
  { value: "insulin", labelDe: "Insulin", labelEn: "Insulin" },
  { value: "opioide", labelDe: "Opioide", labelEn: "Opioids" },
  { value: "muskelrelaxantien", labelDe: "Muskelrelaxantien", labelEn: "Muscle relaxants" },
];

// Contact allergies
export const contactAllergens = [
  { value: "nickel", labelDe: "Nickel", labelEn: "Nickel" },
  { value: "kobalt", labelDe: "Kobalt", labelEn: "Cobalt" },
  { value: "latex", labelDe: "Latex", labelEn: "Latex" },
  { value: "duftstoffe", labelDe: "Duftstoffe/Parfüm", labelEn: "Fragrances/Perfume" },
  { value: "kosmetika", labelDe: "Kosmetika", labelEn: "Cosmetics" },
  { value: "konservierungsstoffe", labelDe: "Konservierungsstoffe", labelEn: "Preservatives" },
  { value: "pflanzen", labelDe: "Pflanzen (z.B. Efeu, Ringelblume)", labelEn: "Plants (e.g. Ivy, Marigold)" },
  { value: "klebstoffe", labelDe: "Klebstoffe", labelEn: "Adhesives" },
  { value: "reiniger", labelDe: "Reinigungsmittel", labelEn: "Cleaning products" },
  { value: "waschmittel", labelDe: "Waschmittel", labelEn: "Laundry detergent" },
  { value: "seifen", labelDe: "Seifen", labelEn: "Soaps" },
  { value: "haarfarbe", labelDe: "Haarfarbe/PPD", labelEn: "Hair dye/PPD" },
  { value: "gummi", labelDe: "Gummi/Gummichemikalien", labelEn: "Rubber/Rubber chemicals" },
  { value: "chrom", labelDe: "Chrom", labelEn: "Chromium" },
];

// Medical specialties
export const medicalSpecialties = [
  { value: "allgemeinmedizin", labelDe: "Allgemeinmedizin", labelEn: "General medicine" },
  { value: "internist", labelDe: "Internist", labelEn: "Internist" },
  { value: "kardiologe", labelDe: "Kardiologe", labelEn: "Cardiologist" },
  { value: "gastroenterologe", labelDe: "Gastroenterologe", labelEn: "Gastroenterologist" },
  { value: "pneumologe", labelDe: "Pneumologe", labelEn: "Pulmonologist" },
  { value: "neurologe", labelDe: "Neurologe", labelEn: "Neurologist" },
  { value: "orthopaede", labelDe: "Orthopäde", labelEn: "Orthopedist" },
  { value: "dermatologe", labelDe: "Dermatologe", labelEn: "Dermatologist" },
  { value: "urologe", labelDe: "Urologe", labelEn: "Urologist" },
  { value: "gynakologe", labelDe: "Gynäkologe", labelEn: "Gynecologist" },
  { value: "hno", labelDe: "HNO-Arzt", labelEn: "ENT specialist" },
  { value: "augenarzt", labelDe: "Augenarzt", labelEn: "Ophthalmologist" },
  { value: "zahnarzt", labelDe: "Zahnarzt", labelEn: "Dentist" },
  { value: "psychiater", labelDe: "Psychiater", labelEn: "Psychiatrist" },
  { value: "psychologe", labelDe: "Psychologe", labelEn: "Psychologist" },
  { value: "endokrinologe", labelDe: "Endokrinologe", labelEn: "Endocrinologist" },
  { value: "rheumatologe", labelDe: "Rheumatologe", labelEn: "Rheumatologist" },
  { value: "onkologe", labelDe: "Onkologe", labelEn: "Oncologist" },
  { value: "nephrologe", labelDe: "Nephrologe", labelEn: "Nephrologist" },
  { value: "radiologe", labelDe: "Radiologe", labelEn: "Radiologist" },
  { value: "chirurg", labelDe: "Chirurg", labelEn: "Surgeon" },
  { value: "heilpraktiker", labelDe: "Heilpraktiker", labelEn: "Naturopath" },
  { value: "physiotherapeut", labelDe: "Physiotherapeut", labelEn: "Physiotherapist" },
  { value: "osteopath", labelDe: "Osteopath", labelEn: "Osteopath" },
];

// Passive smoking exposure options
export const passiveSmokingOptions = [
  { value: "partner", labelDe: "Partner raucht", labelEn: "Partner smokes" },
  { value: "arbeitsplatz", labelDe: "Am Arbeitsplatz", labelEn: "At workplace" },
  { value: "zuhause", labelDe: "Zu Hause (Mitbewohner)", labelEn: "At home (housemate)" },
  { value: "auto", labelDe: "Im Auto", labelEn: "In car" },
  { value: "gastronomie", labelDe: "Gastronomie/Bars", labelEn: "Restaurants/Bars" },
  { value: "selten", labelDe: "Selten/gelegentlich", labelEn: "Rarely/occasionally" },
];

// Alcohol types with images/glasses
export const alcoholTypes = [
  { value: "bier", labelDe: "Bier 🍺", labelEn: "Beer 🍺", glassSize: "0,5L" },
  { value: "wein", labelDe: "Wein 🍷", labelEn: "Wine 🍷", glassSize: "0,2L" },
  { value: "sekt", labelDe: "Sekt/Champagner 🥂", labelEn: "Sparkling wine 🥂", glassSize: "0,1L" },
  { value: "schnaps", labelDe: "Schnaps/Spirituosen 🥃", labelEn: "Spirits 🥃", glassSize: "2cl" },
  { value: "cocktail", labelDe: "Cocktails 🍹", labelEn: "Cocktails 🍹", glassSize: "0,3L" },
  { value: "likör", labelDe: "Likör", labelEn: "Liqueur", glassSize: "2cl" },
];

// Sports types
export const sportsTypes = [
  { value: "joggen", labelDe: "Joggen/Laufen 🏃", labelEn: "Jogging/Running 🏃" },
  { value: "walken", labelDe: "Walking/Nordic Walking 🚶", labelEn: "Walking/Nordic Walking 🚶" },
  { value: "schwimmen", labelDe: "Schwimmen 🏊", labelEn: "Swimming 🏊" },
  { value: "radfahren", labelDe: "Radfahren 🚴", labelEn: "Cycling 🚴" },
  { value: "wandern", labelDe: "Wandern 🥾", labelEn: "Hiking 🥾" },
  { value: "fitness", labelDe: "Fitnessstudio 🏋️", labelEn: "Gym 🏋️" },
  { value: "yoga", labelDe: "Yoga 🧘", labelEn: "Yoga 🧘" },
  { value: "pilates", labelDe: "Pilates", labelEn: "Pilates" },
  { value: "tennis", labelDe: "Tennis 🎾", labelEn: "Tennis 🎾" },
  { value: "fussball", labelDe: "Fußball ⚽", labelEn: "Football ⚽" },
  { value: "golf", labelDe: "Golf ⛳", labelEn: "Golf ⛳" },
  { value: "tanzen", labelDe: "Tanzen 💃", labelEn: "Dancing 💃" },
  { value: "skifahren", labelDe: "Skifahren ⛷️", labelEn: "Skiing ⛷️" },
  { value: "reiten", labelDe: "Reiten 🏇", labelEn: "Horse riding 🏇" },
  { value: "klettern", labelDe: "Klettern 🧗", labelEn: "Climbing 🧗" },
  { value: "kampfsport", labelDe: "Kampfsport 🥋", labelEn: "Martial arts 🥋" },
  { value: "gymnastik", labelDe: "Gymnastik", labelEn: "Gymnastics" },
  { value: "aquafitness", labelDe: "Aquafitness", labelEn: "Aqua fitness" },
];

// Walking distance options
export const walkingDistanceOptions = [
  { value: "500", labelDe: "< 500 m", labelEn: "< 500 m" },
  { value: "1000", labelDe: "500 - 1.000 m", labelEn: "500 - 1,000 m" },
  { value: "2000", labelDe: "1.000 - 2.000 m", labelEn: "1,000 - 2,000 m" },
  { value: "3000", labelDe: "2.000 - 3.000 m", labelEn: "2,000 - 3,000 m" },
  { value: "5000", labelDe: "3.000 - 5.000 m", labelEn: "3,000 - 5,000 m" },
  { value: "10000", labelDe: "5.000 - 10.000 m", labelEn: "5,000 - 10,000 m" },
  { value: "10000+", labelDe: "> 10.000 m", labelEn: "> 10,000 m" },
];

// Sleep duration options
export const sleepDurationOptions = [
  { value: "4", labelDe: "< 4 Stunden", labelEn: "< 4 hours" },
  { value: "5", labelDe: "4-5 Stunden", labelEn: "4-5 hours" },
  { value: "6", labelDe: "5-6 Stunden", labelEn: "5-6 hours" },
  { value: "7", labelDe: "6-7 Stunden", labelEn: "6-7 hours" },
  { value: "8", labelDe: "7-8 Stunden", labelEn: "7-8 hours" },
  { value: "9", labelDe: "8-9 Stunden", labelEn: "8-9 hours" },
  { value: "10", labelDe: "> 9 Stunden", labelEn: "> 9 hours" },
];

// Eating habits options
export const eatingHabitsOptions = [
  { value: "mischkost", labelDe: "Mischkost", labelEn: "Mixed diet" },
  { value: "vegetarisch", labelDe: "Vegetarisch 🥗", labelEn: "Vegetarian 🥗" },
  { value: "vegan", labelDe: "Vegan 🌱", labelEn: "Vegan 🌱" },
  { value: "mediterran", labelDe: "Mediterran 🫒", labelEn: "Mediterranean 🫒" },
  { value: "lowCarb", labelDe: "Low Carb", labelEn: "Low Carb" },
  { value: "keto", labelDe: "Ketogen", labelEn: "Ketogenic" },
  { value: "paleo", labelDe: "Paleo", labelEn: "Paleo" },
  { value: "glutenfrei", labelDe: "Glutenfrei", labelEn: "Gluten-free" },
  { value: "laktosefrei", labelDe: "Laktosefrei", labelEn: "Lactose-free" },
  { value: "intervallfasten", labelDe: "Intervallfasten", labelEn: "Intermittent fasting" },
  { value: "vollwertkost", labelDe: "Vollwertkost", labelEn: "Whole foods" },
  { value: "fastFood", labelDe: "Viel Fertiggerichte/Fast Food", labelEn: "Lots of convenience/fast food" },
];

// Tropical countries for travel
export const tropicalCountries = [
  { value: "thailand", labelDe: "Thailand 🇹🇭", labelEn: "Thailand 🇹🇭" },
  { value: "indonesien", labelDe: "Indonesien 🇮🇩", labelEn: "Indonesia 🇮🇩" },
  { value: "vietnam", labelDe: "Vietnam 🇻🇳", labelEn: "Vietnam 🇻🇳" },
  { value: "indien", labelDe: "Indien 🇮🇳", labelEn: "India 🇮🇳" },
  { value: "sriLanka", labelDe: "Sri Lanka 🇱🇰", labelEn: "Sri Lanka 🇱🇰" },
  { value: "philippinen", labelDe: "Philippinen 🇵🇭", labelEn: "Philippines 🇵🇭" },
  { value: "malaysia", labelDe: "Malaysia 🇲🇾", labelEn: "Malaysia 🇲🇾" },
  { value: "brasilien", labelDe: "Brasilien 🇧🇷", labelEn: "Brazil 🇧🇷" },
  { value: "mexiko", labelDe: "Mexiko 🇲🇽", labelEn: "Mexico 🇲🇽" },
  { value: "costaRica", labelDe: "Costa Rica 🇨🇷", labelEn: "Costa Rica 🇨🇷" },
  { value: "kolumbien", labelDe: "Kolumbien 🇨🇴", labelEn: "Colombia 🇨🇴" },
  { value: "peru", labelDe: "Peru 🇵🇪", labelEn: "Peru 🇵🇪" },
  { value: "kenia", labelDe: "Kenia 🇰🇪", labelEn: "Kenya 🇰🇪" },
  { value: "tansania", labelDe: "Tansania 🇹🇿", labelEn: "Tanzania 🇹🇿" },
  { value: "suedafrika", labelDe: "Südafrika 🇿🇦", labelEn: "South Africa 🇿🇦" },
  { value: "aegypten", labelDe: "Ägypten 🇪🇬", labelEn: "Egypt 🇪🇬" },
  { value: "marokko", labelDe: "Marokko 🇲🇦", labelEn: "Morocco 🇲🇦" },
  { value: "ghana", labelDe: "Ghana 🇬🇭", labelEn: "Ghana 🇬🇭" },
  { value: "nigeria", labelDe: "Nigeria 🇳🇬", labelEn: "Nigeria 🇳🇬" },
  { value: "kongo", labelDe: "Kongo 🇨🇩", labelEn: "Congo 🇨🇩" },
  { value: "madagaskar", labelDe: "Madagaskar 🇲🇬", labelEn: "Madagascar 🇲🇬" },
  { value: "kambodscha", labelDe: "Kambodscha 🇰🇭", labelEn: "Cambodia 🇰🇭" },
  { value: "myanmar", labelDe: "Myanmar 🇲🇲", labelEn: "Myanmar 🇲🇲" },
  { value: "laos", labelDe: "Laos 🇱🇦", labelEn: "Laos 🇱🇦" },
  { value: "papuaNeuguinea", labelDe: "Papua-Neuguinea 🇵🇬", labelEn: "Papua New Guinea 🇵🇬" },
  { value: "fidschi", labelDe: "Fidschi 🇫🇯", labelEn: "Fiji 🇫🇯" },
  { value: "dominikanischeRepublik", labelDe: "Dominikanische Republik 🇩🇴", labelEn: "Dominican Republic 🇩🇴" },
  { value: "kuba", labelDe: "Kuba 🇨🇺", labelEn: "Cuba 🇨🇺" },
  { value: "jamaika", labelDe: "Jamaika 🇯🇲", labelEn: "Jamaica 🇯🇲" },
];

// Since when options for nebenhöhlen (sinus)
export const sinceWhenOptions = [
  { value: "1monat", labelDe: "Seit ca. 1 Monat", labelEn: "For about 1 month" },
  { value: "3monate", labelDe: "Seit ca. 3 Monaten", labelEn: "For about 3 months" },
  { value: "6monate", labelDe: "Seit ca. 6 Monaten", labelEn: "For about 6 months" },
  { value: "1jahr", labelDe: "Seit ca. 1 Jahr", labelEn: "For about 1 year" },
  { value: "2jahre", labelDe: "Seit ca. 2 Jahren", labelEn: "For about 2 years" },
  { value: "5jahre", labelDe: "Seit ca. 5 Jahren", labelEn: "For about 5 years" },
  { value: "10jahre", labelDe: "Seit über 10 Jahren", labelEn: "For over 10 years" },
  { value: "kindheit", labelDe: "Seit Kindheit", labelEn: "Since childhood" },
];
