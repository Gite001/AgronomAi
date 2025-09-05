

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, usePathname } from 'next/navigation'
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader, TriangleAlert, MousePointerClick, Eye, Leaf, Shield, TestTube2, Droplets, Laptop, Bug, AlertCircle, Trash2, ArrowUp, ExternalLink, Database, Wind, Globe, Wheat, FlaskConical, Target, SprayCan, FileSpreadsheet, BrainCircuit, HeartPulse, Award } from "lucide-react";
import { generateGuide, GenerateGuideOutput } from "@/ai/flows/generate-guide";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const guideCategories = [
    {
        title: "Principes Fondamentaux",
        icon: Wheat,
        description: "Les bases scientifiques pour comprendre et maîtriser votre système de culture.",
        items: [
            { href: "/guides/physique-serre", label: "Physique de la Serre", description: "Comprendre les principes (VPD, T°) pour piloter le climat et optimiser la croissance.", topic: "physique-serre", icon: Wind },
            { href: "/guides/principes-fertilisation", label: "Principes de la Fertilisation", description: "Comprendre les lois fondamentales qui régissent la nutrition des plantes.", topic: "principes-fertilisation", icon: TestTube2 },
            { href: "/guides/reconnaissance-carences", label: "Diagnostic des Carences", description: "Apprenez à identifier visuellement les carences nutritionnelles sur vos plantes.", topic: "reconnaissance-carences", icon: Eye },
            { href: "/guides/interpretation-analyses", label: "Interprétation des Analyses", description: "Apprenez à lire les rapports de sol, d'eau et de sève comme un expert.", topic: "interpretation-analyses", icon: FileSpreadsheet },
            { href: "/guides/matiere-organique", label: "Gestion de la Matière Organique", description: "Comprendre et optimiser le rôle de la matière organique et de l'humus.", topic: "matiere-organique", icon: Leaf },
            { href: "/guides/gestion-eau", label: "Gestion de l'Eau", description: "Stratégies et pratiques pour une gestion efficiente de l'eau face à la pénurie.", topic: "gestion-eau", icon: Droplets },
            { href: "/guides/memoire-plante", label: "La Mémoire de la Plante", description: "Gérer le stress à long terme pour construire une culture résiliente et performante.", topic: "memoire-plante", icon: BrainCircuit },
        ]
    },
    {
        title: "Protection des Cultures",
        icon: Shield,
        description: "Identifier, prévenir et lutter contre les maladies et ravageurs.",
        items: [
            { href: "/guides/encyclopedie-ravageurs", label: "Encyclopédie des Ravageurs", description: "Fiches détaillées sur les principaux virus, bactéries, champignons et insectes.", topic: "encyclopedie-ravageurs", icon: Bug },
            { href: "/guides/traitement-phyto", label: "Réussir un Traitement Phyto", description: "Règles et bonnes pratiques pour maximiser l'efficacité de vos traitements.", topic: "traitement-phyto", icon: SprayCan },
            { href: "/guides/lutte-biologique", label: "Lutte Biologique Intégrée", description: "Guide des organismes auxiliaires pour une protection naturelle des cultures.", topic: "lutte-biologique", icon: Shield },
            { href: "/guides/desinfection-sol", label: "Désinfection du Sol", description: "Protocole et points de contrôle pour réussir la désinfection de votre sol.", topic: "desinfection-sol", icon: AlertCircle },
            { href: "/guides/gestion-dechets", label: "Biosécurité des Déchets", description: "Protocoles pour transformer les résidus de culture d'un risque à une ressource.", topic: "gestion-dechets", icon: Trash2 },
            { href: "https://eservice.onssa.gov.ma/IndPesticide.aspx", label: "Index Phyto ONSSA (Officiel)", description: "Consultez la base de données officielle des pesticides homologués au Maroc.", topic: "onssa-link", icon: Database },
        ]
    },
    {
        title: "Stratégie & Outils d'Aide à la Décision",
        icon: Target,
        description: "Informations et technologies pour piloter votre exploitation avec précision.",
        items: [
            { href: "/guides/export-markets", label: "Marchés d'Exportation", description: "Stratégies et calendriers pour les marchés UE, UK et Russie.", topic: "export-markets", icon: Globe },
            { href: "/guides/agriculture-high-tech", label: "Agriculture de Précision", description: "Principes et applications des technologies de pointe en agriculture.", topic: "agriculture-high-tech", icon: Laptop },
            { href: "/guides/certifications-agricoles", label: "Comprendre les Certifications", description: "Démystifier les normes (GlobalG.A.P., BRC, etc.) pour valoriser votre production.", topic: "certifications-agricoles", icon: Award },
        ]
    },
    {
        title: "Coaching & Bien-être",
        icon: HeartPulse,
        description: "Ressources pour cultiver un état d'esprit positif et gérer le stress du métier.",
        items: [
            { href: "/guides/mindset-agronome", label: "Le Mindset de l'Agriculteur Performant", description: "Gérer la pression, cultiver la sérénité et prendre les bonnes décisions.", topic: "mindset-agronome", icon: BrainCircuit },
        ]
    }
]

const allGuideItems = guideCategories.flatMap(category => category.items);

// Simplified component to render HTML content directly
function GuideContent({ htmlContent }: { htmlContent: string }) {
    // We replace <details> and <summary> with simpler tags like <div> and <h3>
    // to remove the accordion behavior while preserving structure.
    const simplifiedHtml = htmlContent
        .replace(/<details>/g, '<div class="guide-section">')
        .replace(/<\/details>/g, '</div>')
        .replace(/<summary>/g, '<h3>')
        .replace(/<\/summary>/g, '</h3>')
        .replace(/<div class="content">/g, '<div class="guide-content-body">')
        .replace(/<\/div>/g,'</div>');


    return (
        <div 
            className="prose prose-sm prose-invert max-w-none text-left" 
            dangerouslySetInnerHTML={{ __html: simplifiedHtml }} 
        />
    );
}

export default function GuidePage() {
  const params = useParams();
  const pathname = usePathname();
  const [content, setContent] = useState<GenerateGuideOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const guideListRef = useRef<HTMLDivElement>(null);

  const slug = (params?.slug as string[]) || [];
  const topic = slug.length > 0 ? slug.join('/') : null;

  const fetchGuideContent = useCallback(async (currentTopic: string) => {
    setLoading(true);
    setError(null);
    setContent(null); 

    try {
      const result = await generateGuide({ topic: currentTopic });
      setContent(result);
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue lors de la récupération du guide.");
    } finally {
      setLoading(false);
    }
  }, []);

  const scrollToGuideList = () => {
    guideListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (topic) {
        const currentGuide = allGuideItems.find(item => item.topic === topic);
        const title = currentGuide?.label || "Guide";
        setPageTitle(title);
        fetchGuideContent(topic);
    } else {
        setPageTitle("Guides & Savoirs");
        setContent(null);
        setError(null);
        setLoading(false);
    }
  }, [topic, fetchGuideContent]);
  
  useEffect(() => {
    if (content && contentRef.current) {
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [content]);
  
  const renderGuideItem = (item: typeof allGuideItems[0]) => {
    const isExternal = item.href.startsWith("http");
    const Component = isExternal ? 'a' : Link;
    const linkProps = isExternal 
        ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
        : { href: item.href };

    return (
        <Component {...linkProps} key={item.href}>
            <div className={cn(
                "p-4 rounded-lg border h-full transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1 flex flex-col items-start gap-3",
                pathname === item.href ? "bg-primary/10 border-primary shadow-md" : "bg-card"
            )}>
                <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                    <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground flex items-center gap-1.5">
                        {item.label}
                        {isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
            </div>
        </Component>
    );
};


  return (
    <div className="max-w-5xl mx-auto space-y-6">
       <div ref={guideListRef}>
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <BookOpen className="text-primary"/> Guides & Savoirs
          </CardTitle>
          <CardDescription>
            Votre bibliothèque de fiches techniques et de guides pratiques, propulsée par l'expertise agricole.
          </CardDescription>
        </CardHeader>
        <div className="space-y-8">
            {guideCategories.map(category => (
                <section key={category.title}>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold font-headline flex items-center gap-2">
                            <category.icon className="h-5 w-5 text-accent"/>
                            {category.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map(item => renderGuideItem(item))}
                    </div>
                </section>
            ))}
        </div>
      </div>

      { topic && 
      <Card className="min-h-[400px]" ref={contentRef}>
            <>
                <CardHeader className="text-left">
                    <CardTitle className="flex items-center gap-2">{pageTitle}</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[300px]">
                {loading && (
                    <div className="space-y-6">
                        <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center h-full">
                            <Loader className="mx-auto h-12 w-12 animate-spin text-primary"/>
                            <p className="mt-4 text-lg font-medium">Chargement du guide...</p>
                        </div>
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        {error}
                        <Button onClick={() => topic && fetchGuideContent(topic)} variant="secondary" className="mt-4">
                            Réessayer
                        </Button>
                    </AlertDescription>
                    </Alert>
                )}
                {content && <GuideContent htmlContent={content.guideContent} />}
                </CardContent>
                 {content && !loading && (
                    <CardFooter className="justify-center">
                        <Button variant="outline" onClick={scrollToGuideList}>
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Retour aux guides
                        </Button>
                    </CardFooter>
                )}
            </>
      </Card>
      }
      { !topic &&
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[400px]">
            <MousePointerClick className="h-16 w-16 text-primary/20 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Bienvenue dans les Guides Techniques</h3>
            <p className="max-w-md mt-2">
                Veuillez sélectionner un sujet ci-dessus pour commencer la lecture.
            </p>
        </div>
      }
    </div>
  );
}
