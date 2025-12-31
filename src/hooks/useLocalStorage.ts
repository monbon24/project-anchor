'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, isHydrated]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => value instanceof Function ? value(prev) : value);
  }, []);

  return [storedValue, setValue];
}

// Game state types
export interface PlayerStats {
  xp: number;
  hp: number;
  maxHp: number;
  gold: number;
  level: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
  goldReward: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  currentStreak: number;
  bestStreak: number;
  lastCompleted: string | null;
  completedToday: boolean;
}

// XP required for each level
export function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate level from XP
export function calculateLevel(totalXp: number): { level: number; currentXp: number; xpForNext: number } {
  let level = 1;
  let xpRemaining = totalXp;
  
  while (xpRemaining >= getXpForLevel(level)) {
    xpRemaining -= getXpForLevel(level);
    level++;
  }
  
  return {
    level,
    currentXp: xpRemaining,
    xpForNext: getXpForLevel(level),
  };
}
