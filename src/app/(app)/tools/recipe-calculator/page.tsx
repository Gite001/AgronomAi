import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calculator, ArrowLeft } from "lucide-react";

const calculators = [
    {
        name: "Fertilisation en Sol (Bilan Azoté)",
        description: "Calculez votre plan de fumure (N-P-K) en kg/ha à partir d'un objectif d'azote et d'un équilibre cible.",
        href: "/tools/recipe-calculator/soil-fertilization"
    },
    {
        name: "Bilan Cible (Hors-Sol)",
        description: "Générez une recette d'engrais à partir d'un bilan cible (N-P-K-Ca-Mg) et de PPM d'azote.",
        href: "/tools/recipe-calculator/target-balance"
    },
    {
        name: "Coïc-Lesaint (Hors-Sol)",
        description: "Générez une recette avancée basée sur une analyse complète de l'eau et une solution cible.",
        href: "/tools/recipe-calculator/coic-lesaint"
    }
]

export default function RecipeCalculatorPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-start">
                <Button variant="ghost" asChild>
                    <Link href="/tools/accueil">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tous les outils
                    </Link>
                </Button>
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-2">
                    <Calculator className="w-8 h-8 text-primary"/>
                    Calculateurs de Recette
                </h1>
                <p className="text-muted-foreground mt-2">Choisissez un type de calcul pour commencer.</p>
            </div>

            <div className="grid gap-6">
                {calculators.map(calc => (
                    <Link href={calc.href} key={calc.name} className="block">
                        <Card className="hover:border-primary transition-colors hover:bg-card">
                            <CardHeader>
                                <CardTitle>{calc.name}</CardTitle>
                                <CardDescription>{calc.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="text-primary p-0 h-auto">
                                    Utiliser cet outil <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
