
"use client";

import { useState, useMemo } from 'react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Map as MapIcon, TriangleAlert, Thermometer, Bug, Leaf, MapPin } from "lucide-react";
import { useJournal, JournalEntry } from '@/context/journal-context';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { AuthGuard } from '@/components/layout/auth-guard';

interface MapMarker extends JournalEntry {
    position?: {
        lat: number;
        lng: number;
    },
    risk: 'high' | 'medium' | 'low';
}

function getRiskLevel(entry: JournalEntry): 'high' | 'medium' | 'low' {
    if (entry.tool === 'Diagnostic par Image' && entry.output.diagnosis) {
        const diagnosis = entry.output.diagnosis.toLowerCase();
        if (diagnosis.includes('sain') || diagnosis.includes('aucun problème')) return 'low';
        if (entry.output.suggestedAction?.toLowerCase().includes('surveiller')) return 'medium';
        return 'high';
    }
    if (entry.tool === 'Scouting IA' && entry.output.totalPestCount !== undefined && entry.input.riskThreshold !== undefined) {
        if (entry.output.totalPestCount >= entry.input.riskThreshold) return 'high';
        if (entry.output.totalPestCount > 0) return 'medium';
        return 'low';
    }
    if (entry.tool === 'Pilote Hors-Sol' && entry.output.recommendations) {
        const recommendations = entry.output.recommendations.toLowerCase();
        if (recommendations.includes("corriger") || recommendations.includes("important") || recommendations.includes("fortement")) return 'high';
        if (recommendations.includes("ajuster") || recommendations.includes("augmenter") || recommendations.includes("réduire")) return 'medium';
    }
    return 'low';
}


function MarkerInfo({ entry }: { entry: MapMarker }) {
    return (
        <Card className="w-64 border-none shadow-none bg-transparent">
            <CardHeader className="p-2">
                <CardTitle className="text-sm flex items-center justify-between">
                    {entry.input.location?.name || 'Analyse'}
                    <Badge variant="secondary">{entry.tool}</Badge>
                </CardTitle>
                <CardDescription>
                    {format(new Date(entry.timestamp), "d MMM yyyy, HH:mm", { locale: fr })}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-2 text-xs space-y-1">
                {entry.tool === 'Diagnostic par Image' && (
                    <p className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-primary"/>
                        <strong>Diagnostic:</strong> {entry.output.diagnosis}
                    </p>
                )}
                 {entry.tool === 'Scouting IA' && (
                    <p className="flex items-center gap-2">
                        <Bug className="w-4 h-4 text-destructive"/>
                        <strong>Total:</strong> {entry.output.totalPestCount}
                    </p>
                )}
                 {entry.tool === 'Pilote Hors-Sol' && (
                    <p className="flex items-center gap-2">
                       <Thermometer className="w-4 h-4 text-blue-400"/>
                        <strong>Culture:</strong> {entry.input.cropType}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

function RiskIndicator({ risk }: { risk: 'high' | 'medium' | 'low' }) {
    const riskClasses = {
        high: 'bg-destructive',
        medium: 'bg-accent',
        low: 'bg-primary'
    };
    return <div className={cn("w-3 h-3 rounded-full flex-shrink-0", riskClasses[risk])}></div>;
}

function GeotaggedList({ markers }: { markers: MapMarker[] }) {
    return (
        <Card>
            <CardHeader>
                <Alert>
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Mode Liste Activé</AlertTitle>
                    <AlertDescription>
                        La clé API Google Maps n'est pas configurée. Les diagnostics sont affichés sous forme de liste.
                    </AlertDescription>
                </Alert>
            </CardHeader>
            <CardContent>
                {markers.length > 0 ? (
                    <ul className="space-y-3">
                        {markers.map(entry => (
                            <li key={entry.id} className="flex items-start gap-4 p-3 border rounded-lg">
                                <RiskIndicator risk={entry.risk} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{entry.input.location?.name || 'Lieu non spécifié'}</p>
                                        <Badge variant="secondary">{entry.tool}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: fr })}</p>
                                     <p className="text-sm mt-2">{entry.output.diagnosis || entry.output.recommendation || `Comptage total: ${entry.output.totalPestCount}`}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50"/>
                        <p className="mt-4 font-semibold">Aucun diagnostic géolocalisé</p>
                        <p className="text-sm">Utilisez les outils en activant la localisation pour voir les entrées ici.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function MapContent() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID;
    const defaultPosition = { lat: 30.4165, lng: -9.5982 }; // Agadir, Morocco
    
    const { entries } = useJournal();
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

    const markers = useMemo<MapMarker[]>(() => {
        return entries
            .filter(entry => entry.input?.location?.latitude && entry.input?.location?.longitude)
            .map(entry => ({
                ...entry,
                position: {
                    lat: entry.input.location.latitude,
                    lng: entry.input.location.longitude
                },
                risk: getRiskLevel(entry),
            }));
    }, [entries]);

    const mapCenter = useMemo(() => {
        if (markers.length > 0) {
            const avgLat = markers.reduce((sum, m) => sum + m.position!.lat, 0) / markers.length;
            const avgLng = markers.reduce((sum, m) => sum + m.position!.lng, 0) / markers.length;
            return { lat: avgLat, lng: avgLng };
        }
        return defaultPosition;
    }, [markers]);


    return (
        <div className="space-y-6 h-full flex flex-col">
             <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <MapIcon /> Cartographie des Risques
                </h1>
                <p className="text-muted-foreground">Visualisez vos diagnostics géolocalisés avec un code couleur de risque.</p>
            </div>
            
            {!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
                <GeotaggedList markers={markers} />
            ) : (
                 <Card className="flex-1 h-[70vh] overflow-hidden relative">
                    <APIProvider apiKey={apiKey}>
                        <GoogleMap 
                            mapId={mapId}
                            defaultCenter={defaultPosition} 
                            defaultZoom={markers.length > 0 ? 12 : 8}
                            center={mapCenter}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}
                        >
                            {markers.map(marker => (
                                marker.position && (
                                <AdvancedMarker key={marker.id} position={marker.position} onClick={() => setSelectedMarker(marker)}>
                                    <Pin 
                                        background={marker.risk === 'high' ? 'hsl(var(--destructive))' : marker.risk === 'medium' ? 'hsl(var(--accent))' : 'hsl(var(--primary))'} 
                                        borderColor={'hsl(var(--background))'}
                                        glyphColor={'hsl(var(--background))'}
                                    />
                                </AdvancedMarker>
                                )
                            ))}

                            {selectedMarker && selectedMarker.position && (
                                <InfoWindow position={selectedMarker.position} onCloseClick={() => setSelectedMarker(null)}>
                                    <MarkerInfo entry={selectedMarker} />
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </APIProvider>
                    <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                        <h4 className="font-semibold text-sm mb-2">Légende</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <RiskIndicator risk="high" />
                                <span>Risque Élevé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RiskIndicator risk="medium" />
                                <span>Risque Modéré</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <RiskIndicator risk="low" />
                                <span>Risque Faible / Sain</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}


export default function MapPage() {
    return (
        <AuthGuard>
            <MapContent />
        </AuthGuard>
    )
}
