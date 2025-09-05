
"use client";

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './auth-context';

type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface ActionPlanTask {
  id: string;
  description: string;
  status: TaskStatus;
  timestamp: string;
  sourceTool: string;
  sourceEntryId?: string;
}

interface ActionPlanContextType {
  tasks: ActionPlanTask[];
  addTask: (task: Omit<ActionPlanTask, 'id' | 'timestamp' | 'status'>) => void;
  removeTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  clearPlan: () => void;
  loading: boolean;
}

const ActionPlanContext = createContext<ActionPlanContextType | undefined>(undefined);

export function ActionPlanProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<ActionPlanTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(authLoading);
    if (authLoading) return;

    if (user) {
      const storageKey = `actionPlanTasks_${user.uid}`;
      try {
        const item = window.localStorage.getItem(storageKey);
        setTasks(item ? JSON.parse(item) : []);
      } catch (error) {
        console.warn(`Error reading localStorage key “${storageKey}”:`, error);
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && user) {
        const storageKey = `actionPlanTasks_${user.uid}`;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(tasks));
        } catch (error) {
            console.warn(`Error setting localStorage key “${storageKey}”:`, error);
        }
    }
  }, [tasks, user, authLoading]);


  const addTask = useCallback((task: Omit<ActionPlanTask, 'id' | 'timestamp' | 'status'>) => {
    const newTask: ActionPlanTask = {
      ...task,
      id: uuidv4(),
      status: 'todo',
      timestamp: new Date().toISOString(),
    };
     setTasks(prevTasks => [newTask, ...prevTasks]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);
  
  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, status } : task));
  }, []);

  const clearPlan = useCallback(() => {
    setTasks([]);
  }, []);

  const value = { tasks, addTask, removeTask, updateTaskStatus, clearPlan, loading };

  return (
    <ActionPlanContext.Provider value={value}>
      {children}
    </ActionPlanContext.Provider>
  );
}

export function useActionPlan() {
  const context = useContext(ActionPlanContext);
  if (context === undefined) {
    throw new Error('useActionPlan must be used within an ActionPlanProvider');
  }
  return context;
}
