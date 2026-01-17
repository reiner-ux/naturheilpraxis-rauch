import { Layout } from "@/components/layout/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    frage: "Was passiert beim ersten Termin?",
    antwort: "Beim Ersttermin nehme ich mir viel Zeit für Sie. Wir besprechen ausführlich Ihre Beschwerden, Ihre Krankengeschichte und Ihren Lebensstil. Anschließend erfolgt eine körperliche Untersuchung. Basierend auf allen Informationen erstelle ich einen individuellen Behandlungsplan. Der Ersttermin dauert in der Regel 60-90 Minuten.",
  },
  {
    frage: "Muss ich den Anamnesebogen vorher ausfüllen?",
    antwort: "Es wäre sehr hilfreich, wenn Sie den Anamnesebogen vor Ihrem ersten Termin ausfüllen. So können wir die Zeit optimal nutzen und direkt in die Behandlung einsteigen. Sie finden den Bogen in dieser App unter 'Anamnesebogen'.",
  },
  {
    frage: "Werden die Kosten von der Krankenkasse übernommen?",
    antwort: "Private Krankenversicherungen und Beihilfestellen erstatten in der Regel die Kosten für Heilpraktikerbehandlungen, je nach Tarif ganz oder teilweise. Gesetzliche Krankenkassen übernehmen diese Kosten grundsätzlich nicht. Eine Heilpraktiker-Zusatzversicherung kann hier sinnvoll sein. Gerne erstelle ich Ihnen einen Kostenvoranschlag.",
  },
  {
    frage: "Wie lange dauert eine Behandlungssitzung?",
    antwort: "Eine reguläre Behandlung dauert zwischen 30 und 60 Minuten, je nach Therapieverfahren und Ihren individuellen Bedürfnissen. Akupunkturbehandlungen dauern beispielsweise etwa 45 Minuten, manuelle Therapien ca. 30-45 Minuten.",
  },
  {
    frage: "Wie viele Behandlungen sind nötig?",
    antwort: "Das hängt stark von Ihren Beschwerden, deren Dauer und Ihrem allgemeinen Gesundheitszustand ab. Bei akuten Beschwerden sind oft schon wenige Behandlungen hilfreich. Chronische Erkrankungen erfordern meist eine längere Behandlungsreihe. Nach den ersten Sitzungen kann ich Ihnen eine bessere Einschätzung geben.",
  },
  {
    frage: "Behandeln Sie auch Kinder?",
    antwort: "Ja, ich behandle auch Kinder und Jugendliche. Die Naturheilkunde bietet gerade für Kinder sanfte und nebenwirkungsarme Behandlungsmöglichkeiten. Die Therapie wird selbstverständlich kindgerecht angepasst.",
  },
  {
    frage: "Was sollte ich zum Termin mitbringen?",
    antwort: "Bitte bringen Sie aktuelle Befunde, Laborwerte und Röntgenbilder mit, sofern vorhanden. Auch eine Liste Ihrer aktuellen Medikamente ist wichtig. Wenn Sie den Anamnesebogen bereits ausgefüllt haben, ist das sehr hilfreich.",
  },
  {
    frage: "Kann ich einen Termin absagen?",
    antwort: "Termine können Sie bis 24 Stunden vorher kostenlos absagen oder verschieben. Bei kurzfristigeren Absagen oder Nichterscheinen muss ich leider eine Ausfallgebühr berechnen, da der Termin nicht mehr anderweitig vergeben werden kann.",
  },
  {
    frage: "Gibt es Parkplätze in der Nähe?",
    antwort: "Ja, direkt vor der Praxis befinden sich kostenlose Parkplätze. Falls diese belegt sein sollten, finden Sie weitere Parkmöglichkeiten in den umliegenden Straßen.",
  },
  {
    frage: "Ist die Praxis barrierefrei?",
    antwort: "Die Praxisräume sind ebenerdig und barrierefrei zugänglich. Bei Mobilitätseinschränkungen sprechen Sie mich gerne vorher an, damit ich entsprechende Vorkehrungen treffen kann.",
  },
];

const FAQ = () => {
  return (
    <Layout>
      <div className="bg-sage-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Häufig gestellte Fragen
            </h1>
            <p className="text-lg text-muted-foreground">
              Antworten auf die wichtigsten Fragen rund um die Behandlung
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="mb-8 shadow-card">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-b border-border last:border-0"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-serif text-lg font-medium hover:no-underline [&[data-state=open]]:text-primary">
                      {faq.frage}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {faq.antwort}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Kontakt CTA */}
          <Card className="border-sage-200 bg-sage-50 shadow-card">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <HelpCircle className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="mb-2 font-serif text-xl font-semibold text-foreground">
                Ihre Frage war nicht dabei?
              </h2>
              <p className="mb-6 text-muted-foreground">
                Kontaktieren Sie mich gerne direkt – ich beantworte Ihre Fragen persönlich.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild>
                  <a href="tel:+49123456789">
                    <Phone className="mr-2 h-4 w-4" />
                    Anrufen
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/anamnesebogen">
                    Zum Anamnesebogen
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
