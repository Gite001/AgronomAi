
"use client";

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './auth-context';

export interface JournalEntry {
  id: string;
  tool: string;
  input: any;
  output: any;
  timestamp: string; 
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => string;
  removeEntry: (id: string) => void;
  clearJournal: () => void;
  loading: boolean;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are loading as long as the auth state is loading.
    setLoading(authLoading);
    if (authLoading) return; // Do nothing until auth is resolved

    if (user) {
      // If we have a user, try loading their data from localStorage.
      const storageKey = `journalEntries_${user.uid}`;
      try {
        const item = window.localStorage.getItem(storageKey);
        setEntries(item ? JSON.parse(item) : []);
      } catch (error) {
        console.warn(`Error reading localStorage key “${storageKey}”:`, error);
        setEntries([]);
      }
    } else {
      // If there's no user, the journal must be empty.
      setEntries([]);
    }
  }, [user, authLoading]);

  useEffect(() => {
    // This effect handles SAVING data to localStorage.
    // It should only run when the entries change AND we have a logged-in user.
    if (!authLoading && user) {
        const storageKey = `journalEntries_${user.uid}`;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(entries));
        } catch (error) {
            console.warn(`Error setting localStorage key “${storageKey}”:`, error);
        }
    }
  }, [entries, user, authLoading]);

  const addEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'timestamp'>): string => {
    const newId = uuidv4();
    const newEntry: JournalEntry = {
      ...entry,
      id: newId,
      timestamp: new Date().toISOString()
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
    return newId;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  }, []);
  
  const clearJournal = useCallback(() => {
    setEntries([]);
  }, []);

  const value = { entries, addEntry, removeEntry, clearJournal, loading };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
