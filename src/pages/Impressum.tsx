import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, Phone, Mail, Globe, FileText, Shield, Scale } from "lucide-react";

const Impressum = () => {
  return (
    <Layout>
      <div className="bg-sage-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Impressum
            </h1>
            <p className="text-lg text-muted-foreground">
              Angaben gemäß § 5 TMG
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Anbieter */}
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Angaben zum Diensteanbieter
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium text-foreground">Peter Rauch</p>
                    <p>Heilpraktiker</p>
                    <p>Naturheilpraxis Peter Rauch</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontaktdaten */}
          <Card className="shadow-card">
            <CardContent className="p-8">
              <h2 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                Kontaktdaten
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground">
                      Friedrich-Deffner-Straße 19a<br />
                      86163 Augsburg
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Telefon</p>
                    <a href="tel:08212621462" className="text-sm text-muted-foreground hover:text-primary">
                      0821-2621462
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">E-Mail</p>
                    <a href="mailto:info@rauch-heilpraktiker.de" className="text-sm text-muted-foreground hover:text-primary">
                      info@rauch-heilpraktiker.de
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Website</p>
                    <a 
                      href="https://www.rauch-heilpraktiker.de" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      www.rauch-heilpraktiker.de
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Berufsbezeichnung */}
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Berufsbezeichnung und berufsrechtliche Regelungen
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Berufsbezeichnung:</strong> Heilpraktiker
                    </p>
                    <p>
                      <strong className="text-foreground">Zuständige Aufsichtsbehörde:</strong><br />
                      Gesundheitsamt der Stadt Augsburg<br />
                      Hoher Weg 8<br />
                      86152 Augsburg
                    </p>
                    <p>
                      <strong className="text-foreground">Berufsrechtliche Regelungen:</strong><br />
                      Gesetz über die berufsmäßige Ausübung der Heilkunde ohne Bestallung 
                      (Heilpraktikergesetz) vom 17.02.1939
                    </p>
                    <p>
                      <strong className="text-foreground">Erlaubnis erteilt durch:</strong><br />
                      Gesundheitsamt Augsburg
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Berufsverband */}
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Berufsverband
                  </h2>
                  <p className="text-muted-foreground">
                    Mitglied im Bund Deutscher Heilpraktiker e.V. (BDH)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verantwortlich für Inhalte */}
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="font-medium text-foreground">Peter Rauch</p>
                    <p>Friedrich-Deffner-Straße 19a</p>
                    <p>86163 Augsburg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Haftungshinweise */}
          <Card className="border-sage-200 bg-sage-50 shadow-card">
            <CardContent className="p-8">
              <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                Haftungshinweis
              </h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="mb-2 font-medium text-foreground">Haftung für Inhalte</h3>
                  <p>
                    Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                    Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. 
                    Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-foreground">Haftung für Links</h3>
                  <p>
                    Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen 
                    Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter 
                    oder Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werde ich 
                    derartige Links umgehend entfernen.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-foreground">Urheberrecht</h3>
                  <p>
                    Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                    dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Die 
                    Vervielfältigung, Bearbeitung und jede Art der Verwertung außerhalb der Grenzen des 
                    Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Impressum;
