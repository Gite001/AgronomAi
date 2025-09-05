
"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Calculator, Loader, Sparkles, ArrowLeft, TriangleAlert } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import { calculateTargetBalance, CalculateTargetBalanceOutput } from "@/ai/flows/calculate-target-balance";
import Link from "next/link";

export default function TargetBalancePage() {
  const [result, setResult] = useState<CalculateTargetBalanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addEntry } = useJournal();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      nitrogenPPM: parseInt(formData.get("nitrogenPPM") as string, 10),
      targetBalance: formData.get("targetBalance") as string,
    };
    
    if (isNaN(input.nitrogenPPM) || !input.targetBalance) {
        setError("Veuillez remplir tous les champs correctement.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await calculateTargetBalance(input);
      setResult(res);
      addEntry({ tool: 'Calculateur Bilan Cible', input, output: res });
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
                     Calculateur: Bilan Cible
                </CardTitle>
                <CardDescription>
                    Générez une recette d'engrais à partir d'un bilan cible (N-P-K-Ca-Mg) et de la concentration en azote (N) souhaitée.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nitrogenPPM">Azote (N) en ppm</Label>
                    <Input id="nitrogenPPM" name="nitrogenPPM" type="number" placeholder="Ex: 200" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="targetBalance">Bilan Cible (N-P-K-Ca-Mg)</Label>
                    <Input id="targetBalance" name="targetBalance" placeholder="Ex: 1 - 0.5 - 1.5 - 0.8 - 0.4" required />
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
              <CardHeader><CardTitle className="text-base">Recette de Solution Mère (pour 1000L)</CardTitle></CardHeader>
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
