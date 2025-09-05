
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Palette, Languages } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/layout/auth-guard";

function SettingsContent() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="text-primary" />
            Paramètres
          </CardTitle>
          <CardDescription>
            Gérez les préférences de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Bell /> Notifications</h3>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="push-notifications">Activer les notifications push</Label>
                    <p className="text-sm text-muted-foreground">Recevez des alertes importantes sur votre appareil.</p>
                </div>
                <Switch id="push-notifications" disabled />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="email-notifications">Activer les notifications par e-mail</Label>
                    <p className="text-sm text-muted-foreground">Recevez des résumés et des alertes par e-mail.</p>
                </div>
                <Switch id="email-notifications" disabled />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Palette /> Apparence</h3>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="dark-mode">Mode sombre</Label>
                    <p className="text-sm text-muted-foreground">
                      Le mode sombre est activé par défaut.
                    </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={true}
                  disabled
                />
            </div>
          </div>
           <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Languages /> Langue</h3>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label>Langue de l'interface</Label>
                    <p className="text-sm text-muted-foreground">La langue est configurée en Français.</p>
                </div>
                <Button variant="outline" disabled>Changer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
    return (
        <AuthGuard>
            <SettingsContent />
        </AuthGuard>
    )
}
