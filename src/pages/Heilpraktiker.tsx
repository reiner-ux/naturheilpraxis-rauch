import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, BookOpen, Heart, Shield, Scale, Leaf } from "lucide-react";

const Heilpraktiker = () => {
  return (
    <Layout>
      <div className="bg-sage-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Was ist ein Heilpraktiker?
            </h1>
            <p className="text-lg text-muted-foreground">
              Erfahren Sie mehr über den Beruf des Heilpraktikers und die Naturheilkunde
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Introduction */}
          <Card className="mb-8 shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Der Beruf des Heilpraktikers
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Ein Heilpraktiker ist ein staatlich zugelassener Therapeut, der die Heilkunde ausübt,
                    ohne Arzt zu sein. Die Berufsbezeichnung ist in Deutschland durch das Heilpraktikergesetz
                    von 1939 geschützt. Um als Heilpraktiker tätig zu werden, muss eine umfangreiche Prüfung
                    beim Gesundheitsamt bestanden werden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key aspects */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-medium text-foreground">Ausbildung</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Heilpraktiker durchlaufen eine umfassende Ausbildung in Anatomie, Physiologie,
                  Pathologie, Diagnose und verschiedenen Therapieverfahren. Die staatliche Überprüfung
                  stellt sicher, dass keine Gefahr für die Volksgesundheit besteht.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-medium text-foreground">Ganzheitlicher Ansatz</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Im Mittelpunkt steht der Mensch als Ganzes – nicht nur einzelne Symptome.
                  Körper, Geist und Seele werden als Einheit betrachtet, um die Ursachen
                  von Beschwerden zu finden und zu behandeln.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/20">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-medium text-foreground">Rechtliche Grundlage</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Das Heilpraktikergesetz regelt die Ausübung der Heilkunde. Heilpraktiker
                  unterliegen der Schweigepflicht und müssen sich an strenge hygienische
                  und ethische Standards halten.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-medium text-foreground">Komplementär zur Schulmedizin</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Naturheilkunde ersetzt keine ärztliche Behandlung, sondern ergänzt sie.
                  Bei schweren Erkrankungen arbeiten Heilpraktiker oft Hand in Hand
                  mit Ärzten zusammen.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Treatment methods */}
          <Card className="mt-8 shadow-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                    Behandlungsmethoden
                  </h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    Heilpraktiker arbeiten mit einer Vielzahl natürlicher Therapieverfahren:
                  </p>
                  <ul className="grid gap-2 text-muted-foreground md:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Phytotherapie (Pflanzenheilkunde)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Homöopathie
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Akupunktur
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Schröpfen
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Ausleitungsverfahren
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Ernährungsberatung
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Manuelle Therapien
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Entspannungsverfahren
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Heilpraktiker;
