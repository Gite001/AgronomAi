
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estimateYield, EstimateYieldOutput, CropType } from "@/ai/flows/estimate-yield";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, FileVideo, Loader, Sparkles, X, BarChart3, TriangleAlert, Info, ArrowLeft, Percent, Trees, Weight, ListChecks, FileQuestion, Leaf } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

const CropTypeEnum = z.enum(["tomate", "poivron", "courgette", "melon", "haricot vert"]);


function ResultSkeleton() {
    return (
      <div className="space-y-6">
        <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
          <Loader className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg font-medium">Analyse vidéo en cours...</p>
          <p className="text-sm max-w-sm">L'IA compte les fruits et les fleurs. Cette opération peut prendre un moment en fonction de la durée de la vidéo.</p>
        </div>
        <div className="space-y-2"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-full" /></div>
        <div className="space-y-2"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-full" /></div>
      </div>
    );
  }

export default function YieldEstimatorPage() {
  const [result, setResult] = useState<EstimateYieldOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEntry } = useJournal();
  
  const [formData, setFormData] = useState({
      cropType: '' as CropType | '',
      initialPlantDensity: '',
      plantLossPercentage: '',
      avgFruitWeight: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSelectChange = (value: CropType) => {
    setFormData(prev => ({...prev, cropType: value}));
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError("La taille de la vidéo ne doit pas dépasser 50 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!videoPreview) {
      setError("Veuillez sélectionner une vidéo.");
      return;
    }
    
    if (!formData.cropType || !formData.initialPlantDensity || !formData.plantLossPercentage || !formData.avgFruitWeight) {
        setError("Veuillez remplir tous les champs de données, y compris le type de culture.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
        const input = {
            videoDataUri: videoPreview,
            cropType: formData.cropType as CropType,
            initialPlantDensity: parseFloat(formData.initialPlantDensity),
            plantLossPercentage: parseFloat(formData.plantLossPercentage),
            avgFruitWeight: parseFloat(formData.avgFruitWeight),
        };
      const res = await estimateYield(input);
      setResult(res);
      addEntry({ tool: "Estimateur de Récolte", input, output: res });
    } catch (e) {
        const err = e as Error;
        setError(err.message || "Une erreur est survenue lors de l'estimation.");
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
                    <BarChart3 className="text-primary" /> Estimateur de Récolte
                </CardTitle>
                <CardDescription>
                    Estimez votre rendement en analysant une courte vidéo de votre culture.
                </CardDescription>
                <div className="pt-1">
                  <Badge variant="outline">Version Bêta</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full mb-4 space-y-2">
                    <AccordionItem value="item-1" className="border rounded-md px-4 bg-card/50">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-base">
                                <Info className="h-5 w-5 text-accent"/>
                                Comment obtenir une bonne estimation ?
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                           <p>
                                Pour une estimation fiable, votre vidéo doit être un échantillon représentatif de la parcelle.
                                L'outil analyse une seule vidéo continue.
                           </p>
                           <p>
                                Protocole suggéré : Marchez lentement le long d'une rangée moyenne, en filmant les plantes à hauteur des fruits.
                                Déplacez-vous ensuite vers une zone différente (meilleure ou moins bonne) et continuez à filmer pour donner à l'IA un aperçu juste de l'hétérogénéité de votre culture.
                                Une vidéo stable et claire donnera toujours de meilleurs résultats.
                           </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border rounded-md px-4 bg-card/50">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-base">
                                <FileQuestion className="h-5 w-5 text-accent"/>
                                Comprendre Vos Résultats
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                           <p>Le rapport que vous obtiendrez est conçu pour vous donner une vision complète, à la fois immédiate et future.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Récolte Prête (Commercialisable) :</strong> Le rendement en kg/ha que vous pouvez récolter dès maintenant, basé uniquement sur les fruits mûrs.</li>
                                <li><strong>Récolte Totale Potentielle :</strong> Le rendement total en kg/ha si tous les fruits (mûrs, en véraison, verts) arrivent à maturité.</li>
                                <li><strong>Détails de l'Analyse :</strong> Le comptage moyen par plante (fruits mûrs, verts, bouquets floraux...) pour une transparence totale.</li>
                                <li><strong>Résumé & Fiabilité :</strong> Un commentaire de l'IA sur la qualité de l'analyse et un score de confiance en %.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ListChecks />
              Vos Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
                <Label>Vidéo de la parcelle</Label>
                {videoPreview ? (
                    <div className="relative group">
                    <video src={videoPreview} controls className="rounded-lg object-cover w-full aspect-video bg-black" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={handleRemoveVideo}>
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-card" onClick={() => fileInputRef.current?.click()}>
                    <div className="text-center">
                        <FileVideo className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Cliquez pour ajouter la vidéo (max 50Mo)</p>
                    </div>
                    </div>
                )}
                <Input id="video-file" type="file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cropType" className="flex items-center gap-1.5"><Leaf className="h-4 w-4"/>Type de culture</Label>
                    <Select name="cropType" required onValueChange={handleSelectChange} value={formData.cropType}>
                        <SelectTrigger><SelectValue placeholder="Choisir la culture..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tomate">Tomate</SelectItem>
                            <SelectItem value="poivron">Poivron / Piment</SelectItem>
                            <SelectItem value="courgette">Courgette</SelectItem>
                            <SelectItem value="melon">Melon</SelectItem>
                            <SelectItem value="haricot vert">Haricot Vert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="avgFruitWeight" className="flex items-center gap-1.5"><Weight className="h-4 w-4"/>Poids moyen du fruit (grammes)</Label>
                    <Input name="avgFruitWeight" id="avgFruitWeight" type="number" placeholder="grammes" required onChange={handleInputChange} value={formData.avgFruitWeight}/>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="initialPlantDensity" className="flex items-center gap-1.5"><Trees className="h-4 w-4"/>Densité de plantation (plants/ha)</Label>
                    <Input name="initialPlantDensity" id="initialPlantDensity" type="number" placeholder="plants/ha" required onChange={handleInputChange} value={formData.initialPlantDensity} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="plantLossPercentage" className="flex items-center gap-1.5"><Percent className="h-4 w-4"/>Manquants (%)</Label>
                    <Input name="plantLossPercentage" id="plantLossPercentage" type="number" placeholder="%" required onChange={handleInputChange} value={formData.plantLossPercentage}/>
                </div>
            </div>

            {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!videoPreview || loading || !formData.cropType || !formData.initialPlantDensity || !formData.plantLossPercentage || !formData.avgFruitWeight} className="w-full">
              {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Estimation en cours...</> : <><Sparkles className="mr-2 h-4 w-4" /> Estimer la Récolte</>}
            </Button>
          </CardFooter>
        </form>
        {(loading || result) && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent" /> Résultats de l'Estimation
            </h3>
            {loading ? <ResultSkeleton /> : (
            result && (
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Card className="bg-background/50">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Récolte Prête (Commercialisable)</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-primary">{result.estimatedReadyYield.toLocaleString()} kg/ha</p>
                                <p className="text-xs text-muted-foreground">Basé sur {result.avgFruitCountPerPlant.ripe} fruits mûrs/plante.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background/50">
                            <CardHeader className="pb-2"><CardTitle className="text-base">Récolte Totale Potentielle</CardTitle></CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{result.estimatedTotalYield.toLocaleString()} kg/ha</p>
                                <p className="text-xs text-muted-foreground">Basé sur tous les fruits détectés.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="bg-background/50">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Détails de l'analyse par plante</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div><p className="font-bold text-lg">{result.avgFruitCountPerPlant.ripe}</p><p className="text-xs text-muted-foreground">Fruits Mûrs</p></div>
                            <div><p className="font-bold text-lg">{result.avgFruitCountPerPlant.maturing}</p><p className="text-xs text-muted-foreground">En Véraison</p></div>
                            <div><p className="font-bold text-lg">{result.avgFruitCountPerPlant.green}</p><p className="text-xs text-muted-foreground">Fruits Verts</p></div>
                            <div>
                                <p className="font-bold text-lg">{result.avgFlowerCountPerPlant}</p>
                                <p className="text-xs text-muted-foreground">{formData.cropType === 'tomate' ? 'Bouquets Floraux' : 'Fleurs'}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-background/50">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Résumé de l'IA</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-sm italic text-muted-foreground">"{result.analysisSummary}"</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-semibold">Fiabilité de l'analyse :</span>
                                <span className="font-bold text-lg">{result.confidenceScore}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
