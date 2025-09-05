
"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Calculator, Loader, Sparkles, ArrowLeft, TriangleAlert } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import { calculateCoicLesaint, CalculateCoicLesaintOutput, CalculateCoicLesaintInput } from "@/ai/flows/calculate-coic-lesaint";
import Link from "next/link";

const elements = [
    { name: "pH", key: "ph", unit: "" },
    { name: "EC", key: "ec", unit: "dS/m" },
    { name: "HCO₃", key: "hco3", unit: "meq/L" },
    { name: "NO₃", key: "no3", unit: "meq/L" },
    { name: "P", key: "p", unit: "meq/L" },
    { name: "K", key: "k", unit: "meq/L" },
    { name: "Ca", key: "ca", unit: "meq/L" },
    { name: "Mg", key: "mg", unit: "meq/L" },
    { name: "SO₄", key: "so4", unit: "meq/L" },
    { name: "Cl", key: "cl", unit: "meq/L" },
    { name: "Na", key: "na", unit: "meq/L" },
];

const targetElements = elements.filter(el => !["pH", "EC", "Cl", "Na", "HCO₃"].includes(el.name));

export default function CoicLesaintPage() {
  const [result, setResult] = useState<CalculateCoicLesaintOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addEntry } = useJournal();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const waterAnalysis: { [key: string]: number } = {};
    const targetSolution: { [key: string]: number } = {};

    let hasTargetInput = false;
    targetElements.forEach(el => {
        const value = formData.get(`target_${el.key}`) as string;
        if (value) {
            targetSolution[el.key] = parseFloat(value);
            hasTargetInput = true;
        }
    });

    if (!hasTargetInput) {
        setError("Veuillez renseigner au moins un élément pour la solution cible.");
        return;
    }

    elements.forEach(el => {
        const value = formData.get(`water_${el.key}`) as string;
        if (value) waterAnalysis[el.key] = parseFloat(value);
    });
    
    const input: CalculateCoicLesaintInput = {
        waterAnalysis: waterAnalysis,
        targetSolution: targetSolution,
    };

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await calculateCoicLesaint(input);
      setResult(res);
      addEntry({ tool: 'Calculateur Coïc-Lesaint', input, output: res });
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors du calcul.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Button variant="ghost" asChild>
        <Link href="/tools/recipe-calculator">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tous les calculateurs
        </Link>
      </Button>
      <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Calculator className="text-primary"/>
                    Calculateur: Coïc-Lesaint
                </CardTitle>
                <CardDescription>
                    Générez une recette avancée basée sur une analyse complète de l'eau et une solution cible.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-lg font-medium">Analyse de l'eau</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {elements.map(el => (
                            <div className="space-y-1" key={`water_${el.key}`}>
                                <Label htmlFor={`water_${el.key}`} className="text-xs text-muted-foreground">{el.name} ({el.unit || 'unité'})</Label>
                                <Input name={`water_${el.key}`} id={`water_${el.key}`} type="number" step="0.01" placeholder="0.0" />
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label className="text-lg font-medium">Solution fille cible</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {targetElements.map(el => (
                            <div className="space-y-1" key={`target_${el.key}`}>
                                <Label htmlFor={`target_${el.key}`} className="text-xs text-muted-foreground">{el.name} ({el.unit})</Label>
                                <Input name={`target_${el.key}`} id={`target_${el.key}`} type="number" step="0.01" placeholder="0.0" />
                            </div>
                        ))}
                    </div>
                </div>

                {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Calcul en cours...</> : <><Sparkles className="mr-2 h-4 w-4" /> Calculer la recette</>}
                </Button>
            </CardFooter>
        </form>
        {result && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent" /> Recette Recommandée
            </h3>
            <Card className="bg-background/50">
              <CardHeader><CardTitle className="text-base">Recette de Solution Mère (A & B)</CardTitle></CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap font-mono bg-background p-3 rounded-md">
                    {result.recipe}
                </pre>
              </CardContent>
            </Card>
            <Card className="bg-background/50 mt-4">
              <CardHeader><CardTitle className="text-base">Instructions</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{result.instructions}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
