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
  const fieldMappings: Record<string, { de: string; en: string }> = {
    // General
    jahr: { de: 'Jahr', en: 'Year' },
    seit: { de: 'Seit', en: 'Since' },
    psa: { de: 'PSA-Wert', en: 'PSA Value' },
    
    // Men's health
    bph: { de: 'Gutartige Vergrößerung (BPH)', en: 'Benign Prostatic Hyperplasia' },
    prostatitis: { de: 'Prostatitis', en: 'Prostatitis' },
    prostatakarzinom: { de: 'Prostatakarzinom', en: 'Prostate Cancer' },
    hodenentzuendung: { de: 'Hodenentzündung', en: 'Orchitis' },
    hodentorsion: { de: 'Hodentorsion', en: 'Testicular Torsion' },
    hodenkrebs: { de: 'Hodenkrebs', en: 'Testicular Cancer' },
    varikozele: { de: 'Varikozele', en: 'Varicocele' },
    hydrozele: { de: 'Hydrozele', en: 'Hydrocele' },
    epididymitis: { de: 'Nebenhodenentzündung', en: 'Epididymitis' },
    nebenhodenzyste: { de: 'Nebenhodenzyste', en: 'Spermatocele' },
    
    // Allergies
    pollen: { de: 'Pollen', en: 'Pollen' },
    staub: { de: 'Hausstaub', en: 'House dust' },
    tierhaare: { de: 'Tierhaare', en: 'Animal hair' },
    schimmel: { de: 'Schimmel', en: 'Mold' },
    nickel: { de: 'Nickel', en: 'Nickel' },
    latex: { de: 'Latex', en: 'Latex' },
    
    // Heart
    herzinfarkt: { de: 'Herzinfarkt', en: 'Heart Attack' },
    bluthochdruck: { de: 'Bluthochdruck', en: 'High Blood Pressure' },
    herzrhythmusstoerung: { de: 'Herzrhythmusstörung', en: 'Arrhythmia' },
    
    // Lung
    asthma: { de: 'Asthma', en: 'Asthma' },
    copd: { de: 'COPD', en: 'COPD' },
    bronchitis: { de: 'Bronchitis', en: 'Bronchitis' },
    
    // Head
    migraene: { de: 'Migräne', en: 'Migraine' },
    trigeminus: { de: 'Trigeminusneuralgie', en: 'Trigeminal Neuralgia' },
    tinnitus: { de: 'Tinnitus', en: 'Tinnitus' },
  };
  
  const mapping = fieldMappings[key];
  if (mapping) {
    return language === 'de' ? mapping.de : mapping.en;
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
