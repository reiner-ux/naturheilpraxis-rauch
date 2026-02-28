import { AnamneseFormData } from "./anamneseFormData";
import { generateEnhancedAnamnesePdf } from "./pdfExportEnhanced";

interface PdfExportOptions {
  formData: AnamneseFormData;
  language: "de" | "en";
}

/** Simple PDF export - delegates to the enhanced version which now covers all sections */
export const generateAnamnesePdf = ({ formData, language }: PdfExportOptions) => {
  generateEnhancedAnamnesePdf({ formData, language });
};
