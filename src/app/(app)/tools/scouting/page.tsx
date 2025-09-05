
"use client";

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countPests, CountPestsOutput } from "@/ai/flows/count-pests";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Bug, Image as ImageIcon, Loader, Sparkles, X, MapPin, LocateFixed, Camera, Upload, TriangleAlert, Info, ArrowLeft } from "lucide-react";
import { useJournal } from "@/context/journal-context";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";


interface Location {
  latitude: number;
  longitude: number;
}

function getFriendlyErrorMessage(error: any): string {
    const message = error.message || "Une erreur est survenue lors de l'analyse.";
    if (message.includes('429') || message.toLowerCase().includes('quota')) {
        return "Le service est actuellement très demandé. Veuillez réessayer dans quelques instants. Si le problème persiste, le quota de l'API a peut-être été atteint.";
    }
    if (message.toLowerCase().includes('safety')) {
        return "L'image n'a pas pu être analysée car elle a été bloquée par les filtres de sécurité.";
    }
    return message;
}

export default function ScoutingPage() {
  const [result, setResult] = useState<CountPestsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [riskThreshold, setRiskThreshold] = useState("");
  const [locationName, setLocationName] = useState("");
  const [gpsLocation, setGpsLocation] = useState<Location | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addEntry } = useJournal();
  const { toast } = useToast();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [inputMode, setInputMode] = useState('upload');
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (inputMode !== 'camera') {
        stream?.getTracks().forEach(track => track.stop());
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCameraPermission(false);
          toast({ variant: 'destructive', title: 'Caméra non supportée' });
          return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }});
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setHasCameraPermission(false);
      }
    };
  
    getCameraPermission();

    return () => {
        stream?.getTracks().forEach(track => track.stop());
    }
  }, [inputMode, toast]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');
            setPreview(dataUri);
            setResult(null);
            setError(null);
            setInputMode('upload');
        }
    }
  }


  const handleRemoveImage = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
    if (!preview) {
      setError("Veuillez sélectionner une image.");
      return;
    }
    if (!riskThreshold) {
        setError("Veuillez renseigner le seuil de risque.");
        return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input = {
        photoDataUri: preview,
        riskThreshold: parseInt(riskThreshold, 10),
      };
      const res = await countPests(input);
      setResult(res);

      const journalInput: any = { ...input };
      const locationData = gpsLocation ? { ...gpsLocation, name: locationName } : (locationName ? { name: locationName } : undefined);
      if (locationData) {
        journalInput.location = locationData;
      }

      addEntry({ 
        tool: 'Scouting IA', 
        input: journalInput, 
        output: res 
      });
    } catch (e: any) {
      setError(getFriendlyErrorMessage(e));
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
              <Bug className="text-primary" /> Scouting IA
            </CardTitle>
            <CardDescription>
              Laissez l'IA identifier et compter les ravageurs sur vos pièges collants, puis recevez une recommandation de lutte.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="risk-threshold" className="flex items-center gap-1.5">
                    Seuil de risque total
                    <Popover>
                        <PopoverTrigger asChild>
                            <button type="button" aria-label="Information sur le seuil de risque">
                                <Info className="h-3 w-3 text-muted-foreground animate-pulse"/>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="text-sm">
                            Indiquez le nombre total de ravageurs (tous types confondus) au-delà duquel une intervention est nécessaire. C'est une décision agronomique et économique qui vous appartient.
                        </PopoverContent>
                    </Popover>
                </Label>
              <Input
                id="risk-threshold"
                type="number"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(e.target.value)}
                placeholder="Ex: 50"
                required
              />
            </div>
            
            <Tabs value={inputMode} onValueChange={setInputMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4" /> Importer</TabsTrigger>
                    <TabsTrigger value="camera"><Camera className="mr-2 h-4 w-4" /> Caméra</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="pt-4">
                    <div className="space-y-2">
                        <Label>Photo du piège collant</Label>
                        {preview ? (
                            <div className="relative group">
                            <Image
                                src={preview}
                                alt="Aperçu du piège"
                                width={500}
                                height={300}
                                className="rounded-lg object-cover w-full aspect-video"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={handleRemoveImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            </div>
                        ) : (
                            <div 
                            className="flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-card"
                            onClick={() => fileInputRef.current?.click()}
                            >
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">Cliquez pour importer une image</p>
                            </div>
                            </div>
                        )}
                        <Input
                            id="trap-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="camera" className="pt-4 space-y-4">
                    <div className="w-full aspect-video rounded-md bg-background flex items-center justify-center overflow-hidden">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    </div>
                    {hasCameraPermission === false && (
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Accès Caméra Requis</AlertTitle>
                            <AlertDescription>
                                Veuillez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
                            </AlertDescription>
                        </Alert>
                    )}
                    {hasCameraPermission && (
                        <Button type="button" className="w-full" onClick={handleCapture}>
                            <Camera className="mr-2 h-4 w-4"/> Capturer la photo
                        </Button>
                    )}
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

            {error && (
              <Alert variant="destructive">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!preview || loading || !riskThreshold} className="w-full">
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Identifier & Compter
                </>
              )}
            </Button>
          </CardFooter>
        </form>
        {result && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="text-accent"/>
              Résultats de l'Analyse IA
            </h3>
            <div className="space-y-4">
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle className="text-base">Détail du comptage</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ravageur Identifié</TableHead>
                                <TableHead className="text-right">Nombre</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.pestCounts.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.pestType}</TableCell>
                                    <TableCell className="text-right">{item.count}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-bold bg-muted/50">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right text-lg">
                                    <span className={result.totalPestCount >= parseInt(riskThreshold, 10) ? "text-destructive" : "text-primary"}>
                                        {result.totalPestCount}
                                    </span>
                                    <span className="text-xs text-muted-foreground"> / {riskThreshold}</span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle className="text-base">Recommandation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{result.recommendation}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
