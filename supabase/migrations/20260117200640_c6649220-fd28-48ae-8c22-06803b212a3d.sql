-- Sprachunterstützung: Enum für verfügbare Sprachen
CREATE TYPE public.language_code AS ENUM ('de', 'en');

-- Tabelle für allgemeine Praxis-Informationen (verwaltbarer Themenbereich)
CREATE TABLE public.practice_info (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title_de TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_de TEXT NOT NULL,
    content_en TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- FAQ-Tabelle für mehrsprachige FAQs
CREATE TABLE public.faqs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_de TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_de TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.practice_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public read policies (öffentlich lesbar für alle Besucher)
CREATE POLICY "Anyone can view published practice info"
ON public.practice_info
FOR SELECT
USING (is_published = true);

CREATE POLICY "Anyone can view published faqs"
ON public.faqs
FOR SELECT
USING (is_published = true);

-- Trigger für automatische Timestamp-Updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_practice_info_updated_at
BEFORE UPDATE ON public.practice_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Initiale Daten für Praxis-Info (aus aktueller InfoSection)
INSERT INTO public.practice_info (slug, title_de, title_en, content_de, content_en, icon, sort_order) VALUES
('ganzheitlicher-ansatz', 'Ganzheitlicher Ansatz', 'Holistic Approach', 'Ich betrachte den Menschen als Einheit von Körper, Geist und Seele.', 'I consider the human being as a unity of body, mind and soul.', 'Heart', 1),
('natuerliche-heilmethoden', 'Natürliche Heilmethoden', 'Natural Healing Methods', 'Sanfte Therapien ohne belastende Nebenwirkungen für Ihren Körper.', 'Gentle therapies without burdening side effects for your body.', 'Shield', 2),
('individuelle-betreuung', 'Individuelle Betreuung', 'Individual Care', 'Persönliche Behandlungspläne, die auf Ihre Bedürfnisse zugeschnitten sind.', 'Personal treatment plans tailored to your needs.', 'Users', 3);

-- Initiale Daten für FAQs (aus aktueller FAQ-Seite)
INSERT INTO public.faqs (question_de, question_en, answer_de, answer_en, sort_order) VALUES
('Was passiert beim ersten Termin?', 'What happens at the first appointment?', 'Beim Ersttermin nehme ich mir viel Zeit für Sie. Wir besprechen ausführlich Ihre Beschwerden, Ihre Krankengeschichte und Ihren Lebensstil. Anschließend erfolgt eine körperliche Untersuchung. Basierend auf allen Informationen erstelle ich einen individuellen Behandlungsplan. Der Ersttermin dauert in der Regel 60-90 Minuten.', 'At the first appointment, I take a lot of time for you. We discuss your complaints, medical history and lifestyle in detail. This is followed by a physical examination. Based on all the information, I create an individual treatment plan. The first appointment usually takes 60-90 minutes.', 1),
('Muss ich den Anamnesebogen vorher ausfüllen?', 'Do I need to fill out the medical history form beforehand?', 'Es wäre sehr hilfreich, wenn Sie den Anamnesebogen vor Ihrem ersten Termin ausfüllen. So können wir die Zeit optimal nutzen und direkt in die Behandlung einsteigen. Sie finden den Bogen in dieser App unter ''Anamnesebogen''.', 'It would be very helpful if you fill out the medical history form before your first appointment. This way we can make optimal use of the time and start treatment directly. You can find the form in this app under ''Medical History Form''.', 2),
('Werden die Kosten von der Krankenkasse übernommen?', 'Are the costs covered by health insurance?', 'Private Krankenversicherungen und Beihilfestellen erstatten in der Regel die Kosten für Heilpraktikerbehandlungen, je nach Tarif ganz oder teilweise. Gesetzliche Krankenkassen übernehmen diese Kosten grundsätzlich nicht. Eine Heilpraktiker-Zusatzversicherung kann hier sinnvoll sein.', 'Private health insurance and subsidy offices usually reimburse the costs for alternative practitioner treatments, either in full or in part depending on the tariff. Statutory health insurance generally does not cover these costs. A supplementary alternative practitioner insurance can be useful here.', 3),
('Wie lange dauert eine Behandlungssitzung?', 'How long does a treatment session last?', 'Eine reguläre Behandlung dauert zwischen 30 und 60 Minuten, je nach Therapieverfahren und Ihren individuellen Bedürfnissen. Akupunkturbehandlungen dauern beispielsweise etwa 45 Minuten, manuelle Therapien ca. 30-45 Minuten.', 'A regular treatment lasts between 30 and 60 minutes, depending on the therapy method and your individual needs. Acupuncture treatments, for example, take about 45 minutes, manual therapies about 30-45 minutes.', 4),
('Wie viele Behandlungen sind nötig?', 'How many treatments are needed?', 'Das hängt stark von Ihren Beschwerden, deren Dauer und Ihrem allgemeinen Gesundheitszustand ab. Bei akuten Beschwerden sind oft schon wenige Behandlungen hilfreich. Chronische Erkrankungen erfordern meist eine längere Behandlungsreihe.', 'This depends heavily on your complaints, their duration and your general state of health. For acute complaints, just a few treatments are often helpful. Chronic diseases usually require a longer series of treatments.', 5),
('Behandeln Sie auch Kinder?', 'Do you also treat children?', 'Ja, ich behandle auch Kinder und Jugendliche. Die Naturheilkunde bietet gerade für Kinder sanfte und nebenwirkungsarme Behandlungsmöglichkeiten. Die Therapie wird selbstverständlich kindgerecht angepasst.', 'Yes, I also treat children and adolescents. Naturopathy offers especially gentle treatment options with few side effects for children. The therapy is of course adapted to be child-friendly.', 6),
('Was sollte ich zum Termin mitbringen?', 'What should I bring to the appointment?', 'Bitte bringen Sie aktuelle Befunde, Laborwerte und Röntgenbilder mit, sofern vorhanden. Auch eine Liste Ihrer aktuellen Medikamente ist wichtig. Wenn Sie den Anamnesebogen bereits ausgefüllt haben, ist das sehr hilfreich.', 'Please bring current findings, laboratory values and X-rays, if available. A list of your current medications is also important. If you have already filled out the medical history form, that is very helpful.', 7),
('Kann ich einen Termin absagen?', 'Can I cancel an appointment?', 'Termine können Sie bis 24 Stunden vorher kostenlos absagen oder verschieben. Bei kurzfristigeren Absagen oder Nichterscheinen muss ich leider eine Ausfallgebühr berechnen, da der Termin nicht mehr anderweitig vergeben werden kann.', 'Appointments can be cancelled or rescheduled free of charge up to 24 hours in advance. For shorter notice cancellations or no-shows, I unfortunately have to charge a cancellation fee as the appointment can no longer be given to someone else.', 8),
('Gibt es Parkplätze in der Nähe?', 'Is there parking nearby?', 'Ja, direkt vor der Praxis befinden sich kostenlose Parkplätze. Falls diese belegt sein sollten, finden Sie weitere Parkmöglichkeiten in den umliegenden Straßen.', 'Yes, there is free parking directly in front of the practice. If these are occupied, you will find further parking options in the surrounding streets.', 9),
('Ist die Praxis barrierefrei?', 'Is the practice accessible?', 'Die Praxisräume sind ebenerdig und barrierefrei zugänglich. Bei Mobilitätseinschränkungen sprechen Sie mich gerne vorher an, damit ich entsprechende Vorkehrungen treffen kann.', 'The practice rooms are on ground level and accessible. If you have mobility restrictions, please contact me beforehand so that I can make appropriate arrangements.', 10);