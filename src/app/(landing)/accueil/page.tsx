
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Bug, FolderKanban, FlaskConical, Microscope, Tractor, Wand2, Network, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";
import { LoginButton } from './login-button';

const tools = [
  {
    href: "/tools/diagnostic-image",
    icon: <Microscope className="w-8 h-8 text-primary" />,
    title: 'Diagnostic par Image',
    description: 'Analysez les photos de vos plantes pour identifier maladies et carences.',
    bgClass: 'from-green-500/10 to-card',
  },
  {
    href: "/tools/scouting",
    icon: <Bug className="w-8 h-8 text-primary" />,
    title: 'Scouting IA',
    description: 'Comptez les ravageurs sur pièges collants et évaluez le risque en temps réel.',
    bgClass: 'from-yellow-500/10 to-card',
  },
   {
    href: "/tools/analysis-interpreter",
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: 'Interprète d\'Analyse',
    description: 'Traduisez vos rapports de laboratoire en plans d\'action concrets.',
    bgClass: 'from-blue-500/10 to-card',
  },
   {
    href: "/tools/irrigation-designer",
    icon: <Network className="w-8 h-8 text-primary" />,
    title: 'Designer d\'Irrigation',
    description: 'Dimensionnez votre réseau d\'irrigation et comprenez les points critiques.',
    bgClass: 'from-cyan-500/10 to-card',
  },
  {
    href: "/tools/soilless-pilot",
    icon: <Tractor className="w-8 h-8 text-primary" />,
    title: 'Pilote Hors-Sol',
    description: 'Optimisez votre fertigation avec des recommandations basées sur vos données.',
    bgClass: 'from-purple-500/10 to-card',
  },
  {
    href: "/tools/recipe-calculator",
    icon: <Calculator className="w-8 h-8 text-primary" />,
    title: 'Calculateurs de Recette',
    description: 'Générez des recettes de solutions nutritives précises et adaptées.',
    bgClass: 'from-red-500/10 to-card',
  },
    {
        href: "/tools/yield-estimator",
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
        title: 'Estimateur de Récolte',
        description: 'Estimez le rendement potentiel de votre parcelle grâce à une analyse vidéo.',
        bgClass: 'from-orange-500/10 to-card',
    },
   {
    href: "/dashboard", 
    icon: <Wand2 className="w-8 h-8 text-primary" />,
    title: 'Assistant IA',
    description: 'Posez n\'importe quelle question technique et obtenez une réponse d\'expert.',
    bgClass: 'from-indigo-500/10 to-card',
  },
];

const CTA_BUTTON_TEXT = "Accéder à l'Application";

export default function LandingPage() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 text-center">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-foreground/80 to-primary">
              Pilotez vos Cultures avec l'Intelligence Artificielle
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              AgronomAi est votre assistant de terrain intelligent. Diagnostics, calculs, et conseils techniques à portée de main.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LoginButton size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  {CTA_BUTTON_TEXT}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </LoginButton>
            </div>
            <div className="pt-8">
              <Image
                src="/images/tracteur.png"
                alt="Image de fond agriculture high-tech"
                width={1200}
                height={400}
                data-ai-hint="greenhouse tractor"
                className="mx-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Conçu pour les défis de l'agriculture moderne</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Chaque outil est pensé pour répondre à un besoin précis du professionnel sur le terrain, alliant puissance de l'IA et expertise agronomique.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
                <Card key={tool.title} className={cn("group overflow-hidden transition-all duration-300 h-full border bg-gradient-to-br flex flex-col hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10", tool.bgClass)}>
                  <CardHeader className="items-start gap-4 flex-1">
                    <div className="p-3 rounded-full bg-primary/10">{tool.icon}</div>
                    <div className="space-y-1 text-left">
                      <CardTitle className="font-headline">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
            ))}
          </div>
           <div className="text-center">
                <LoginButton size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    {CTA_BUTTON_TEXT}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </LoginButton>
            </div>
        </div>
      </section>
    </>
  );
}
