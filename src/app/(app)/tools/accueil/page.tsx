
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, Bug, FolderKanban, FlaskConical, Microscope, Tractor, Wand2, Network, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthGuard } from '@/components/layout/auth-guard';

const sanitaryTools = [
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
];

const fertigationTools = [
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
    href: "/tools/analysis-interpreter",
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: 'Interprète d\'Analyse',
    description: 'Traduisez vos rapports de laboratoire en plans d\'action concrets.',
    bgClass: 'from-blue-500/10 to-card',
  },
  {
    href: "/tools/recipe-calculator",
    icon: <Calculator className="w-8 h-8 text-primary" />,
    title: 'Calculateurs de Recette',
    description: 'Générez des recettes de solutions nutritives précises et adaptées.',
    bgClass: 'from-red-500/10 to-card',
  },
]

const strategicTools = [
    {
        href: "/tools/yield-estimator",
        icon: <BarChart3 className="w-8 h-8 text-primary" />,
        title: 'Estimateur de Récolte',
        description: 'Estimez le rendement potentiel de votre parcelle grâce à une analyse vidéo.',
        bgClass: 'from-orange-500/10 to-card',
    }
]

function ToolsHomeContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold font-headline">Outils Sanitaires</h2>
                <p className="text-muted-foreground">Diagnostic et surveillance des bioagresseurs.</p>
            </div>
             <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
                {sanitaryTools.map((tool) => (
                    <Link href={tool.href} key={tool.title}>
                        <Card className={cn("group overflow-hidden transition-all duration-300 h-full border bg-gradient-to-br flex flex-col hover:-translate-y-1 hover:shadow-lg", tool.bgClass)}>
                            <CardHeader className="items-start gap-4 flex-1">
                                <div className="p-3 rounded-full bg-primary/10">{tool.icon}</div>
                                <div className="space-y-1 text-left">
                                <CardTitle className="font-headline">{tool.title}</CardTitle>
                                <CardDescription>{tool.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>

        <section>
             <div className="mb-6">
                <h2 className="text-3xl font-bold font-headline">Nutrition & Irrigation</h2>
                <p className="text-muted-foreground">Calculs et dimensionnement pour une gestion optimale de l'eau et des nutriments.</p>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
                {fertigationTools.map((tool) => (
                    <Link href={tool.href} key={tool.title}>
                        <Card className={cn("group overflow-hidden transition-all duration-300 h-full border bg-gradient-to-br flex flex-col hover:-translate-y-1 hover:shadow-lg", tool.bgClass)}>
                            <CardHeader className="items-start gap-4 flex-1">
                                <div className="p-3 rounded-full bg-primary/10">{tool.icon}</div>
                                <div className="space-y-1 text-left">
                                <CardTitle className="font-headline">{tool.title}</CardTitle>
                                <CardDescription>{tool.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>

         <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold font-headline">Outils Stratégiques</h2>
                <p className="text-muted-foreground">Aide à la décision pour la planification et la commercialisation.</p>
            </div>
             <div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2">
                {strategicTools.map((tool) => (
                    <Link href={tool.href} key={tool.title}>
                        <Card className={cn("group overflow-hidden transition-all duration-300 h-full border bg-gradient-to-br flex flex-col hover:-translate-y-1 hover:shadow-lg", tool.bgClass)}>
                            <CardHeader className="items-start gap-4 flex-1">
                                <div className="p-3 rounded-full bg-primary/10">{tool.icon}</div>
                                <div className="space-y-1 text-left">
                                <CardTitle className="font-headline">{tool.title}</CardTitle>
                                <CardDescription>{tool.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    </div>
  );
}

export default function ToolsHomePage() {
    return (
        <AuthGuard>
            <ToolsHomeContent />
        </AuthGuard>
    )
}
