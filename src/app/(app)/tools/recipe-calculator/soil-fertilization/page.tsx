
"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Calculator, Loader, Sparkles, ArrowLeft, TriangleAlert } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import { calculateSoilFertilization, CalculateSoilFertilizationOutput, CalculateSoilFertilizationInput } from "@/ai/flows/calculate-soil-fertilization";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";

export default function SoilFertilizationPage() {
  const [result, setResult] = useState<CalculateSoilFertilizationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addEntry } = useJournal();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input: CalculateSoilFertilizationInput = {
      nitrogenUnits: parseInt(formData.get("nitrogenUnits") as string, 10),
      targetBalance: formData.get("targetBalance") as string,
      availableFertilizers: formData.get("availableFertilizers") as string,
    };
    
    if (isNaN(input.nitrogenUnits) || !input.targetBalance) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await calculateSoilFertilization(input);
      setResult(res);
      addEntry({ tool: 'Calculateur Fertilisation Sol', input, output: res });
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors du calcul.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto space-y-4">
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
                     Calculateur: Fertilisation en Sol
                </CardTitle>
                <CardDescription>
                    Calculez votre plan de fumure en kg/ha à partir d'un objectif d'unités d'azote, d'un équilibre cible et de vos engrais disponibles.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nitrogenUnits">Unités d'Azote (N) souhaitées (kg/ha)</Label>
                    <Input id="nitrogenUnits" name="nitrogenUnits" type="number" placeholder="Ex: 180" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="targetBalance">Équilibre Cible (ex: N-P₂O₅-K₂O-MgO-CaO)</Label>
                    <Input id="targetBalance" name="targetBalance" placeholder="Ex: 1 - 0.5 - 1.2 - 0.3 - 0.4" required />
                    <p className="text-xs text-muted-foreground">Fournissez le rapport pour les éléments que vous souhaitez calculer.</p>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="availableFertilizers">Engrais disponibles (Optionnel)</Label>
                    <Textarea id="availableFertilizers" name="availableFertilizers" placeholder="Ex: Urée 46%, DAP 18-46-0, Sulfate de Potasse..." rows={3}/>
                     <p className="text-xs text-muted-foreground">Séparez les engrais par une virgule. L'IA essaiera de les utiliser en priorité.</p>
                </div>
                {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Calcul en cours...</> : <><Sparkles className="mr-2 h-4 w-4" /> Calculer le plan de fumure</>}
                </Button>
            </CardFooter>
        </form>
        {result && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent" /> Plan de Fumure Recommandé
            </h3>
            <Card className="bg-background/50">
              <CardContent className="p-4 prose prose-sm prose-invert max-w-none">
                 <ReactMarkdown>{result.markdownPlan}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
