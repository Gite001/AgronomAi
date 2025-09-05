
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Dna, Target, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AboutContent() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-headline">À Propos d'AgronomAi</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            L'alliance de l'expertise agricole et de l'intelligence artificielle au service de l'agriculture durable et performante.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Target className="text-primary"/> Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              AgronomAi est né d'une double passion&nbsp;: celle de la terre, cultivée au fil d'une longue expérience de terrain, et celle de la technologie, une fascination pour l'innovation qui ne cesse de grandir. Pourquoi ne pas joindre l'utile à l'agréable en créant l'outil qui manquait&nbsp;? Une application qui rassemble ce savoir-faire et le décuple grâce à l'intelligence artificielle, pour devenir le compagnon de chaque agriculteur.
            </p>
            <p>
              Notre mission est de transformer les données brutes — une photo de feuille, une analyse de sol, un comptage sur un piège — en informations exploitables, en stratégies claires et en décisions éclairées. Nous voulons vous libérer des tâches répétitives pour que vous puissiez vous concentrer sur ce qui compte le plus&nbsp;: l'observation, la stratégie et la croissance de cultures saines et rentables.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="text-primary"/> À qui s'adresse AgronomAi&nbsp;?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
              <p>
                  AgronomAi a été forgé pour le terrain. Il s'adresse à celles et ceux qui ont les mains dans la terre et la tête dans les données&nbsp;:
              </p>
              <ul className="list-disc list-inside space-y-2">
                  <li><strong className="text-foreground">Aux ingénieurs et techniciens agricoles</strong> qui cherchent à optimiser leurs diagnostics et à accélérer leurs recommandations.</li>
                  <li><strong className="text-foreground">Aux chefs de culture et agriculteurs</strong> qui souhaitent un copilote fiable pour leurs décisions quotidiennes, de la fertigation à la protection des cultures.</li>
                  <li><strong className="text-foreground">Aux étudiants en agriculture</strong>, curieux et désireux d'apprendre avec les outils de demain et de se familiariser avec une approche de l'agriculture enrichie par la donnée.</li>
              </ul>
              <p>
                  Que vous soyez un expert confirmé ou un talent en devenir, AgronomAi est conçu pour s'adapter à votre expertise, enrichir votre savoir-faire et devenir un allié stratégique dans votre quête de l'excellence agricole.
              </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-8">
          <Card key="dna-card" className="flex-grow flex-shrink-0 basis-full md:basis-1/3 max-w-md">
            <CardHeader>
              <CardTitle className="flex items-start justify-center gap-2 text-center">
                <Dna className="text-accent"/> L'ADN de l'Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                  <h3 className="font-semibold text-foreground">Basé sur l'Expérience</h3>
                  <p className="text-sm text-muted-foreground">
                      Chaque outil et chaque algorithme sont le fruit d'une expérience de terrain pour garantir leur pertinence et leur précision.
                  </p>
              </div>
              <div>
                  <h3 className="font-semibold text-foreground">Simplicité et Puissance</h3>
                  <p className="text-sm text-muted-foreground">
                      Nous nous efforçons de masquer la complexité de l'IA derrière une interface intuitive, rapide et accessible sur le terrain.
                  </p>
              </div>
               <div>
                  <h3 className="font-semibold text-foreground">Amélioration Continue</h3>
                  <p className="text-sm text-muted-foreground">
                      Cet outil est en constante évolution. Nous intégrons les dernières avancées en matière d'IA et les retours de nos utilisateurs pour nous améliorer chaque jour.
                  </p>
              </div>
            </CardContent>
          </Card>
          <Card key="tech-card" className="flex-grow flex-shrink-0 basis-full md:basis-1/3 max-w-md">
            <CardHeader>
              <CardTitle className="flex items-start justify-center gap-2 text-center">
                <Bot className="text-primary"/> Notre Technologie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                  <h3 className="font-semibold text-foreground">Modèles d'IA Spécialisés</h3>
                  <p className="text-sm text-muted-foreground">
                      Nous utilisons les modèles de langage et de vision par ordinateur les plus récents, affinés avec des connaissances agricoles spécialisées.
                  </p>
              </div>
              <div>
                  <h3 className="font-semibold text-foreground">Interface Réactive</h3>
                  <p className="text-sm text-muted-foreground">
                     Propulsée par une architecture web de pointe, AgronomAi s'appuie sur la puissance de Next.js et React pour une réactivité instantanée. L'interface, façonnée avec Tailwind CSS, est conçue pour être parfaitement adaptative et offrir une expérience utilisateur sans compromis sur tous vos appareils.
                  </p>
              </div>
               <div>
                  <h3 className="font-semibold text-foreground">Confidentialité des Données</h3>
                  <p className="text-sm text-muted-foreground">
                      Vos données sont traitées localement dans votre navigateur lorsque c'est possible. Elles ne servent qu'à vous fournir des réponses et ne sont pas utilisées pour entraîner les modèles.
                  </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent bg-accent/5">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <BookOpen className="text-accent"/> Le Pouvoir de la Connaissance
                </CardTitle>
                <CardDescription>
                    Au-delà des outils, AgronomAi est une encyclopédie vivante.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                    Nous croyons que les meilleurs outils ne sont rien sans le savoir qui les accompagne. C'est pourquoi nous avons intégré les sections <strong className="font-bold text-foreground">"Guides & Savoirs"</strong> et <strong className="font-bold text-foreground">"Études de Cas"</strong>. Ce ne sont pas de simples pages d'aide. C'est le concentré de décennies d'expérience de terrain, distillé pour vous en protocoles clairs et en explications scientifiques accessibles. Avant de chercher ailleurs, plongez dans cette bibliothèque. La solution à votre problème s'y trouve peut-être déjà.
                </p>
            </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center space-y-6">
                 <div className="text-center">
                    <h3 className="text-2xl font-bold font-headline flex items-center justify-center gap-2">
                        <Users className="text-primary"/>
                        Dédicaces & Remerciements
                    </h3>
                    <div className="max-w-3xl mx-auto mt-4 text-muted-foreground space-y-3">
                        <p>
                        Cette application est le fruit d'un long chemin, enrichi par des rencontres et des savoirs partagés. Je tiens à exprimer ma profonde gratitude à toutes celles et ceux qui ont jalonné mon parcours.
                        </p>
                        <p>
                        À mes professeurs, qui m'ont transmis les fondations de la connaissance. À mes camarades de la promotion 1990-1993 de l'école technique agricole de Souihla, pour les souvenirs et l'entraide.
                        </p>
                        <p>
                        Aux entreprises, agriculteurs, chefs de culture, encadrants et patrons avec qui j'ai eu l'honneur de collaborer&nbsp;: chaque défi relevé à vos côtés a été une leçon, chaque expérience une pierre ajoutée à cet édifice. Votre confiance et votre exigence m'ont forgé.
                        </p>
                        <p>
                        Ce projet vous est dédié.
                        </p>
                    </div>
                </div>

                <div className="pt-4 space-y-4 text-center">
                    <div className="font-signature text-3xl text-foreground/80">
                        Abderrahim Bayoussef
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p>Lauréat de l'école technique agricole de Souihla, promotion 1990/1993.</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function AboutPage() {
    return (
        <AboutContent />
    )
}
