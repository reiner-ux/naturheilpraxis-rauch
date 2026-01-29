import { forwardRef } from "react";
import { AnamneseFormData, formSections } from "@/lib/anamneseFormData";
import IntroSection from "./IntroSection";
import PatientDataSection from "./PatientDataSection";
import FamilyHistorySection from "./FamilyHistorySection";
import MedicalHistorySection from "./MedicalHistorySection";
import WomenHealthSection from "./WomenHealthSection";
import MensHealthSection from "./MensHealthSection";
import SurgeriesSection from "./SurgeriesSection";
import CancerSection from "./CancerSection";
import AllergiesSection from "./AllergiesSection";
import MedicationsSection from "./MedicationsSection";
import LifestyleSection from "./LifestyleSection";
import EnvironmentSection from "./EnvironmentSection";
import InfectionsSection from "./InfectionsSection";
import VaccinationsSection from "./VaccinationsSection";
import ComplaintsSection from "./ComplaintsSection";
import PreferencesSection from "./PreferencesSection";
import SocialSection from "./SocialSection";
import SignatureSection from "./SignatureSection";

interface PrintViewProps {
  formData: AnamneseFormData;
  language: "de" | "en";
}

const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(
  ({ formData, language }, ref) => {
    // Dummy update function for read-only print view
    const noopUpdate = () => {};

    const renderSectionContent = (sectionId: string) => {
      switch (sectionId) {
        case "intro":
          return <IntroSection />;
        case "patientData":
          return <PatientDataSection formData={formData} updateFormData={noopUpdate} />;
        case "familyHistory":
          return <FamilyHistorySection formData={formData} updateFormData={noopUpdate} />;
        case "medicalHistory":
          return <MedicalHistorySection formData={formData} updateFormData={noopUpdate} />;
        case "complaints":
          return <ComplaintsSection formData={formData} updateFormData={noopUpdate} />;
        case "womenHealth":
          return <WomenHealthSection formData={formData} updateFormData={noopUpdate} />;
        case "mensHealth":
          return <MensHealthSection formData={formData} updateFormData={noopUpdate} />;
        case "surgeries":
          return <SurgeriesSection formData={formData} updateFormData={noopUpdate} />;
        case "cancer":
          return <CancerSection formData={formData} updateFormData={noopUpdate} />;
        case "allergies":
          return <AllergiesSection formData={formData} updateFormData={noopUpdate} />;
        case "medications":
          return <MedicationsSection formData={formData} updateFormData={noopUpdate} />;
        case "lifestyle":
          return <LifestyleSection formData={formData} updateFormData={noopUpdate} />;
        case "environment":
          return <EnvironmentSection formData={formData} updateFormData={noopUpdate} />;
        case "infections":
          return <InfectionsSection formData={formData} updateFormData={noopUpdate} />;
        case "vaccinations":
          return <VaccinationsSection formData={formData} updateFormData={noopUpdate} />;
        case "preferences":
          return <PreferencesSection formData={formData} updateFormData={noopUpdate} />;
        case "social":
          return <SocialSection formData={formData} updateFormData={noopUpdate} />;
        case "signature":
          return <SignatureSection formData={formData} updateFormData={noopUpdate} />;
        default:
          return null;
      }
    };

    return (
      <div ref={ref} className="print-view bg-white text-black p-8">
        {/* Header */}
        <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
          <h1 className="text-2xl font-bold mb-2">
            Naturheilpraxis Peter Rauch
          </h1>
          <p className="text-sm text-gray-600">
            Friedrich-Deffner-Straße 19a, 86163 Augsburg | Tel: 0821-2621462
          </p>
          <h2 className="text-xl font-semibold mt-4">
            {language === "de" ? "Anamnesebogen" : "Medical History Form"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {language === "de" 
              ? `Erstellt am: ${new Date().toLocaleDateString("de-DE")}`
              : `Created on: ${new Date().toLocaleDateString("en-US")}`}
          </p>
        </div>

        {/* Patient Name Header */}
        {(formData.vorname || formData.nachname) && (
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="text-lg font-semibold">
              {language === "de" ? "Patient/in: " : "Patient: "}
              {formData.vorname} {formData.nachname}
            </p>
            {formData.geburtsdatum && (
              <p className="text-sm text-gray-600">
                {language === "de" ? "Geburtsdatum: " : "Date of Birth: "}
                {formData.geburtsdatum}
              </p>
            )}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-8">
          {formSections.map((section) => (
            <div key={section.id} className="print-section page-break-inside-avoid">
              <h3 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 flex items-center gap-2">
                <span className="text-xl">{section.emoji}</span>
                {language === "de" ? section.titleDe : section.titleEn}
              </h3>
              <div className="pl-2">
                {renderSectionContent(section.id)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-500">
          <p>
            {language === "de" 
              ? "Dieses Dokument wurde elektronisch erstellt und ist ohne Unterschrift gültig."
              : "This document was created electronically and is valid without signature."}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Naturheilpraxis Peter Rauch | www.rauch-heilpraktiker.de
          </p>
        </div>
      </div>
    );
  }
);

PrintView.displayName = "PrintView";

export default PrintView;
