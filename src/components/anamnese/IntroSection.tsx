import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const IntroSection = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground">
          {language === "de" 
            ? "Sehr geehrte Patientin, sehr geehrter Patient,"
            : "Dear Patient,"}
        </p>
        <p>
          {language === "de"
            ? "Ich betreue meine Patienten stets gezielt! Dieser umfassende Anamnesebogen ermöglicht mir, Sie und Ihre Gesundheit in ihrer Ganzheit zu verstehen. Die Informationen bilden die Grundlage für eine wirksame, personalisierte Behandlung."
            : "I always take care of my patients in a targeted manner! This comprehensive medical history form allows me to understand you and your health in its entirety. The information forms the basis for effective, personalized treatment."}
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {language === "de" ? "Wie Sie diesen Bogen ausfüllen:" : "How to complete this form:"}
        </h3>
        <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
          <li>{language === "de" ? "Nur gesicherte Diagnosen eintragen – von Arzt, Psychologe, Heilpraktiker" : "Only enter confirmed diagnoses – from doctor, psychologist, naturopath"}</li>
          <li>{language === "de" ? "Keine Vermutungen – nur tatsächliche Erkrankungen und Beschwerden" : "No assumptions – only actual illnesses and complaints"}</li>
          <li>{language === "de" ? "Beschwerden aufführen, auch wenn sie nicht diagnostiziert wurden" : "List complaints, even if they haven't been diagnosed"}</li>
          <li>{language === "de" ? "Zeitangaben – ungefähres Jahr/Monat, wann Beschwerden begannen" : "Time information – approximate year/month when complaints started"}</li>
          <li>{language === "de" ? "Unsicherheiten klären – wir lösen fehlende Informationen zusammen" : "Clarify uncertainties – we'll resolve missing information together"}</li>
        </ol>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200 mb-3">
          <AlertCircle className="w-5 h-5" />
          {language === "de" ? "WICHTIG:" : "IMPORTANT:"}
        </h3>
        <div className="space-y-3 text-amber-900 dark:text-amber-100">
          <p>
            {language === "de"
              ? "Die Naturheilpraxis Peter Rauch behandelt eine große Anzahl von Beschwerden – nicht nur Herzbeschwerden, allgemeine Schmerzen, Nierenprobleme, Gelenkbeschwerden oder Zahnfleischentzündungen, sondern nahezu alle Beschwerdebilder. Deshalb ist der Anamnesebogen leider sehr umfangreich."
              : "The Naturopathic Practice Peter Rauch treats a large number of complaints – not just heart problems, general pain, kidney problems, joint problems or gum inflammation, but almost all symptom patterns. That's why the medical history form is unfortunately very extensive."}
          </p>
          <p className="font-semibold">
            {language === "de" ? "Aber: Sie müssen NICHTS komplett ausfüllen!" : "But: You don't have to complete EVERYTHING!"}
          </p>
          <p>
            {language === "de"
              ? "Der Bogen ist in klare Abschnitte unterteilt (z.B. Niere/Blase, Herz/Kreislauf, Gelenke, Haut...). Suchen Sie einfach den Abschnitt, der Ihre Beschwerden betrifft. Füllen Sie nur diese relevanten Abschnitte aus."
              : "The form is divided into clear sections (e.g. Kidney/Bladder, Heart/Circulation, Joints, Skin...). Simply look for the section that concerns your complaints. Only fill in these relevant sections."}
          </p>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-lg font-serif italic text-muted-foreground">
          {language === "de" 
            ? "Herzlich willkommen in meiner Praxis!"
            : "Welcome to my practice!"}
        </p>
        <p className="mt-2 font-semibold">Peter Rauch</p>
        <p className="text-sm text-muted-foreground">
          {language === "de" ? "Heilpraktiker & Physiotherapeut" : "Naturopath & Physiotherapist"}
        </p>
      </div>
    </div>
  );
};

export default IntroSection;
