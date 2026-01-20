import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnamneseFormData } from "@/lib/anamneseFormData";
import { AlertTriangle, Shield, FileCheck, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
interface SignatureSectionProps {
  formData: AnamneseFormData;
  updateFormData: (field: string, value: any) => void;
}

const SignatureSection = ({ formData, updateFormData }: SignatureSectionProps) => {
  const { language } = useLanguage();

  const updateUnterschrift = (field: string, value: any) => {
    updateFormData("unterschrift", {
      ...formData.unterschrift,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Weitere Erkrankungen */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {language === "de" ? "Weitere Erkrankungen/Symptome" : "Additional Conditions/Symptoms"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de"
            ? "Haben Sie Erkrankungen oder Schmerzen, die in diesem Fragebogen noch nicht abgefragt wurden?"
            : "Do you have conditions or pain that were not asked about in this questionnaire?"}
        </p>
        <Textarea
          value={formData.weitereErkrankungen || ""}
          onChange={(e) => updateFormData("weitereErkrankungen", e.target.value)}
          rows={4}
          placeholder={language === "de" ? "Falls ja, bitte beschreiben..." : "If yes, please describe..."}
        />
      </div>

      <Separator />

      {/* Zusätzliche Informationen */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {language === "de" ? "Zusätzliche Informationen (Optional)" : "Additional Information (Optional)"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === "de"
            ? "Weitere Informationen, die für meine Behandlung relevant sein könnten:"
            : "Additional information that may be relevant for my treatment:"}
        </p>
        <Textarea
          value={formData.zusaetzlicheInfos || ""}
          onChange={(e) => updateFormData("zusaetzlicheInfos", e.target.value)}
          rows={4}
        />
      </div>

      <Separator />

      {/* DSGVO Hinweis */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex gap-4">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              {language === "de" ? "Datenschutz nach DSGVO" : "Data Protection (GDPR)"}
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {language === "de"
                ? "Ihre Daten werden verschlüsselt übertragen und gemäß den Bestimmungen der DSGVO verarbeitet. Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Die Aufbewahrungsfrist für Behandlungsdaten beträgt 10 Jahre."
                : "Your data is encrypted during transmission and processed in accordance with GDPR regulations. You have the right to access, correct, and delete your data at any time. Medical records are retained for 10 years."}
            </p>
          </div>
        </div>
      </div>

      {/* Unterschrift & Bestätigung */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <FileCheck className="w-5 h-5" />
          {language === "de" ? "Unterschrift & Bestätigung" : "Signature & Confirmation"}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ort">{language === "de" ? "Ort" : "Location"}</Label>
            <Input
              id="ort"
              value={formData.unterschrift?.ort || "Augsburg"}
              onChange={(e) => updateUnterschrift("ort", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datum">{language === "de" ? "Datum" : "Date"} *</Label>
            <Input
              id="datum"
              type="date"
              value={formData.unterschrift?.datum || ""}
              onChange={(e) => updateUnterschrift("datum", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameInDruckbuchstaben">
            {language === "de" ? "Name in Druckbuchstaben" : "Name in Block Letters"} *
          </Label>
          <Input
            id="nameInDruckbuchstaben"
            value={formData.unterschrift?.nameInDruckbuchstaben || ""}
            onChange={(e) => updateUnterschrift("nameInDruckbuchstaben", e.target.value)}
            className="uppercase"
            required
          />
        </div>

        {formData.geschlecht === "weiblich" && (
          <div className="space-y-2">
            <Label htmlFor="erziehungsberechtigter">
              {language === "de" 
                ? "Unterschrift Erziehungsberechtigter (falls minderjährig)" 
                : "Guardian Signature (if minor)"}
            </Label>
            <Input
              id="erziehungsberechtigter"
              value={formData.unterschrift?.erziehungsberechtigter || ""}
              onChange={(e) => updateUnterschrift("erziehungsberechtigter", e.target.value)}
            />
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <p className="text-sm">
            {language === "de"
              ? 'Hiermit bestätige ich, dass ich die obigen Informationen zu meiner Person nach bestem Wissen und Gewissen wahrheitsgemäß ausgefüllt habe. Ich habe die "Anleitung zum Ausfüllen" (S. 1) gelesen und verstanden. Ich bin damit einverstanden, dass diese Daten in meiner Patientenakte hinterlegt werden und in Zusammenhang mit meiner Behandlung verwendet werden.'
              : 'I hereby confirm that I have filled in the above information about myself truthfully to the best of my knowledge and belief. I have read and understood the "Instructions for Completion" (p. 1). I agree that this data will be stored in my patient file and used in connection with my treatment.'}
          </p>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="bestaetigung"
              checked={formData.unterschrift?.bestaetigung || false}
              onCheckedChange={(checked) => updateUnterschrift("bestaetigung", !!checked)}
              className="mt-1"
            />
            <Label htmlFor="bestaetigung" className="font-medium cursor-pointer">
              {language === "de"
                ? "Ich bestätige die Richtigkeit meiner Angaben. *"
                : "I confirm the accuracy of my information. *"}
            </Label>
          </div>

          {/* Datenschutz-Einwilligung mit Link */}
          <div className="flex items-start space-x-3 pt-2">
            <Checkbox
              id="datenschutzEinwilligung"
              checked={formData.unterschrift?.datenschutzEinwilligung || false}
              onCheckedChange={(checked) => updateUnterschrift("datenschutzEinwilligung", !!checked)}
              className="mt-1"
            />
            <Label htmlFor="datenschutzEinwilligung" className="font-medium cursor-pointer">
              {language === "de" ? (
                <>
                  Ich erlaube, dass meine Gesundheitsdaten (inkl. Messungen Metatron/Vieva Pro/EAV/Trikombin) für meine Behandlung gespeichert werden. E-Mail-Kommunikation (Rechnungen, Termine) ist ok. Ich habe die{" "}
                  <Link 
                    to="/datenschutz" 
                    target="_blank" 
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Datenschutzverordnung
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  {" "}gelesen und stimme zu. *
                </>
              ) : (
                <>
                  I allow my health data (including Metatron/Vieva Pro/EAV/Trikombin measurements) to be stored for my treatment. Email communication (invoices, appointments) is acceptable. I have read and agree to the{" "}
                  <Link 
                    to="/datenschutz" 
                    target="_blank" 
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  . *
                </>
              )}
            </Label>
          </div>
        </div>

        {/* Hinweis auf 2FA */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {language === "de"
                ? "Nach dem Absenden erhalten Sie einen Bestätigungscode per E-Mail zur rechtssicheren Verifizierung Ihrer digitalen Unterschrift gemäß § 126a BGB."
                : "After submission, you will receive a confirmation code by email for legally secure verification of your digital signature in accordance with § 126a BGB."}
            </p>
          </div>
        </div>
      </div>

      {/* Danksagung */}
      <div className="text-center py-6 space-y-2">
        <p className="text-lg font-semibold text-primary">
          {language === "de" 
            ? "VIELEN DANK FÜR IHRE GENAUE AUSFÜLLUNG!" 
            : "THANK YOU FOR COMPLETING THIS FORM CAREFULLY!"}
        </p>
        <p className="text-muted-foreground">
          {language === "de"
            ? "Diese Informationen sind die Grundlage für Ihre optimale Behandlung in der Naturheilpraxis Peter Rauch."
            : "This information forms the basis for your optimal treatment at the Naturopathic Practice Peter Rauch."}
        </p>
      </div>
    </div>
  );
};

export default SignatureSection;
