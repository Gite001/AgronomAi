
"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useJournal, JournalEntry } from "@/context/journal-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, MapPin, Search, Bot, Leaf, Bug, FlaskConical, Tractor, Calculator, CalendarDays, Wand2, Network, X, Calendar as CalendarIcon, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, startOfDay, endOfDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import ReactMarkdown from 'react-markdown';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";


function LocationDisplay({ location }: { location?: { name?: string; latitude?: number; longitude?: number } }) {
    if (!location || (!location.name && !location.latitude)) return null;
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span>{location.name || `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`}</span>
        </div>
    )
}

function getToolIcon(toolName: string) {
    switch (toolName) {
        case "Diagnostic par Image": return <Leaf className="w-4 h-4" />;
        case "Scouting IA": return <Bug className="w-4 h-4" />;
        case "Interprète d'Analyse": return <FlaskConical className="w-4 h-4" />;
        case "Pilote Hors-Sol": return <Tractor className="w-4 h-4" />;
        case "Calculateur Coïc-Lesaint":
        case "Calculateur Fertilisation Sol":
        case "Calculateur Bilan Cible":
             return <Calculator className="w-4 h-4" />;
        case "Assistant IA": return <Wand2 className="w-4 h-4" />;
        case "Designer d'Irrigation": return <Network className="w-4 h-4" />;
        default: return <Bot className="w-4 h-4" />;
    }
}


function DataPair({ label, value }: { label: string, value: any }) {
    if (!value && typeof value !== 'number') return null;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{String(value)}</p>
        </div>
    )
}

function EntryCard({ entry }: { entry: JournalEntry }) {
    switch (entry.tool) {
        case 'Diagnostic par Image':
            return (
                <div className="grid md:grid-cols-2 gap-4">
                    {entry.input.photoDataUri && <Image src={entry.input.photoDataUri} alt="Analyse" width={300} height={200} className="rounded-md object-cover w-full" />}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="p-3"><CardTitle className="text-sm">Diagnostic</CardTitle></CardHeader>
                            <CardContent className="p-3 pt-0"><p>{entry.output.diagnosis}</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-3"><CardTitle className="text-sm">Action Suggérée</CardTitle></CardHeader>
                            <CardContent className="p-3 pt-0"><p>{entry.output.suggestedAction}</p></CardContent>
                        </Card>
                    </div>
                </div>
            );
        case 'Scouting IA':
            return (
                <div className="grid md:grid-cols-2 gap-4">
                    {entry.input.photoDataUri && <Image src={entry.input.photoDataUri} alt="Scouting" width={300} height={200} className="rounded-md object-cover w-full" />}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <DataPair label="Ravageurs" value={entry.output.pestCounts?.map(p => `${p.pestType}: ${p.count}`).join(', ')} />
                            <div>
                                <p className="text-xs text-muted-foreground">Comptage / Seuil</p>
                                <p className="text-sm font-bold">
                                    <span className={(entry.output.totalPestCount ?? 0) >= (entry.input.riskThreshold ?? Infinity) ? "text-destructive" : "text-primary"}>{entry.output.totalPestCount ?? 0}</span>
                                    <span> / {entry.input.riskThreshold}</span>
                                </p>
                            </div>
                        </div>
                        <Card>
                            <CardHeader className="p-3"><CardTitle className="text-sm">Recommandation</CardTitle></CardHeader>
                            <CardContent className="p-3 pt-0"><p>{entry.output.recommendation}</p></CardContent>
                        </Card>
                    </div>
                </div>
            );
        case "Interprète d'Analyse":
            const isImage = entry.input.reportData?.startsWith('data:');
            return (
                <div className="space-y-4">
                    {isImage ? (
                        <Image src={entry.input.reportData} alt="Rapport" width={300} height={200} className="rounded-md object-cover"/>
                    ) : (
                        <div>
                            <p className="text-xs text-muted-foreground">Rapport (Texte)</p>
                            <pre className="text-xs bg-background p-2 rounded-md overflow-x-auto max-h-40">{entry.input.reportData}</pre>
                        </div>
                    )}
                    <Card>
                        <CardHeader className="p-3"><CardTitle className="text-sm">Plan d'Action</CardTitle></CardHeader>
                        <CardContent className="p-3 pt-0 prose prose-sm prose-invert max-w-none"><ReactMarkdown>{entry.output.actionablePlan}</ReactMarkdown></CardContent>
                    </Card>
                </div>
            );
         case "Assistant IA":
            return (
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Question</p>
                        <p className="italic">"{entry.input.question}"</p>
                    </div>
                    <Card>
                        <CardHeader className="p-3"><CardTitle className="text-sm">Réponse de l'Assistant</CardTitle></CardHeader>
                        <CardContent className="p-3 pt-0 prose prose-sm prose-invert max-w-none"><ReactMarkdown>{entry.output.answer}</ReactMarkdown></CardContent>
                    </Card>
                </div>
            );
        default:
            return (
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Entrants :</h4>
                        <pre className="text-xs bg-background p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(entry.input, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Résultats :</h4>
                         <div className="prose prose-sm prose-invert max-w-none">
                            {entry.output.analysisReport ? (
                                <div dangerouslySetInnerHTML={{ __html: entry.output.analysisReport }} />
                            ) : (
                                <pre className="text-xs bg-background p-3 rounded-md overflow-x-auto">
                                    {JSON.stringify(entry.output, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            );
    }
}


export default function JournalClient() {
  const { entries, clearJournal, removeEntry, loading } = useJournal();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTool, setActiveTool] = useState("Tous");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    const q = searchParams.get('q') || "";
    const tool = searchParams.get('tool') || "Tous";
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    
    setSearchQuery(q);
    setActiveTool(tool);
    if (from) {
        setDateRange({ from: parseISO(from), to: to ? parseISO(to) : undefined });
    } else {
        setDateRange(undefined);
    }
  }, [searchParams]);

  const toolTypes = useMemo(() => {
    const tools = new Set(entries.map(entry => entry.tool));
    return ['Tous', ...Array.from(tools)];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let filtered = entries;
    const currentTool = searchParams.get('tool') || 'Tous';
    const currentQuery = searchParams.get('q') || '';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (currentTool !== 'Tous') {
        filtered = filtered.filter(entry => entry.tool === currentTool);
    }

    if (currentQuery) {
        const lowercasedQuery = currentQuery.toLowerCase();
        filtered = filtered.filter(entry => JSON.stringify(entry).toLowerCase().includes(lowercasedQuery));
    }

    if (from) {
        const fromDate = startOfDay(parseISO(from));
        filtered = filtered.filter(entry => new Date(entry.timestamp) >= fromDate);
    }
    if (to) {
        const toDate = endOfDay(parseISO(to));
        filtered = filtered.filter(entry => new Date(entry.timestamp) <= toDate);
    }

    return filtered;
  }, [entries, searchParams]);
  
  const updateURLParams = (updates: { key: string, value: string | null }[]) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    updates.forEach(({ key, value }) => {
        if (value === null || value === '') {
            current.delete(key);
        } else {
            current.set(key, value);
        }
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`, { scroll: false });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateURLParams([{ key: 'q', value: e.target.value }]);
  };
  
  const handleToolChange = (tool: string) => {
    setActiveTool(tool);
    updateURLParams([{ key: 'tool', value: tool === 'Tous' ? null : tool }]);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    updateURLParams([
        { key: 'from', value: range?.from ? range.from.toISOString() : null },
        { key: 'to', value: range?.to ? range.to.toISOString() : null }
    ]);
  }

  const renderEmptyState = () => {
    const hasFilters = searchParams.get('q') || searchParams.get('tool') || searchParams.get('from');
    if (hasFilters) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50"/>
          <p className="mt-4 font-semibold">Aucun résultat</p>
          <p className="text-sm">Aucune entrée ne correspond à vos critères de recherche.</p>
          <p className="text-sm">Essayez de modifier vos filtres.</p>
        </div>
      );
    }
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bot className="mx-auto h-12 w-12 text-muted-foreground/50"/>
        <p className="mt-4 font-semibold">Votre journal est vide</p>
        <p className="text-sm">Les diagnostics et analyses que vous effectuerez apparaîtront ici.</p>
        <p className="text-sm">Utilisez les outils pour commencer.</p>
      </div>
    );
  };


  return (
      <Card>
        <CardHeader>
            <div className="flex justify-end mb-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={entries.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Vider le journal
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Toutes les entrées de votre journal de bord seront définitivement supprimées.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={clearJournal}>Continuer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par mot-clé..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-8"
                    />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full md:w-[300px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "d LLL y", { locale: fr })} - {format(dateRange.to, "d LLL y", { locale: fr })}
                                    </>
                                ) : (
                                    format(dateRange.from, "d LLL y", { locale: fr })
                                )
                            ) : (
                                <span>Choisir une plage de dates</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={handleDateChange}
                            numberOfMonths={2}
                            locale={fr}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
                {toolTypes.map(tool => (
                    <Button
                        key={tool}
                        variant={activeTool === tool ? "default" : "secondary"}
                        onClick={() => handleToolChange(tool)}
                        size="sm"
                        className="rounded-full"
                    >
                        {tool}
                        <Badge variant="outline" className="ml-2 bg-background/50">{tool === 'Tous' ? entries.length : entries.filter(e => e.tool === tool).length}</Badge>
                    </Button>
                ))}
            </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
                <Loader className="mx-auto h-12 w-12 animate-spin text-primary"/>
                <p className="mt-4 font-semibold">Chargement des données...</p>
            </div>
          ) : filteredEntries.length === 0 ? renderEmptyState() : (
            <Accordion type="single" collapsible className="w-full">
                {filteredEntries.map((entry) => (
                    <AccordionItem value={entry.id} key={entry.id}>
                        <div className="flex items-center px-4">
                            <AccordionTrigger className="flex-1 text-left py-4">
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="gap-1.5 pl-1.5">
                                            {getToolIcon(entry.tool)}
                                            {entry.tool}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                    <LocationDisplay location={entry.input.location} />
                                </div>
                            </AccordionTrigger>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0">
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer cette entrée ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible et supprimera cette entrée du journal.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeEntry(entry.id)}>Supprimer</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <AccordionContent className="p-4 pt-0 bg-card/50 rounded-b-md">
                           <EntryCard entry={entry} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
  );
}
