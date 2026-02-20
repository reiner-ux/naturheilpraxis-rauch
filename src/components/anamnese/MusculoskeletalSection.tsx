import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import SubConditionList from "./shared/SubConditionList";

interface MusculoskeletalSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const MusculoskeletalSection = ({ formData, updateFormData }: MusculoskeletalSectionProps) => {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const birthYear = formData.geburtsdatum ? new Date(formData.geburtsdatum).getFullYear() : undefined;
  const wgData = (formData.wirbelsaeuleGelenke || {}) as any;

  const setSectionOpen = (section: string, open: boolean) => {
    setExpandedSections(prev => ({ ...prev, [section]: open }));
  };

  const handleSubItemChange = (parentKey: string, subKey: string, subField: string, value: any) => {
    const parent = wgData[parentKey] || {};
    const subItem = parent[subKey];
    const currentSub = (typeof subItem === 'boolean')
      ? { ja: subItem, seit: "", status: "", bisJahr: "" }
      : { seit: "", status: "", bisJahr: "", ...(subItem || {}) };
    updateFormData("wirbelsaeuleGelenke", {
      ...wgData,
      [parentKey]: { ...parent, [subKey]: { ...currentSub, [subField]: value } }
    });
  };

  const renderCollapsibleSection = (
    sectionKey: string,
    emoji: string,
    labelDe: string,
    labelEn: string,
    items: { key: string; labelDe: string; labelEn: string; subOptions?: { key: string; labelDe: string; labelEn: string }[] }[]
  ) => (
    <Collapsible key={sectionKey} open={!!expandedSections[sectionKey]} onOpenChange={(open) => setSectionOpen(sectionKey, open)}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-4 border rounded-lg">
          <span className="font-medium">{language === "de" ? `${emoji} ${labelDe}` : `${emoji} ${labelEn}`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        <SubConditionList
          items={items}
          parentData={wgData[sectionKey] || {}}
          onSubItemChange={(subKey, subField, value) => handleSubItemChange(sectionKey, subKey, subField, value)}
          birthYear={birthYear}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  // Spinal segment options
  const hwsSegments = [
    { key: "C2C3", labelDe: "C2/C3", labelEn: "C2/C3" },
    { key: "C3C4", labelDe: "C3/C4", labelEn: "C3/C4" },
    { key: "C4C5", labelDe: "C4/C5", labelEn: "C4/C5" },
    { key: "C5C6", labelDe: "C5/C6", labelEn: "C5/C6" },
    { key: "C6C7", labelDe: "C6/C7", labelEn: "C6/C7" },
    { key: "C7T1", labelDe: "C7/Th1", labelEn: "C7/T1" },
  ];

  const bwsSegments = Array.from({ length: 12 }, (_, i) => ({
    key: `T${i + 1}T${i + 2}`,
    labelDe: `Th${i + 1}/Th${i + 2}`,
    labelEn: `T${i + 1}/T${i + 2}`,
  }));

  const lwsSegments = [
    { key: "L1L2", labelDe: "L1/L2", labelEn: "L1/L2" },
    { key: "L2L3", labelDe: "L2/L3", labelEn: "L2/L3" },
    { key: "L3L4", labelDe: "L3/L4", labelEn: "L3/L4" },
    { key: "L4L5", labelDe: "L4/L5", labelEn: "L4/L5" },
    { key: "L5S1", labelDe: "L5/S1", labelEn: "L5/S1" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {language === "de"
          ? "Bitte geben Sie an, ob Sie Erkrankungen der Wirbelsäule oder Gelenke haben oder hatten:"
          : "Please indicate if you have or had any spine or joint conditions:"}
      </p>

      <h4 className="font-semibold">{language === "de" ? "Wirbelsäule" : "Spine"}</h4>

      {renderCollapsibleSection("hws", "🦴", "HWS (Halswirbelsäule)", "Cervical Spine", [
        { key: "hwsSyndrom", labelDe: "HWS-Syndrom / Zervikalsyndrom", labelEn: "Cervical Syndrome" },
        { key: "bandscheibenvorfall", labelDe: "Bandscheibenvorfall", labelEn: "Herniated Disc", subOptions: hwsSegments },
        { key: "bandscheibenprotrusion", labelDe: "Bandscheibenprotrusion (Vorwölbung)", labelEn: "Disc Protrusion", subOptions: hwsSegments },
        { key: "spinalkanalstenose", labelDe: "Spinalkanalstenose", labelEn: "Spinal Stenosis" },
        { key: "verspannung", labelDe: "Muskelverspannung", labelEn: "Muscle Tension" },
        { key: "arthrose", labelDe: "Spondylarthrose", labelEn: "Spondylarthrosis" },
        { key: "myelopathie", labelDe: "Zervikale Myelopathie", labelEn: "Cervical Myelopathy" },
        { key: "facettensyndrom", labelDe: "Facettensyndrom", labelEn: "Facet Joint Syndrome" },
        { key: "schleudertrauma", labelDe: "Schleudertrauma", labelEn: "Whiplash" },
      ])}

      {renderCollapsibleSection("bws", "🦴", "BWS (Brustwirbelsäule)", "Thoracic Spine", [
        { key: "bwsSyndrom", labelDe: "BWS-Syndrom", labelEn: "Thoracic Spine Syndrome" },
        { key: "bandscheibenvorfall", labelDe: "Bandscheibenvorfall", labelEn: "Herniated Disc", subOptions: bwsSegments },
        { key: "bandscheibenprotrusion", labelDe: "Bandscheibenprotrusion (Vorwölbung)", labelEn: "Disc Protrusion", subOptions: bwsSegments },
        { key: "morbusScheuermann", labelDe: "Morbus Scheuermann", labelEn: "Scheuermann's Disease" },
        { key: "verspannung", labelDe: "Muskelverspannung", labelEn: "Muscle Tension" },
        { key: "interkostalneuralgie", labelDe: "Interkostalneuralgie", labelEn: "Intercostal Neuralgia" },
        { key: "arthrose", labelDe: "Spondylarthrose", labelEn: "Spondylarthrosis" },
      ])}

      {renderCollapsibleSection("lws", "🦴", "LWS (Lendenwirbelsäule)", "Lumbar Spine", [
        { key: "lwsSyndrom", labelDe: "LWS-Syndrom / Lumbalsyndrom", labelEn: "Lumbar Syndrome" },
        { key: "bandscheibenvorfall", labelDe: "Bandscheibenvorfall", labelEn: "Herniated Disc", subOptions: lwsSegments },
        { key: "bandscheibenprotrusion", labelDe: "Bandscheibenprotrusion (Vorwölbung)", labelEn: "Disc Protrusion", subOptions: lwsSegments },
        { key: "spinalkanalstenose", labelDe: "Spinalkanalstenose", labelEn: "Spinal Stenosis" },
        { key: "ischialgie", labelDe: "Ischialgie / Ischiasschmerz", labelEn: "Sciatica" },
        { key: "lumbago", labelDe: "Lumbago (Hexenschuss)", labelEn: "Lumbago" },
        { key: "spondylolisthesis", labelDe: "Spondylolisthesis (Wirbelgleiten)", labelEn: "Spondylolisthesis" },
        { key: "facettensyndrom", labelDe: "Facettensyndrom", labelEn: "Facet Joint Syndrome" },
        { key: "arthrose", labelDe: "Spondylarthrose", labelEn: "Spondylarthrosis" },
      ])}

      {renderCollapsibleSection("allgemeineWS", "🦴", "Allgemeine Wirbelsäulenerkrankungen", "General Spine Conditions", [
        { key: "skoliose", labelDe: "Skoliose", labelEn: "Scoliosis" },
        { key: "morbusBechterew", labelDe: "Morbus Bechterew", labelEn: "Ankylosing Spondylitis" },
        { key: "osteoporose", labelDe: "Osteoporose", labelEn: "Osteoporosis" },
        { key: "iliosakral", labelDe: "ISG-Syndrom (Iliosakralgelenk)", labelEn: "SI Joint Syndrome" },
      ])}

      <h4 className="font-semibold mt-6">{language === "de" ? "Gelenke" : "Joints"}</h4>

      {renderCollapsibleSection("schulter", "💪", "Schultergelenke", "Shoulder Joints", [
        { key: "impingement", labelDe: "Impingement-Syndrom", labelEn: "Impingement Syndrome" },
        { key: "rotatorenmanschette", labelDe: "Rotatorenmanschettenruptur", labelEn: "Rotator Cuff Tear" },
        { key: "frozenShoulder", labelDe: "Frozen Shoulder (Schultersteife)", labelEn: "Frozen Shoulder" },
        { key: "acGelenk", labelDe: "AC-Gelenk-Arthrose", labelEn: "AC Joint Arthrosis" },
        { key: "luxation", labelDe: "Schulterluxation", labelEn: "Shoulder Dislocation" },
        { key: "kalkschulter", labelDe: "Kalkschulter (Tendinosis calcarea)", labelEn: "Calcific Tendinitis" },
        { key: "bizepssehne", labelDe: "Bizepssehnenruptur", labelEn: "Biceps Tendon Rupture" },
        { key: "arthrose", labelDe: "Schulterarthrose (Omarthrose)", labelEn: "Shoulder Osteoarthritis" },
      ])}

      {renderCollapsibleSection("ellbogen", "💪", "Ellbogengelenke", "Elbow Joints", [
        { key: "tennisellbogen", labelDe: "Tennisellbogen (Epicondylitis lateralis)", labelEn: "Tennis Elbow" },
        { key: "golferellbogen", labelDe: "Golferellbogen (Epicondylitis medialis)", labelEn: "Golfer's Elbow" },
        { key: "bursitis", labelDe: "Bursitis olecrani (Schleimbeutelentzündung)", labelEn: "Olecranon Bursitis" },
        { key: "arthrose", labelDe: "Ellbogenarthrose (Cubitalarthrose)", labelEn: "Elbow Osteoarthritis" },
        { key: "sulcusUlnaris", labelDe: "Sulcus-ulnaris-Syndrom", labelEn: "Cubital Tunnel Syndrome" },
      ])}

      {renderCollapsibleSection("handgelenk", "🤚", "Handgelenke", "Wrist Joints", [
        { key: "karpaltunnel", labelDe: "Karpaltunnelsyndrom", labelEn: "Carpal Tunnel Syndrome" },
        { key: "sehnenscheidenentzuendung", labelDe: "Sehnenscheidenentzündung", labelEn: "Tendinitis" },
        { key: "ganglion", labelDe: "Ganglion (Überbein)", labelEn: "Ganglion Cyst" },
        { key: "arthrose", labelDe: "Handgelenksarthrose", labelEn: "Wrist Osteoarthritis" },
        { key: "deQuervain", labelDe: "De-Quervain-Syndrom", labelEn: "De Quervain's Tenosynovitis" },
        { key: "skaphoidfraktur", labelDe: "Kahnbeinbruch / Pseudarthrose", labelEn: "Scaphoid Fracture" },
      ])}

      {renderCollapsibleSection("finger", "🖐️", "Fingergelenke", "Finger Joints", [
        { key: "heberden", labelDe: "Heberden-Arthrose (Endgelenke)", labelEn: "Heberden's Nodes" },
        { key: "bouchard", labelDe: "Bouchard-Arthrose (Mittelgelenke)", labelEn: "Bouchard's Nodes" },
        { key: "rhizarthrose", labelDe: "Rhizarthrose (Daumensattelgelenk)", labelEn: "Thumb Basal Joint Arthritis" },
        { key: "dupuytren", labelDe: "Dupuytren-Kontraktur", labelEn: "Dupuytren's Contracture" },
        { key: "schnellenderFinger", labelDe: "Schnellender Finger (Trigger Finger)", labelEn: "Trigger Finger" },
      ])}

      {renderCollapsibleSection("huefte", "🦵", "Hüftgelenke", "Hip Joints", [
        { key: "coxarthrose", labelDe: "Coxarthrose (Hüftarthrose)", labelEn: "Hip Osteoarthritis" },
        { key: "dysplasie", labelDe: "Hüftdysplasie", labelEn: "Hip Dysplasia" },
        { key: "schenkelhalsbruch", labelDe: "Schenkelhalsbruch", labelEn: "Femoral Neck Fracture" },
        { key: "bursitis", labelDe: "Bursitis trochanterica", labelEn: "Trochanteric Bursitis" },
        { key: "labrumlaesion", labelDe: "Labrumläsion", labelEn: "Labral Tear" },
        { key: "huetkopfnekrose", labelDe: "Hüftkopfnekrose", labelEn: "Avascular Necrosis" },
        { key: "hueftTep", labelDe: "Hüft-TEP (Totalendoprothese)", labelEn: "Hip Replacement" },
      ])}

      {renderCollapsibleSection("knie", "🦵", "Kniegelenke", "Knee Joints", [
        { key: "gonarthrose", labelDe: "Gonarthrose (Kniearthrose)", labelEn: "Knee Osteoarthritis" },
        { key: "meniskus", labelDe: "Meniskusschaden", labelEn: "Meniscus Tear" },
        { key: "kreuzbandriss", labelDe: "Kreuzbandriss (vorderes/hinteres)", labelEn: "Cruciate Ligament Tear" },
        { key: "patellaluxation", labelDe: "Patellaluxation", labelEn: "Patellar Dislocation" },
        { key: "bakerZyste", labelDe: "Baker-Zyste", labelEn: "Baker's Cyst" },
        { key: "chondropathie", labelDe: "Chondropathie / Knorpelschaden", labelEn: "Chondropathy" },
        { key: "knieTep", labelDe: "Knie-TEP (Totalendoprothese)", labelEn: "Knee Replacement" },
      ])}

      {renderCollapsibleSection("fuss", "🦶", "Fuß & Sprunggelenk", "Foot & Ankle", [
        { key: "sprunggelenkarthrose", labelDe: "Sprunggelenksarthrose", labelEn: "Ankle Osteoarthritis" },
        { key: "achillessehne", labelDe: "Achillessehnenentzündung", labelEn: "Achilles Tendinitis" },
        { key: "plantarfasziitis", labelDe: "Plantarfasziitis", labelEn: "Plantar Fasciitis" },
        { key: "halluxValgus", labelDe: "Hallux valgus", labelEn: "Hallux Valgus" },
        { key: "fersensporn", labelDe: "Fersensporn", labelEn: "Heel Spur" },
        { key: "baenderriss", labelDe: "Bänderriss / Bandinstabilität", labelEn: "Ligament Tear" },
        { key: "mortonNeurom", labelDe: "Morton-Neurom", labelEn: "Morton's Neuroma" },
      ])}

      <h4 className="font-semibold mt-6">{language === "de" ? "Rheumatische Erkrankungen" : "Rheumatic Diseases"}</h4>

      {renderCollapsibleSection("rheuma", "🔥", "Rheumatische Erkrankungen", "Rheumatic Diseases", [
        { key: "rheumatoideArthritis", labelDe: "Rheumatoide Arthritis", labelEn: "Rheumatoid Arthritis" },
        { key: "arthrose", labelDe: "Arthrose (Gelenkverschleiß)", labelEn: "Osteoarthritis" },
        { key: "gicht", labelDe: "Gicht", labelEn: "Gout" },
        { key: "fibromyalgie", labelDe: "Fibromyalgie", labelEn: "Fibromyalgia" },
        { key: "osteoporoseRheuma", labelDe: "Osteoporose", labelEn: "Osteoporosis" },
        { key: "lupus", labelDe: "Lupus erythematodes", labelEn: "Lupus" },
        { key: "psoriasisArthritis", labelDe: "Psoriasis-Arthritis", labelEn: "Psoriatic Arthritis" },
        { key: "polymyalgia", labelDe: "Polymyalgia rheumatica", labelEn: "Polymyalgia Rheumatica" },
      ])}

      <div className="border rounded-lg p-4 bg-muted/30">
        <Label className="text-base font-medium">
          {language === "de" ? "Sonstige Erkrankungen" : "Other conditions"}
        </Label>
        <Textarea
          placeholder={language === "de" ? "Bitte beschreiben Sie weitere Erkrankungen..." : "Please describe other conditions..."}
          value={wgData?.sonstige || ""}
          onChange={(e) => updateFormData("wirbelsaeuleGelenke", { ...wgData, sonstige: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </div>
  );
};

export default MusculoskeletalSection;
