import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Microscope, Bug, FlaskConical, Calculator, Network, ListTodo, History, Map } from "lucide-react";

export default function UserGuidePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
                    <HelpCircle className="w-10 h-10 text-primary" />
                    Guide d'Utilisation
                </h1>
                <p className="text-lg text-muted-foreground">
                    Bienvenue sur AgronomAi. Ce guide est conçu pour vous aider à maîtriser l'application et à en tirer le meilleur parti pour vos cultures.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl leading-normal">Philosophie de l'Application : Le Triptyque Analyser → Journaliser → Planifier</CardTitle>
                    <CardDescription>
                        AgronomAi est bâti sur un cycle de travail simple et puissant pour transformer l'information en action.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        Notre approche repose sur trois piliers interconnectés qui constituent le cœur de votre expérience :
                    </p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li><strong>Analyser :</strong> Vous utilisez un des outils de diagnostic ou de calcul pour obtenir une information précise (un diagnostic de maladie, un comptage de ravageurs, une recette de fertilisation...).</li>
                        <li><strong>Journaliser :</strong> Chaque analyse est automatiquement sauvegardée dans votre <span className="font-semibold text-foreground">Journal de Bord</span>. C'est la mémoire de votre exploitation, un historique complet, daté et géolocalisé de toutes vos observations.</li>
                        <li><strong>Planifier :</strong> À partir d'une analyse, vous pouvez ajouter les recommandations de l'IA à votre <span className="font-semibold text-foreground">Plan d'Action</span>. C'est votre liste de tâches intelligente pour organiser, prioriser et suivre les interventions sur le terrain.</li>
                    </ol>
                    <p>
                        Ce cycle vertueux vous permet de construire une base de connaissances unique à votre exploitation, de suivre l'évolution des problèmes et de justifier chaque décision par une donnée concrète.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Les Concepts Clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                        <History className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Le Journal de Bord</h3>
                            <p className="text-muted-foreground">C'est le cœur de votre mémoire de terrain. Chaque fois que vous utilisez un outil, une entrée est créée. Vous pouvez y retourner à tout moment pour voir le contexte d'une ancienne analyse. Utilisez les filtres pour retrouver rapidement une information par date, par outil ou par mot-clé.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <ListTodo className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Le Plan d'Action</h3>
                            <p className="text-muted-foreground">C'est votre gestionnaire de tâches. Lorsqu'un outil vous suggère une action (ex: "Appliquer un traitement fongicide"), un bouton "Ajouter au Plan" vous permet de transformer ce conseil en une tâche concrète. Vous pouvez ensuite suivre son statut (À faire, En cours, Terminé) et garder une trace claire des interventions à mener.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Map className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">La Cartographie des Risques</h3>
                            <p className="text-muted-foreground">Si vous activez la localisation lors de vos diagnostics, chaque entrée est placée sur une carte. La couleur des marqueurs vous indique le niveau de risque (faible, modéré, élevé), vous permettant de visualiser en un coup d'œil les "points chauds" de votre exploitation et de suivre la dynamique spatiale des problèmes.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Mode d'Emploi des Outils</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Microscope className="w-8 h-8 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Diagnostic par Image</h3>
                            <p className="text-muted-foreground">Prenez ou importez une photo claire d'une feuille ou d'un symptôme. L'IA l'analysera pour vous fournir un diagnostic probable et une action suggérée. Pour de meilleurs résultats, assurez-vous que l'image est nette et bien éclairée.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Bug className="w-8 h-8 text-yellow-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Scouting IA</h3>
                            <p className="text-muted-foreground">Prenez ou importez une photo d'un piège collant. Définissez d'abord votre "seuil de risque" (le nombre total de ravageurs qui déclenche une action). L'IA identifiera et comptera les insectes, puis comparera le total à votre seuil pour vous faire une recommandation.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <FlaskConical className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Interprète d'Analyse</h3>
                            <p className="text-muted-foreground">Importez une photo de votre rapport de laboratoire (analyse de sol, eau, sève) ou copiez-collez les données textuelles. L'IA lira le rapport, identifiera les points critiques et les déséquilibres, et vous fournira un plan d'action pour corriger la situation.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Calculator className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Calculateurs de Recette</h3>
                            <p className="text-muted-foreground">Choisissez le type de calcul adapté (sol, hors-sol). Remplissez les données demandées (vos objectifs, vos analyses, vos engrais disponibles). L'IA générera une recette de fertilisation précise avec des instructions claires.</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Network className="w-8 h-8 text-cyan-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Designer d'Irrigation</h3>
                            <p className="text-muted-foreground">Renseignez tous les paramètres de votre parcelle (surface, culture, type de goutteur, dénivelé...). L'IA effectuera tous les calculs hydrauliques pour vous proposer un dimensionnement complet de votre réseau, de la pompe à la rampe, en passant par la conduite principale et la filtration.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <div className="text-center text-muted-foreground text-sm pt-4">
                <p>Ce guide évoluera avec l'application. N'hésitez pas à le consulter régulièrement.</p>
                <p>Bonne culture !</p>
            </div>
        </div>
    );
}
