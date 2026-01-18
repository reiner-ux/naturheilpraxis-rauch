import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Heart, Wind, Droplets, Apple, Activity } from "lucide-react";

interface MedicalHistorySectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MedicalHistorySection = ({ formData, updateFormData }: MedicalHistorySectionProps) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("kopf");

  const updateNestedField = (section: string, field: string, subfield: string, value: any) => {
    const current = formData[section as keyof AnamneseFormData] as any;
    const currentField = current?.[field] || {};
    updateFormData(section, {
      ...current,
      [field]: { ...currentField, [subfield]: value }
    });
  };

  // Helper function to safely get boolean value from nested object
  const getNestedBoolean = (obj: any, key: string): boolean => {
    const value = obj?.[key];
    return typeof value === 'boolean' ? value : false;
  };

  const tabs = [
    { id: "kopf", labelDe: "Kopf & Nerven", labelEn: "Head & Nerves", icon: Brain },
    { id: "herz", labelDe: "Herz & Kreislauf", labelEn: "Heart & Circulation", icon: Heart },
    { id: "lunge", labelDe: "Lunge & Atmung", labelEn: "Lungs & Breathing", icon: Wind },
    { id: "magen", labelDe: "Magen & Darm", labelEn: "Stomach & Intestines", icon: Apple },
    { id: "niere", labelDe: "Niere & Blase", labelEn: "Kidney & Bladder", icon: Droplets },
    { id: "gelenke", labelDe: "Wirbelsäule & Gelenke", labelEn: "Spine & Joints", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte wählen Sie den Bereich aus, der für Ihre Beschwerden relevant ist:"
          : "Please select the area relevant to your complaints:"}
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{language === "de" ? tab.labelDe : tab.labelEn}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="kopf" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Kopf, Sinne & Nervensystem" : "Head, Senses & Nervous System"}</h4>
          
          <div className="grid gap-4">
            {/* Augenerkrankung */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
              <Checkbox
                  id="augenerkrankung"
                  checked={!!formData.kopfErkrankungen?.augenerkrankung?.ja}
                  onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "augenerkrankung", "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="augenerkrankung">{language === "de" ? "Augenerkrankungen" : "Eye Diseases"}</Label>
                  {formData.kopfErkrankungen?.augenerkrankung?.ja && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder={language === "de" ? "Jahr" : "Year"}
                        value={formData.kopfErkrankungen?.augenerkrankung?.jahr || ""}
                        onChange={(e) => updateNestedField("kopfErkrankungen", "augenerkrankung", "jahr", e.target.value)}
                        className="w-32"
                      />
                      <div className="flex flex-wrap gap-4">
                        {[
                          { key: "netzhaut", labelDe: "Netzhautablösung", labelEn: "Retinal Detachment" },
                          { key: "grauerStar", labelDe: "Grauer Star", labelEn: "Cataracts" },
                          { key: "gruenerStar", labelDe: "Grüner Star", labelEn: "Glaucoma" },
                          { key: "makula", labelDe: "Makuladegeneration", labelEn: "Macular Degeneration" },
                        ].map((option) => (
                          <div key={option.key} className="flex items-center gap-2">
                            <Checkbox
                              checked={getNestedBoolean(formData.kopfErkrankungen?.augenerkrankung, option.key)}
                              onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "augenerkrankung", option.key, !!checked)}
                            />
                            <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kopfschmerzen */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
              <Checkbox
                  id="kopfschmerzen"
                  checked={!!formData.kopfErkrankungen?.kopfschmerzen?.ja}
                  onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "kopfschmerzen", "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="kopfschmerzen">{language === "de" ? "Kopfschmerzen" : "Headaches"}</Label>
                  {formData.kopfErkrankungen?.kopfschmerzen?.ja && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder={language === "de" ? "Seit wann?" : "Since when?"}
                        value={formData.kopfErkrankungen?.kopfschmerzen?.seit || ""}
                        onChange={(e) => updateNestedField("kopfErkrankungen", "kopfschmerzen", "seit", e.target.value)}
                        className="w-48"
                      />
                      <div className="flex flex-wrap gap-4">
                        {[
                          { key: "rechts", labelDe: "rechts", labelEn: "right" },
                          { key: "links", labelDe: "links", labelEn: "left" },
                          { key: "hinterkopf", labelDe: "Hinterkopf", labelEn: "Back of head" },
                          { key: "stirn", labelDe: "Stirn", labelEn: "Forehead" },
                          { key: "migraene", labelDe: "Migräne", labelEn: "Migraine" },
                        ].map((option) => (
                          <div key={option.key} className="flex items-center gap-2">
                            <Checkbox
                              checked={getNestedBoolean(formData.kopfErkrankungen?.kopfschmerzen, option.key)}
                              onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "kopfschmerzen", option.key, !!checked)}
                            />
                            <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Schwindel */}
            <div className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
              <Checkbox
                  id="schwindel"
                  checked={!!formData.kopfErkrankungen?.schwindel?.ja}
                  onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "schwindel", "ja", !!checked)}
                />
                <div className="space-y-2 flex-1">
                  <Label htmlFor="schwindel">{language === "de" ? "Schwindel" : "Dizziness"}</Label>
                  {formData.kopfErkrankungen?.schwindel?.ja && (
                    <div className="space-y-3 mt-2">
                      <Input
                        placeholder={language === "de" ? "Seit wann?" : "Since when?"}
                        value={formData.kopfErkrankungen?.schwindel?.seit || ""}
                        onChange={(e) => updateNestedField("kopfErkrankungen", "schwindel", "seit", e.target.value)}
                        className="w-48"
                      />
                      <div className="flex flex-wrap gap-4">
                        {[
                          { key: "lagerung", labelDe: "Lagerungsschwindel", labelEn: "Positional vertigo" },
                          { key: "dreh", labelDe: "Drehschwindel", labelEn: "Rotational vertigo" },
                          { key: "schwank", labelDe: "Schwankschwindel", labelEn: "Swaying vertigo" },
                        ].map((option) => (
                          <div key={option.key} className="flex items-center gap-2">
                            <Checkbox
                              checked={getNestedBoolean(formData.kopfErkrankungen?.schwindel, option.key)}
                              onCheckedChange={(checked) => updateNestedField("kopfErkrankungen", "schwindel", option.key, !!checked)}
                            />
                            <Label className="font-normal text-sm">{language === "de" ? option.labelDe : option.labelEn}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Schlaf & Psychische Symptome */}
          <h4 className="font-semibold mt-8">{language === "de" ? "Schlaf & Psychische Symptome" : "Sleep & Psychological Symptoms"}</h4>
          <div className="grid gap-4">
            {[
              { key: "schlafstörung", labelDe: "Schlafstörungen", labelEn: "Sleep Disorders" },
              { key: "einschlafstörung", labelDe: "Einschlafstörung", labelEn: "Difficulty Falling Asleep" },
              { key: "durchschlafstörung", labelDe: "Durchschlafstörung", labelEn: "Difficulty Staying Asleep" },
              { key: "muedigkeit", labelDe: "Müdigkeit/Erschöpfung", labelEn: "Fatigue/Exhaustion" },
              { key: "konzentrationsstörung", labelDe: "Konzentrationsstörung", labelEn: "Concentration Problems" },
              { key: "vergesslichkeit", labelDe: "Vergesslichkeit", labelEn: "Forgetfulness" },
              { key: "angstzustaende", labelDe: "Angstzustände/Panikstörung", labelEn: "Anxiety/Panic Disorder" },
              { key: "stress", labelDe: "Stress (Arbeit/Freizeit)", labelEn: "Stress (Work/Leisure)" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={formData.schlafSymptome?.[item.key as keyof typeof formData.schlafSymptome]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("schlafSymptome", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {formData.schlafSymptome?.[item.key as keyof typeof formData.schlafSymptome]?.ja && (
                      <Input
                        placeholder={language === "de" ? "Seit wann?" : "Since when?"}
                        value={(formData.schlafSymptome?.[item.key as keyof typeof formData.schlafSymptome] as any)?.seit || ""}
                        onChange={(e) => updateNestedField("schlafSymptome", item.key, "seit", e.target.value)}
                        className="w-48 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="herz" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Herz & Kreislauf" : "Heart & Circulation"}</h4>
          <div className="grid gap-4">
            {[
              { key: "blutdruckHoch", labelDe: "Bluthochdruck", labelEn: "High Blood Pressure" },
              { key: "blutdruckNiedrig", labelDe: "Niedriger Blutdruck", labelEn: "Low Blood Pressure" },
              { key: "herzrhythmusstörung", labelDe: "Herzrhythmusstörung", labelEn: "Heart Rhythm Disorder" },
              { key: "herzschmerzen", labelDe: "Herzschmerzen/Angina pectoris", labelEn: "Heart Pain/Angina" },
              { key: "herzinfarkt", labelDe: "Herzinfarkt", labelEn: "Heart Attack" },
              { key: "herzschrittmacher", labelDe: "Herzschrittmacher", labelEn: "Pacemaker" },
              { key: "krampfadern", labelDe: "Krampfadern", labelEn: "Varicose Veins" },
              { key: "thrombose", labelDe: "Thrombose", labelEn: "Thrombosis" },
              { key: "oedeme", labelDe: "Geschwollene Beine/Ödeme", labelEn: "Swollen Legs/Edema" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={formData.herzKreislauf?.[item.key as keyof typeof formData.herzKreislauf]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("herzKreislauf", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {formData.herzKreislauf?.[item.key as keyof typeof formData.herzKreislauf]?.ja && (
                      <Input
                        placeholder={language === "de" ? "Jahr" : "Year"}
                        value={(formData.herzKreislauf?.[item.key as keyof typeof formData.herzKreislauf] as any)?.jahr || ""}
                        onChange={(e) => updateNestedField("herzKreislauf", item.key, "jahr", e.target.value)}
                        className="w-32 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lunge" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Lunge & Atmung" : "Lungs & Breathing"}</h4>
          <div className="grid gap-4">
            {[
              { key: "asthma", labelDe: "Lungenasthma", labelEn: "Lung Asthma" },
              { key: "lungenentzuendung", labelDe: "Lungenentzündung", labelEn: "Pneumonia" },
              { key: "bronchitis", labelDe: "Bronchitis", labelEn: "Bronchitis" },
              { key: "husten", labelDe: "Husten", labelEn: "Cough" },
              { key: "atemnot", labelDe: "Atemnot (Dyspnoe)", labelEn: "Shortness of Breath" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={formData.lungeAtmung?.[item.key as keyof typeof formData.lungeAtmung]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("lungeAtmung", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {formData.lungeAtmung?.[item.key as keyof typeof formData.lungeAtmung]?.ja && (
                      <Input
                        placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                        value={(formData.lungeAtmung?.[item.key as keyof typeof formData.lungeAtmung] as any)?.jahr || (formData.lungeAtmung?.[item.key as keyof typeof formData.lungeAtmung] as any)?.seit || ""}
                        onChange={(e) => updateNestedField("lungeAtmung", item.key, "jahr", e.target.value)}
                        className="w-32 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="magen" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Magen & Darm" : "Stomach & Intestines"}</h4>
          <div className="grid gap-4">
            {[
              { key: "magengeschwuer", labelDe: "Magengeschwür", labelEn: "Stomach Ulcer" },
              { key: "sodbrennen", labelDe: "Sodbrennen/Magensäure", labelEn: "Heartburn/Acid Reflux" },
              { key: "uebelkeit", labelDe: "Übelkeit", labelEn: "Nausea" },
              { key: "verstopfung", labelDe: "Verstopfung", labelEn: "Constipation" },
              { key: "durchfall", labelDe: "Durchfall", labelEn: "Diarrhea" },
              { key: "blaehungen", labelDe: "Blähungen/Darmgase", labelEn: "Bloating/Flatulence" },
              { key: "bauchschmerzen", labelDe: "Bauchschmerzen/-krämpfe", labelEn: "Abdominal Pain/Cramps" },
              { key: "reizdarm", labelDe: "Reizdarmsyndrom", labelEn: "Irritable Bowel Syndrome" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={formData.magenDarm?.[item.key as keyof typeof formData.magenDarm]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("magenDarm", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {formData.magenDarm?.[item.key as keyof typeof formData.magenDarm]?.ja && (
                      <Input
                        placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                        value={(formData.magenDarm?.[item.key as keyof typeof formData.magenDarm] as any)?.jahr || (formData.magenDarm?.[item.key as keyof typeof formData.magenDarm] as any)?.seit || ""}
                        onChange={(e) => updateNestedField("magenDarm", item.key, item.key === "magengeschwuer" ? "jahr" : "seit", e.target.value)}
                        className="w-32 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="niere" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Niere & Blase" : "Kidney & Bladder"}</h4>
          <div className="grid gap-4">
            {[
              { key: "nierenerkrankung", labelDe: "Nierenerkrankung", labelEn: "Kidney Disease" },
              { key: "blasenleiden", labelDe: "Blasenleiden", labelEn: "Bladder Condition" },
              { key: "nykturie", labelDe: "Nächtlicher Harndrang", labelEn: "Nocturia" },
              { key: "miktionsbeschwerden", labelDe: "Miktionsbeschwerden", labelEn: "Urination Problems" },
              { key: "inkontinenz", labelDe: "Harninkontinenz", labelEn: "Urinary Incontinence" },
              { key: "prostata", labelDe: "Prostataerkrankung (Männer)", labelEn: "Prostate Disease (Men)" },
            ].map((item) => {
              const fieldData = formData.niereBlase?.[item.key as keyof typeof formData.niereBlase] as any;
              const isChecked = fieldData && typeof fieldData === 'object' && 'ja' in fieldData ? Boolean(fieldData.ja) : false;
              return (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={!!isChecked}
                    onCheckedChange={(checked) => updateNestedField("niereBlase", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {isChecked && (
                      <Input
                        placeholder={language === "de" ? "Jahr/Seit" : "Year/Since"}
                        value={(fieldData as any)?.jahr || (fieldData as any)?.seit || ""}
                        onChange={(e) => updateNestedField("niereBlase", item.key, "jahr", e.target.value)}
                        className="w-32 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            );})}
          </div>
        </TabsContent>

        <TabsContent value="gelenke" className="space-y-6 mt-6">
          <h4 className="font-semibold">{language === "de" ? "Wirbelsäule & Gelenke" : "Spine & Joints"}</h4>
          <div className="grid gap-4">
            {[
              { key: "hws", labelDe: "HWS (Halswirbelsäule)", labelEn: "Cervical Spine" },
              { key: "bws", labelDe: "BWS (Brustwirbelsäule)", labelEn: "Thoracic Spine" },
              { key: "lws", labelDe: "LWS (Lendenwirbelsäule)", labelEn: "Lumbar Spine" },
              { key: "schulter", labelDe: "Schultergelenke", labelEn: "Shoulder Joints" },
              { key: "ellbogen", labelDe: "Ellbogengelenke", labelEn: "Elbow Joints" },
              { key: "handgelenk", labelDe: "Handgelenke", labelEn: "Wrist Joints" },
              { key: "huefte", labelDe: "Hüftgelenke", labelEn: "Hip Joints" },
              { key: "knie", labelDe: "Kniegelenke", labelEn: "Knee Joints" },
              { key: "fuss", labelDe: "Fußgelenke", labelEn: "Ankle Joints" },
              { key: "rheuma", labelDe: "Rheumatoide Arthritis", labelEn: "Rheumatoid Arthritis" },
            ].map((item) => (
              <div key={item.key} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={formData.wirbelsaeuleGelenke?.[item.key as keyof typeof formData.wirbelsaeuleGelenke]?.ja || false}
                    onCheckedChange={(checked) => updateNestedField("wirbelsaeuleGelenke", item.key, "ja", !!checked)}
                  />
                  <div className="space-y-2 flex-1">
                    <Label>{language === "de" ? item.labelDe : item.labelEn}</Label>
                    {formData.wirbelsaeuleGelenke?.[item.key as keyof typeof formData.wirbelsaeuleGelenke]?.ja && (
                      <div className="space-y-2 mt-2">
                        <Input
                          placeholder={language === "de" ? "Seit wann?" : "Since when?"}
                          value={(formData.wirbelsaeuleGelenke?.[item.key as keyof typeof formData.wirbelsaeuleGelenke] as any)?.seit || ""}
                          onChange={(e) => updateNestedField("wirbelsaeuleGelenke", item.key, "seit", e.target.value)}
                          className="w-48"
                        />
                        {["schulter", "ellbogen", "handgelenk", "huefte", "knie", "fuss"].includes(item.key) && (
                          <div className="flex flex-wrap gap-4">
                            {[
                              { key: "rechts", labelDe: "rechts", labelEn: "right" },
                              { key: "links", labelDe: "links", labelEn: "left" },
                              { key: "beidseitig", labelDe: "beidseitig", labelEn: "both sides" },
                            ].map((side) => (
                              <div key={side.key} className="flex items-center gap-2">
                                <Checkbox
                                  checked={(formData.wirbelsaeuleGelenke?.[item.key as keyof typeof formData.wirbelsaeuleGelenke] as any)?.[side.key] || false}
                                  onCheckedChange={(checked) => updateNestedField("wirbelsaeuleGelenke", item.key, side.key, !!checked)}
                                />
                                <Label className="font-normal text-sm">{language === "de" ? side.labelDe : side.labelEn}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalHistorySection;
