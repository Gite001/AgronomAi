
"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Loader, Sparkles, Network, TriangleAlert, ArrowLeft } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import { designIrrigationNetwork, DesignIrrigationNetworkOutput, DesignIrrigationNetworkInput } from "@/ai/flows/design-irrigation-network";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function ReportSkeleton() {
    return (
        <div className="space-y-6">
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                <Loader className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 text-lg font-medium">Conception du réseau en cours...</p>
                <p className="text-sm">L'IA analyse les paramètres et calcule les spécifications optimales. Veuillez patienter.</p>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}

export default function IrrigationDesignerPage() {
  const [result, setResult] = useState<DesignIrrigationNetworkOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addEntry } = useJournal();
  
  const [formData, setFormData] = useState<Partial<DesignIrrigationNetworkInput>>({
    linesPerRow: '1'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' && value ? parseFloat(value) : value }));
  };

  const handleSelectChange = (name: keyof DesignIrrigationNetworkInput) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    
    if (!formData.surfaceArea || !formData.cropType || !formData.emitterType || !formData.emitterFlowRate || !formData.emitterSpacing || !formData.lineSpacing || !formData.linesPerRow || !formData.maxRowLength || !formData.pumpDistance || formData.plotElevation === undefined || !formData.energySource || !formData.waterSourceCapacity) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input = formData as DesignIrrigationNetworkInput;
      const res = await designIrrigationNetwork(input);
      setResult(res);
      addEntry({ tool: "Designer d'Irrigation", input, output: res });
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors de la conception.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Button variant="ghost" asChild>
        <Link href="/tools/accueil">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tous les outils
        </Link>
      </Button>
      <Card>
        <form onSubmit={handleSubmit}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Network className="text-primary"/>
                    Designer d'Irrigation
                </CardTitle>
                <CardDescription>
                    Dimensionnez votre réseau d'irrigation, de la pompe aux goutteurs, en fonction de vos paramètres agronomiques et de terrain.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="surfaceArea">Surface à irriguer (ha)</Label>
                        <Input name="surfaceArea" id="surfaceArea" type="number" step="0.1" placeholder="Ex: 5.5" required onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cropType">Type de culture</Label>
                        <Input name="cropType" id="cropType" placeholder="Ex: Tomate, Myrtille" required onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="linesPerRow">Gaines par ligne</Label>
                         <Select name="linesPerRow" required onValueChange={handleSelectChange('linesPerRow')} value={formData.linesPerRow}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2 (double gaine)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxRowLength">Longueur max. rampe (m)</Label>
                        <Input name="maxRowLength" id="maxRowLength" type="number" placeholder="Ex: 100" required onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lineSpacing">Ecart entre lignes (m)</Label>
                        <Input name="lineSpacing" id="lineSpacing" type="number" step="0.1" placeholder="Ex: 1.2" required onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="emitterType">Type d'émetteur</Label>
                         <Select name="emitterType" required onValueChange={handleSelectChange('emitterType')}>
                            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="t-tape">Gaine (T-Tape)</SelectItem>
                                <SelectItem value="pe-dripline-in-line">Goutteur intégré</SelectItem>
                                <SelectItem value="pe-dripline-on-line">Goutteur bouton</SelectItem>
                                <SelectItem value="sprinkler">Mini-asperseur</SelectItem>
                                <SelectItem value="mist-fogger">Nébulisateur (Fogger)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="emitterFlowRate">Débit émetteur (L/h)</Label>
                        <Input name="emitterFlowRate" id="emitterFlowRate" type="number" step="0.1" placeholder="Ex: 1.6" required onChange={handleInputChange}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="emitterSpacing">Ecart entre émetteurs (m)</Label>
                        <Input name="emitterSpacing" id="emitterSpacing" type="number" step="0.01" placeholder="Ex: 0.3" required onChange={handleInputChange}/>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pumpDistance">Distance pompe-parcelle (m)</Label>
                        <Input name="pumpDistance" id="pumpDistance" type="number" placeholder="Ex: 250" required onChange={handleInputChange}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="plotElevation">Dénivelé (m)</Label>
                        <Input name="plotElevation" id="plotElevation" type="number" placeholder="Ex: 5 ou -5" required onChange={handleInputChange}/>
                        <p className="text-xs text-muted-foreground">Positif si la parcelle est plus haute, négatif si elle est plus basse.</p>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="energySource">Source d'énergie</Label>
                        <Select name="energySource" required onValueChange={handleSelectChange('energySource')}>
                            <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electric">Électrique</SelectItem>
                                <SelectItem value="diesel">Gasoil (Diesel)</SelectItem>
                                <SelectItem value="gas">Gaz</SelectItem>
                                <SelectItem value="solar">Solaire</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="waterSourceCapacity">Débit source d'eau (m³/h)</Label>
                        <Input name="waterSourceCapacity" id="waterSourceCapacity" type="number" placeholder="Ex: 20" required onChange={handleInputChange}/>
                    </div>
                </div>

                {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Erreur de saisie</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            </CardContent>
            <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Conception en cours...</> : <><Sparkles className="mr-2 h-4 w-4" /> Lancer la Conception</>}
                </Button>
            </CardFooter>
        </form>

        {(loading || result || error && !loading) && (
            <div className="p-6 border-t min-h-[400px]">
                {loading && <ReportSkeleton />}
                {error && !loading && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Erreur de Conception</AlertTitle>
                        <AlertDescription>
                            {error}
                            <Button onClick={() => handleSubmit()} variant="secondary" className="mt-4">
                                Réessayer
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}
                {result && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Bot className="text-accent" /> Rapport de Conception Technique
                        </h3>
                        <Card className="bg-background/50">
                            <CardContent className="p-4 prose prose-sm prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: result.analysisReport }} />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        )}
      </Card>
    </div>
  );
}
