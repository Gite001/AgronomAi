
"use client";

import { useEffect, useState } from 'react';
import LoginDialog from '../auth/login-dialog';
import { useAuth } from '@/context/auth-context';
import { signOut } from '@/lib/firebase/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogOut, Loader } from 'lucide-react';
import { Button } from '../ui/button';
  

export function Header() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Button disabled className="w-[190px]"><Loader className="animate-spin mr-2" /> Chargement...</Button>;
  }
  
  if (!user) {
    return <LoginDialog />;
  }

  return (
    <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'Avatar'} />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'Utilisateur'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
