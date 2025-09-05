
"use client"

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bug,
  ClipboardList,
  HelpCircle,
  Leaf,
  ListTodo,
  Map,
  Thermometer,
  Trash2,
  Wand2,
  Bot,
  Loader,
  Sparkles,
  TriangleAlert,
  HeartPulse,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
  } from "recharts"
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
  } from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useJournal } from "@/context/journal-context";
import { useMemo, useState, FormEvent, useEffect } from "react";
import { format, subMonths, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { askAgronomist, AskAgronomistOutput } from "@/ai/flows/ask-agronomist";
import ReactMarkdown from 'react-markdown';
import { AuthGuard } from "@/components/layout/auth-guard";


const chartConfig = {
    pests: {
      label: "Ravageurs",
      color: "hsl(var(--destructive))",
    },
  }

function getFriendlyErrorMessage(error: any): string {
    const message = error.message || "Une erreur est survenue.";
    if (message.includes('503') || message.toLowerCase().includes('overloaded')) {
        return "Le service est actuellement surchargé. Veuillez réessayer dans quelques instants.";
    }
     if (message.includes('429') || message.toLowerCase().includes('quota')) {
        return "Le service est actuellement très demandé. Veuillez réessayer dans quelques instants. Si le problème persiste, le quota de l'API a peut-être été atteint.";
    }
    if (message.toLowerCase().includes('safety')) {
        return "La question n'a pas pu être traitée car elle a été bloquée par les filtres de sécurité.";
    }
    return `Une erreur inattendue est survenue: ${message}`;
}


function DashboardContent() {
    const { entries, removeEntry, addEntry } = useJournal();
    const [assistantResult, setAssistantResult] = useState<AskAgronomistOutput | null>(null);
    const [assistantError, setAssistantError] = useState<string | null>(null);
    const [assistantLoading, setAssistantLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
    const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);


    const handleAssistantSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const finalQuestion = question.trim();
        if (!finalQuestion) {
            setAssistantError("Veuillez poser une question.");
            return;
        }

        setAssistantLoading(true);
        setAssistantError(null);
        setAssistantResult(null);

        try {
            const input = { question: finalQuestion };
            const res = await askAgronomist(input);
            setAssistantResult(res);
            addEntry({
                tool: "Assistant IA",
                input,
                output: res,
            });
            setIsQuestionDialogOpen(false); 
            setIsAnswerDialogOpen(true);
        } catch (e: any) {
            setAssistantError(getFriendlyErrorMessage(e));
            setIsAnswerDialogOpen(false);
        } finally {
            setAssistantLoading(false);
        }
    };

    const recentDiagnostics = useMemo(() => {
        return entries
        .filter(e => e.tool === 'Diagnostic par Image' && e.output?.diagnosis)
        .slice(0, 5);
    }, [entries]);

    const pestPressure = useMemo(() => {
        const sevenDaysAgo = subDays(new Date(), 7);
        const pestEntries = entries.filter(e => 
            e.tool === 'Scouting IA' && 
            e.output?.totalPestCount !== undefined && 
            e.input?.riskThreshold !== undefined &&
            new Date(e.timestamp) >= sevenDaysAgo
        );

        if (pestEntries.length === 0) return { level: "Inconnu", color: "secondary" };
        
        const hasHighRisk = pestEntries.some(e => e.output.totalPestCount >= e.input.riskThreshold);
        if (hasHighRisk) return { level: "Élevée", color: "destructive" };

        const hasModerateRisk = pestEntries.some(e => e.output.totalPestCount > (e.input.riskThreshold * 0.5));
        if (hasModerateRisk) return { level: "Modérée", color: "accent" };

        return { level: "Faible", color: "primary" };

    }, [entries]);

    const abioticStress = useMemo(() => {
        const sevenDaysAgo = subDays(new Date(), 7);
        const soillessEntries = entries.filter(e => 
            e.tool === 'Pilote Hors-Sol' && 
            e.output?.recommendations &&
            new Date(e.timestamp) >= sevenDaysAgo
        );

        if (soillessEntries.length === 0) return { level: "Inconnu", color: "secondary" };
        
        const hasHighRisk = soillessEntries.some(e => {
            const recommendations = e.output.recommendations.toLowerCase();
            return recommendations.includes("corriger") || recommendations.includes("important") || recommendations.includes("fortement");
        });
        if (hasHighRisk) return { level: "Élevé", color: "destructive" };

        const hasModerateRisk = soillessEntries.some(e => {
            const recommendations = e.output.recommendations.toLowerCase();
            return recommendations.includes("ajuster") || recommendations.includes("augmenter") || recommendations.includes("réduire");
        });
        if (hasModerateRisk) return { level: "Modéré", color: "accent" };
        
        return { level: "Faible", color: "primary" };
    }, [entries]);


    const chartData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
        
        const data = last6Months.map(month => {
          const monthKey = format(month, 'MMM', { locale: fr });
          const monthlyPests = entries
            .filter(e => e.tool === 'Scouting IA' && e.output?.totalPestCount !== undefined && format(new Date(e.timestamp), 'yyyy-MM') === format(month, 'yyyy-MM'))
            .reduce((sum, entry) => sum + (entry.output.totalPestCount || 0), 0);
          
          return { month: monthKey.charAt(0).toUpperCase() + monthKey.slice(1), pests: monthlyPests };
        });
    
        return data;
      }, [entries]);


  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      
       <section>
        <Dialog open={isQuestionDialogOpen} onOpenChange={(open) => {
            setIsQuestionDialogOpen(open);
            if (!open) {
                setQuestion("");
                setAssistantError(null);
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full h-auto py-6 flex-col gap-2 shadow-sm hover:shadow-lg transition-shadow">
                    <Wand2 className="w-8 h-8 text-primary"/>
                    <span className="text-lg font-semibold">Demander à l'Assistant IA</span>
                    <span className="text-sm font-normal text-muted-foreground">Posez n'importe quelle question technique</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                 <form onSubmit={handleAssistantSubmit}>
                    <DialogHeader>
                        <DialogTitle>Assistant IA</DialogTitle>
                        <DialogDescription>
                            Posez votre question. L'IA vous fournira une réponse d'expert.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Textarea
                            placeholder="Ex: Quelle est la meilleure méthode de lutte biologique contre Tuta absoluta sur tomate ?"
                            rows={5}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        {assistantError && (
                            <Alert variant="destructive">
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Erreur</AlertTitle>
                                <AlertDescription>{assistantError}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={assistantLoading || !question} className="w-full">
                            {assistantLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Veuillez patienter...</> : <><Sparkles className="mr-2 h-4 w-4" /> Demander à l'IA</>}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

         <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
            <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Bot className="text-primary"/> Réponse de l'Assistant IA</DialogTitle>
                     <DialogDescription>
                        Question : <span className="italic">"{question.trim()}"</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                    {assistantResult && (
                         <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown>{assistantResult.answer}</ReactMarkdown>
                        </div>
                    )}
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Fermer
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="text-primary" />
              État Sanitaire Général
            </CardTitle>
            <CardDescription>
              Vue d'ensemble de la santé de vos cultures basée sur vos dernières analyses.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Bug className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pression Ravageurs</p>
                  <p className="text-2xl font-bold">{pestPressure.level}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
                <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                    <Thermometer className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Stress Abiotique</p>
                    <p className="text-2xl font-bold">{abioticStress.level}</p>
                </div>
                </div>
            </Card>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/tools/diagnostic-image">
                <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                    <Leaf className="w-6 h-6"/>
                    <span>Nouveau Diagnostic</span>
                </Button>
            </Link>
            <Link href="/tools/scouting">
                <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                    <Bug className="w-6 h-6"/>
                    <span>Suivi Ravageurs</span>
                </Button>
            </Link>
            <Link href="/journal">
                <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                    <ClipboardList className="w-6 h-6"/>
                    <span>Voir Journal</span>
                </Button>
            </Link>
            <Link href="/map">
                <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                    <Map className="w-6 h-6"/>
                    <span>Carte</span>
                </Button>
            </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Derniers Diagnostics</CardTitle>
            <CardDescription>
              Historique récent de vos analyses d'images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDiagnostics.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead>Lieu</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentDiagnostics.map(entry => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                {entry.input.photoDataUri && (
                                    <Image 
                                        src={entry.input.photoDataUri} 
                                        alt="Diagnostic" 
                                        width={40} 
                                        height={40} 
                                        className="rounded-md object-cover"
                                    />
                                )}
                            </TableCell>
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    entry.output.diagnosis && (entry.output.diagnosis.toLowerCase().includes('sain') || entry.output.diagnosis.toLowerCase().includes('aucun problème')) ? 'bg-green-500' : 'bg-destructive'
                                                )} />
                                                <span className="truncate max-w-[150px]">{entry.output.diagnosis}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">{entry.output.diagnosis}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{entry.input.location?.name || '-'}</TableCell>
                            <TableCell className="text-xs">{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: fr })}</TableCell>
                             <TableCell className="text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Supprimer le diagnostic ?</AlertDialogTitle>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Aucun diagnostic d'image trouvé.</p>
                    <p className="text-sm">Utilisez l'outil de diagnostic pour commencer.</p>
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suivi des Ravageurs</CardTitle>
            <CardDescription>Évolution des populations de ravageurs ce semestre.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.some(d => d.pests > 0) ? (
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis hide/>
                        <ChartTooltip 
                            cursor={false}
                            content={<ChartTooltipContent hideLabel indicator="dot" />} 
                        />
                        <Bar dataKey="pests" fill="var(--color-pests)" radius={4} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="text-center text-muted-foreground py-8 h-[200px] flex flex-col justify-center items-center">
                    <p>Aucune donnée de comptage de ravageurs.</p>
                    <p className="text-sm">Utilisez l'outil de Scouting IA pour commencer.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="text-primary"/>
                    Aide &amp; Prise en main
                </CardTitle>
                <CardDescription>
                    Bienvenue sur AgronomAi. Voici comment tirer le meilleur parti des fonctionnalités clés.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><ClipboardList/>Journal de Bord</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Chaque analyse que vous effectuez est automatiquement sauvegardée ici. C'est votre mémoire de terrain, vous permettant de suivre l'historique et de filtrer par outil, date ou mot-clé.
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><ListTodo/>Plan d'Action</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Après un diagnostic, ajoutez les actions suggérées à votre plan. C'est votre liste de tâches intelligente pour organiser, prioriser et suivre les interventions sur le terrain.
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2"><Map/>Cartographie</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Activez la localisation lors de vos diagnostics pour visualiser les points chauds sur une carte. Identifiez rapidement les zones à risque et suivez la propagation des problèmes.
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
      </section>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
