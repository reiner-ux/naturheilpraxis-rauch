export const translations = {
  // Navigation
  nav: {
    home: { de: 'Start', en: 'Home' },
    anamnesis: { de: 'Anamnesebogen', en: 'Medical History' },
    privacy: { de: 'Datenschutzverordnung', en: 'Privacy Policy' },
    practitioner: { de: 'Was ist ein Heilpraktiker?', en: 'What is a Naturopath?' },
    fees: { de: 'GebÜH', en: 'Fee Schedule' },
    nutrition: { de: 'Ernährung', en: 'Nutrition' },
    faq: { de: 'FAQ', en: 'FAQ' },
    practice: { de: 'Praxis-Info', en: 'Practice Info' },
  },
  
  // Header
  header: {
    practice: { de: 'Naturheilpraxis', en: 'Naturopathic Practice' },
    owner: { de: 'Peter Rauch', en: 'Peter Rauch' },
    openMenu: { de: 'Menü öffnen', en: 'Open menu' },
  },
  
  // FAQ Page
  faq: {
    title: { de: 'Häufig gestellte Fragen', en: 'Frequently Asked Questions' },
    subtitle: { de: 'Antworten auf die wichtigsten Fragen rund um die Behandlung', en: 'Answers to the most important questions about treatment' },
    notFound: { de: 'Ihre Frage war nicht dabei?', en: 'Your question wasn\'t listed?' },
    contact: { de: 'Kontaktieren Sie mich gerne direkt – ich beantworte Ihre Fragen persönlich.', en: 'Feel free to contact me directly – I\'ll answer your questions personally.' },
    call: { de: 'Anrufen', en: 'Call' },
    toAnamnesis: { de: 'Zum Anamnesebogen', en: 'To Medical History Form' },
  },
  
  // Practice Info Page
  practiceInfo: {
    title: { de: 'Über die Praxis', en: 'About the Practice' },
    subtitle: { de: 'Wichtige Informationen zu meiner Naturheilpraxis', en: 'Important information about my naturopathic practice' },
    quote: { de: '"Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts."', en: '"Health is not everything, but without health, everything is nothing."' },
    quoteAuthor: { de: '— Arthur Schopenhauer', en: '— Arthur Schopenhauer' },
  },
  
  // Common
  common: {
    loading: { de: 'Laden...', en: 'Loading...' },
    error: { de: 'Fehler beim Laden', en: 'Error loading' },
  },
} as const;

export type TranslationKey = keyof typeof translations;
