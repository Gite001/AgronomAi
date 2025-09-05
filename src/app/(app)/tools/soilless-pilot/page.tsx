
"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recommendFertigationAdjustments, RecommendFertigationAdjustmentsOutput } from "@/ai/flows/recommend-fertigation-adjustments";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Loader, Sparkles, Tractor, MapPin, LocateFixed, ArrowLeft, TriangleAlert, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useJournal } from "@/context/journal-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

interface Location {
  latitude: number;
  longitude: number;
}

export default function SoillessPilotPage() {
  const [result, setResult] = useState<RecommendFertigationAdjustmentsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [gpsLocation, setGpsLocation] = useState<Location | null>(null);

  const { addEntry } = useJournal();
  const { toast } = useToast();

  const getGpsLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({ title: "Position GPS acquise", description: "Les coordonnées ont été enregistrées." });
        },
        (error) => {
          toast({ variant: "destructive", title: "Erreur de localisation", description: "Impossible d'obtenir la position GPS. Vérifiez les autorisations." });
        }
      );
    } else {
        toast({ variant: "destructive", title: "Géolocalisation non supportée", description: "Votre navigateur ne supporte pas la géolocalisation." });
    }
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      irrigationData: formData.get("irrigationData") as string,
      drainageData: formData.get("drainageData") as string,
      cropType: formData.get("cropType") as string,
      growthStage: formData.get("growthStage") as string,
      nutrientSolutionRecipe: formData.get("nutrientSolutionRecipe") as string,
    };

    if (!input.irrigationData || !input.drainageData || !input.cropType || !input.growthStage || !input.nutrientSolutionRecipe) {
        setError("Veuillez remplir tous les champs.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await recommendFertigationAdjustments(input);
      setResult(res);

      const journalInput: any = { ...input };
      const locationData = gpsLocation ? { ...gpsLocation, name: locationName } : (locationName ? { name: locationName } : undefined);
      if (locationData) {
        journalInput.location = locationData;
      }

      addEntry({ 
        tool: 'Pilote Hors-Sol', 
        input: journalInput, 
        output: res 
      });
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors de la recommandation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" asChild>
        <Link href="/tools/accueil">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tous les outils
        </Link>
      </Button>

      <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <Tractor className="text-primary" /> Pilote Hors-Sol
            </CardTitle>
            <CardDescription>
                Analysez vos données de fertigation pour recevoir des recommandations d'ajustement précises.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full mb-6 border rounded-md px-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2 text-base">
                            <Info className="h-5 w-5 text-accent"/>
                            Quand et Pourquoi Analyser ?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="prose prose-sm prose-invert max-w-none">
                        <p>Pour un pilotage de précision, la bonne fréquence est la clé.</p>
                        <h4>Le Suivi Quotidien : EC & pH</h4>
                        <p>Chaque jour, mesurez l'EC et le pH de votre solution de drainage. C'est votre tableau de bord. Une dérive rapide de l'EC vous alerte sur un déséquilibre entre la consommation d'eau et d'engrais.</p>
                        <h4>L'Analyse Laboratoire Complète</h4>
                        <p>C'est la "prise de sang" de votre culture. Elle vous dit exactement QUELS éléments sont consommés ou délaissés. La fréquence dépend du contexte :</p>
                        <ul>
                            <li><strong>En routine :</strong> Toutes les 1 à 2 semaines pour un contrôle et des ajustements fins.</li>
                            <li><strong>En période critique :</strong> Chaque semaine. Cela inclut les changements de stade (nouaison, grossissement), les changements météo brutaux, ou en cas de symptômes suspects.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Entrez vos données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Type de culture</Label>
                <Input id="cropType" name="cropType" placeholder="Ex: Tomate Grappe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="growthStage">Stade de croissance</Label>
                <Input id="growthStage" name="growthStage" placeholder="Ex: Nouaison" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="irrigationData">Données d'irrigation</Label>
              <Textarea id="irrigationData" name="irrigationData" placeholder="Volume, fréquence, durée, EC, pH..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drainageData">Données de drainage</Label>
              <Textarea id="drainageData" name="drainageData" placeholder="Volume, EC, pH..." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nutrientSolutionRecipe">Recette de solution nutritive actuelle</Label>
              <Textarea id="nutrientSolutionRecipe" name="nutrientSolutionRecipe" placeholder="Détaillez votre solution mère A et B..." required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-name" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Emplacement (Optionnel)
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                    id="location-name"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Ex: Serre A, Rangée 5"
                />
                <Button type="button" variant="outline" size="icon" onClick={getGpsLocation} aria-label="Obtenir la position GPS">
                    <LocateFixed className={`h-4 w-4 ${gpsLocation ? 'text-primary' : ''}`} />
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                 <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Analyse...</> : <><Sparkles className="mr-2 h-4 w-4" /> Obtenir une Recommandation</>}
            </Button>
          </CardFooter>
        </form>
        {result && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent" /> Recommandations IA
            </h3>
            <div className="space-y-4">
              <Card className="bg-background/50">
                <CardHeader><CardTitle className="text-base">Recommandations</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-wrap">{result.recommendations}</p></CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardHeader><CardTitle className="text-base">Raisonnement</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-wrap">{result.reasoning}</p></CardContent>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
