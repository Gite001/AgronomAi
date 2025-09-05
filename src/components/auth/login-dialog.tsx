
"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, TriangleAlert, Info } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, sendPasswordReset } from '@/lib/firebase/auth';
import { firebaseInitialized } from '@/lib/firebase/config';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.853,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
    );
}

function getFriendlyErrorMessage(error: any): { title: string; description: string | JSX.Element } {
    if (!firebaseInitialized) {
        return {
            title: "Erreur de Configuration",
            description: (
                <span>
                    La configuration Firebase est manquante ou invalide. Si vous êtes le développeur, veuillez consulter le fichier 
                    <code className="font-mono bg-muted p-1 rounded-sm mx-1">README.md</code> 
                    pour obtenir les instructions de configuration.
                </span>
            )
        };
    }

    const code = error.code || error.message || "unknown";

    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
        return { title: "Erreur d'authentification", description: "L'adresse e-mail ou le mot de passe est incorrect." };
    }
     if (code.includes('auth/configuration-not-found') || code.includes('auth/invalid-api-key')) {
        return {
            title: "Erreur de Configuration",
            description: "La configuration Firebase est invalide. Veuillez contacter le support."
        };
    }
    if(code.includes('auth/email-already-in-use')) {
        return { title: "E-mail déjà utilisé", description: "Cette adresse e-mail est déjà utilisée par un autre compte."};
    }
    if(code.includes('auth/invalid-email')) {
        return { title: "E-mail invalide", description: "Veuillez fournir une adresse e-mail valide."};
    }
    if(code.includes('auth/weak-password')) {
        return { title: "Mot de passe faible", description: "Le mot de passe doit contenir au moins 6 caractères."};
    }
    if (code.includes('auth/popup-closed-by-user') || code.includes('auth/cancelled-popup-request')) {
        return { title: "Connexion annulée", description: "Vous avez fermé la fenêtre de connexion."};
    }
    return { title: "Erreur Inconnue", description: `Un problème est survenu. Code: ${code}` };
}


export default function LoginDialog({ children }: { children?: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<{ title: string; description: string | JSX.Element } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");

  const anyLoading = emailLoading || googleLoading;

  useEffect(() => {
    if (open) {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
        }
    }
  }, [open]);

  const handleSignIn = async () => {
    setEmailLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      toast({ title: "Connexion réussie !" });
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      setOpen(false); // Close dialog on success
    } catch (e) {
        setError(getFriendlyErrorMessage(e));
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSignUp = async () => {
    setEmailLoading(true);
    setError(null);
    try {
        await signUpWithEmail(email, password);
        toast({ title: "Compte créé avec succès !", description: "Bienvenue sur AgronomAi." });
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        setOpen(false); // Close dialog on success
    } catch(e) {
        setError(getFriendlyErrorMessage(e));
    } finally {
        setEmailLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
        await signInWithGoogle();
        // The onAuthStateChanged listener will handle the redirect.
        // We can close the dialog optimistically.
        setOpen(false);
    } catch (e) {
        setError(getFriendlyErrorMessage(e));
    } finally {
        setGoogleLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
        toast({
            variant: "destructive",
            title: "Adresse e-mail requise",
            description: "Veuillez entrer votre adresse e-mail pour réinitialiser le mot de passe.",
        });
        return;
    }
    setEmailLoading(true);
    try {
        await sendPasswordReset(email);
        toast({
            title: "E-mail de réinitialisation envoyé",
            description: "Veuillez consulter votre boîte de réception pour les instructions.",
        });
    } catch (error) {
         setError(getFriendlyErrorMessage(error));
    } finally {
        setEmailLoading(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !anyLoading) {
        if (activeTab === 'signin') {
            handleSignIn();
        } else {
            handleSignUp();
        }
    }
  };


  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setError(null);
            setPassword("");
        }
    }}>
      <DialogTrigger asChild>
        {children || <Button>Connexion / Inscription</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accès à AgronomAi</DialogTitle>
          <DialogDescription>
            Connectez-vous pour accéder à votre tableau de bord ou inscrivez-vous pour commencer.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(tab) => {
            setActiveTab(tab);
            setError(null);
        }}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" disabled={anyLoading}>Se Connecter</TabsTrigger>
                <TabsTrigger value="signup" disabled={anyLoading}>S'inscrire</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="py-4 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={anyLoading} onKeyDown={handleKeyPress}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-signin">Mot de passe</Label>
                    <Input id="password-signin" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} disabled={anyLoading}/>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me-signin" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} disabled={anyLoading}/>
                        <Label htmlFor="remember-me-signin" className="text-sm font-normal cursor-pointer">Se souvenir de moi</Label>
                    </div>
                    <Button variant="link" type="button" onClick={handlePasswordReset} className="p-0 h-auto text-sm" disabled={anyLoading}>
                        Mot de passe oublié ?
                    </Button>
                </div>
                 {error && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.description}</AlertDescription>
                    </Alert>
                )}
                 <Button onClick={handleSignIn} disabled={anyLoading} className="w-full">
                    {emailLoading ? <Loader className="animate-spin" /> : 'Se Connecter'}
                </Button>
            </TabsContent>
            <TabsContent value="signup" className="py-4 space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={anyLoading} onKeyDown={handleKeyPress}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password-signup">Mot de passe</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} disabled={anyLoading}/>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me-signup" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} disabled={anyLoading}/>
                    <Label htmlFor="remember-me-signup" className="text-sm font-normal cursor-pointer">Se souvenir de moi</Label>
                </div>
                 {error && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.description}</AlertDescription>
                    </Alert>
                )}
                 <Button onClick={handleSignUp} disabled={anyLoading} className="w-full">
                    {emailLoading ? <Loader className="animate-spin" /> : 'Créer un Compte'}
                </Button>
            </TabsContent>
        </Tabs>
        
       <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Ou
                </span>
            </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={anyLoading}>
            {googleLoading ? <Loader className="animate-spin" /> : (
                <>
                    <GoogleIcon />
                    <span className="ml-2">Continuer avec Google</span>
                </>
            )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
