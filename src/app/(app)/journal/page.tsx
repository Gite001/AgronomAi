
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Search, Calendar as CalendarIcon, Bot } from "lucide-react";
import JournalClient from './journal-client';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthGuard } from '@/components/layout/auth-guard';

function JournalSkeleton() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-full md:w-[300px]" />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-32 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-2 p-4">
                       <Skeleton className="h-16 w-full" />
                       <Skeleton className="h-16 w-full" />
                       <Skeleton className="h-16 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function JournalPage() {
  return (
    <AuthGuard>
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
                    <History /> Journal de Bord
                    </h1>
                    <p className="text-muted-foreground">
                        Historique de toutes vos analyses et diagnostics.
                    </p>
                </div>
            </div>

            <Suspense fallback={<JournalSkeleton />}>
                <JournalClient />
            </Suspense>
        </div>
    </AuthGuard>
  );
}
