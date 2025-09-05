
"use client";

import { useActionPlan } from "@/context/action-plan-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Trash2, Calendar, Circle, CheckCircle, CircleDashed, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AuthGuard } from "@/components/layout/auth-guard";

function StatusIcon({ status }: { status: 'todo' | 'inprogress' | 'done' }) {
    switch(status) {
        case 'todo': return <CircleDashed className="h-5 w-5 text-muted-foreground" />;
        case 'inprogress': return <Circle className="h-5 w-5 text-accent animate-pulse" />;
        case 'done': return <CheckCircle className="h-5 w-5 text-primary" />;
    }
}

function ActionPlanContent() {
    const { tasks, updateTaskStatus, removeTask, clearPlan, loading } = useActionPlan();

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    <Loader className="mx-auto h-12 w-12 animate-spin text-primary"/>
                    <p className="mt-4 font-semibold">Chargement du plan d'action...</p>
                </div>
            )
        }

        if (tasks.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    <ListTodo className="mx-auto h-12 w-12 text-muted-foreground/50"/>
                    <p className="mt-4 font-semibold">Votre plan d'action est vide</p>
                    <p className="text-sm">Ajoutez des tâches à partir des outils d'analyse pour commencer.</p>
                </div>
            )
        }

        return (
            <ul className="space-y-4">
                {tasks.map(task => (
                    <li key={task.id} className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-lg border bg-card/50">
                        <div className="pt-1">
                          <StatusIcon status={task.status} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className="font-medium text-card-foreground">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    <span>Créé le {format(new Date(task.timestamp), "d MMM yyyy", { locale: fr })}</span>
                                </div>
                                <span>|</span>
                                <span>Source: {task.sourceTool}</span>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <Select value={task.status} onValueChange={(status) => updateTaskStatus(task.id, status as any)}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">À faire</SelectItem>
                                    <SelectItem value="inprogress">En cours</SelectItem>
                                    <SelectItem value="done">Terminé</SelectItem>
                                </SelectContent>
                            </Select>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeTask(task.id)}>Supprimer</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                        <ListTodo /> Plan d'Action
                    </h1>
                    <p className="text-muted-foreground">
                        Organisez et suivez les actions recommandées par l'IA.
                    </p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={tasks.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Vider le plan
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Vider le plan d'action ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Toutes les tâches seront définitivement supprimées.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={clearPlan}>Continuer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <Card>
                <CardContent className="p-4 md:p-6">
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ActionPlanPage() {
    return (
        <AuthGuard>
            <ActionPlanContent />
        </AuthGuard>
    )
}
