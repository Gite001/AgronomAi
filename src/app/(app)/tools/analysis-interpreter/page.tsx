
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { interpretLabReport, InterpretLabReportOutput } from "@/ai/flows/interpret-lab-report";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, FileText, Image as ImageIcon, Loader, Sparkles, X, FlaskConical, MapPin, LocateFixed, ArrowLeft, TriangleAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJournal } from "@/context/journal-context";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";

interface Location {
  latitude: number;
  longitude: number;
}

export default function AnalysisInterpreterPage() {
  const [result, setResult] = useState<InterpretLabReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<"image" | "text">("image");
  const [locationName, setLocationName] = useState("");
  const [gpsLocation, setGpsLocation] = useState<Location | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEntry } = useJournal();
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    const reportData = mode === 'image' ? imagePreview : textInput;
    if (!reportData) {
      setError("Veuillez fournir un rapport (image ou texte).");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input = { reportData };
      const res = await interpretLabReport(input);
      setResult(res);
      
      const journalInput: any = { ...input };
      const locationData = gpsLocation ? { ...gpsLocation, name: locationName } : (locationName ? { name: locationName } : undefined);
      if (locationData) {
        journalInput.location = locationData;
      }

      addEntry({ 
        tool: "Interprète d'Analyse", 
        input: journalInput, 
        output: res 
      });
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors de l'interprétation.");
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
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <FlaskConical className="text-primary" /> Interprète d'Analyse
            </CardTitle>
            <CardDescription>
              Transformez vos rapports de laboratoire (sol, eau, sève...) en un plan d'action clair et exploitable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={mode} onValueChange={(value) => setMode(value as "text" | "image")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4"/> Image</TabsTrigger>
                <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4"/> Texte</TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="space-y-2 pt-4">
                <Label>Rapport (Fichier image)</Label>
                {imagePreview ? (
                  <div className="relative group">
                    <Image src={imagePreview} alt="Aperçu" width={500} height={300} className="rounded-lg object-contain w-full h-auto" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={handleRemoveImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-card" onClick={() => fileInputRef.current?.click()}>
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Cliquez pour ajouter l'image du rapport</p>
                    </div>
                  </div>
                )}
                <Input id="report-image" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              </TabsContent>
              <TabsContent value="text" className="space-y-2 pt-4">
                <Label htmlFor="report-text">Rapport (copier-coller)</Label>
                <Textarea id="report-text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Collez ici les données de votre rapport d'analyse..." rows={10} />
              </TabsContent>
            </Tabs>

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

            {error && <Alert variant="destructive"><TriangleAlert className="h-4 w-4" /><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={(!imagePreview && mode === 'image') || (!textInput && mode === 'text') || loading} className="w-full">
              {loading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Interprétation...</> : <><Sparkles className="mr-2 h-4 w-4" /> Interpréter le rapport</>}
            </Button>
          </CardFooter>
        </form>
        {result && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent" /> Plan d'Action Recommandé
            </h3>
            <Card className="bg-background/50">
              <CardContent className="p-4 prose prose-sm prose-invert max-w-none">
                 <ReactMarkdown>{result.actionablePlan}</ReactMarkdown>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
