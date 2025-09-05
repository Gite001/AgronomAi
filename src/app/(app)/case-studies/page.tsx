"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bot, FolderKanban, Loader, Sparkles, TriangleAlert, ArrowUp } from "lucide-react";
import { generateCaseStudy, GenerateCaseStudyOutput } from "@/ai/flows/generate-case-study";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CropValue = "tomate" | "poivron" | "framboise" | "courgette" | "haricot vert" | "melon";

const caseStudyItems = [
    { name: "Tomate", value: "tomate" as CropValue, image: "/images/tomate.png" },
    { name: "Poivron / Piment", value: "poivron" as CropValue, image: "/images/poivron1.png" },
    { name: "Framboise / Myrtille", value: "framboise" as CropValue, image: "/images/framboise1.png" },
    { name: "Courgette", value: "courgette" as CropValue, image: "/images/courgette.png" },
    { name: "Haricot Vert", value: "haricot vert" as CropValue, image: "/images/haricot.png" },
    { name: "Melon", value: "melon" as CropValue, image: "/images/melon.png" },
];

export default function CaseStudiesPage() {
    const [selectedCrop, setSelectedCrop] = useState<CropValue | null>(null);
    const [content, setContent] = useState<GenerateCaseStudyOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleSelectCrop = useCallback(async (cropValue: CropValue) => {
        setSelectedCrop(cropValue);
        setError(null);
        setContent(null); // Reset content on new selection

        try {
            // This is now an instantaneous, local function call.
            const result = await generateCaseStudy({ crop: cropValue });
            setContent(result);
        } catch (e: any) {
            setError(e.message || "Une erreur est survenue lors de la récupération de l'étude de cas.");
        }
    }, []);

    useEffect(() => {
        if (content && contentRef.current) {
            // Use a short timeout to ensure the DOM is updated before scrolling
            setTimeout(() => {
                contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [content]);

    useEffect(() => {
        const checkScroll = () => {
            if (contentRef.current && window.scrollY > contentRef.current.offsetTop - 100) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, [content]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <FolderKanban className="text-primary"/> Études de Cas
          </CardTitle>
          <CardDescription>
            Protocoles techniques approfondis pour des cultures spécifiques dans le contexte Souss-Massa (climats semi-arides, cultures sous abris).
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {caseStudyItems.map(item => (
                    <div
                        key={item.value}
                        onClick={() => handleSelectCrop(item.value)}
                        className={cn(
                            "rounded-lg border overflow-hidden cursor-pointer group relative transition-all hover:shadow-xl hover:shadow-primary/10",
                            selectedCrop === item.value && "ring-2 ring-primary shadow-lg"
                        )}
                    >
                       <Image src={item.image} width={600} height={400} alt={item.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                       <div className="absolute inset-0 bg-black/50"></div>
                       <div className="absolute inset-0 flex items-center justify-center p-4">
                            <h3 className="font-bold text-xl text-white text-center drop-shadow-lg">{item.name}</h3>
                       </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      { (error || content) && (
        <Card className="min-h-[400px]" ref={contentRef}>
            <CardContent className="p-4 md:p-6">
            {error && (
                 <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                        {error}
                        <Button onClick={() => selectedCrop && handleSelectCrop(selectedCrop)} variant="secondary" className="mt-4">
                            Réessayer
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            {content && (
                 <div className="prose prose-sm prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: content.caseStudyContent }} />
                </div>
            )}
            </CardContent>
        </Card>
      )}

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
          size="icon"
          aria-label="Retour en haut"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
