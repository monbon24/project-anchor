'use client';

import { useEffect } from 'react';
import { Drop, Sun, BookOpen, Moon, Barbell, Coffee } from '@phosphor-icons/react';
import { Habit, PlayerStats } from '@/hooks/useLocalStorage';
import { Fire } from '@phosphor-icons/react';
import confetti from 'canvas-confetti';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[] | ((prev: Habit[]) => Habit[])) => void;
  playerStats: PlayerStats;
  setPlayerStats: (stats: PlayerStats | ((prev: PlayerStats) => PlayerStats)) => void;
}

const iconMap: Record<string, React.ComponentType<{ size: number; weight: 'fill' | 'duotone'; className?: string }>> = {
  water: Drop,
  sun: Sun,
  book: BookOpen,
  sleep: Moon,
  exercise: Barbell,
  coffee: Coffee,
};

export const defaultHabits: Habit[] = [
  { id: '1', name: 'Hydrate', icon: 'water', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
  { id: '2', name: 'Sunlight', icon: 'sun', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
  { id: '3', name: 'Reading', icon: 'book', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
  { id: '4', name: 'Sleep', icon: 'sleep', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
  { id: '5', name: 'Exercise', icon: 'exercise', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
  { id: '6', name: 'Focus', icon: 'coffee', currentStreak: 0, bestStreak: 0, lastCompleted: null, completedToday: false },
];

export default function HabitTracker({ habits, setHabits, playerStats, setPlayerStats }: HabitTrackerProps) {
  
  // Check for missed habits on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let damageTaken = 0;

    const updatedHabits = habits.map(habit => {
      // If not completed today, not completed yesterday, and not yet penalized for yesterday
      if (
        habit.lastCompleted !== today && 
        habit.lastCompleted !== yesterday && 
        habit.lastPenalized !== yesterday
      ) {
        damageTaken += 5;
        return { ...habit, lastPenalized: yesterday, currentStreak: 0 };
      }
      return habit;
    });

    if (damageTaken > 0) {
      setHabits(updatedHabits);
      setPlayerStats(prev => ({
        ...prev,
        hp: Math.max(0, prev.hp - damageTaken)
      }));
      
      // Damage notification
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#EF4444', '#7F1D1D'], // Blood red
        shapes: ['circle'],
      });
    }
  }, []); // Run once on mount
  
  const toggleHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    const isCompletingToday = !habit.completedToday;

    if (isCompletingToday) {
      // Completing - give rewards
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#22C55E', '#A855F7', '#EAB308'],
      });

      setPlayerStats((prev: PlayerStats) => ({
        ...prev,
        xp: prev.xp + 10,
        gold: prev.gold + 3,
      }));
    }

    setHabits((prev: Habit[]) => prev.map(h => {
      if (h.id !== id) return h;

      if (isCompletingToday) {
        const newStreak = h.currentStreak + 1;
        return {
          ...h,
          completedToday: true,
          lastCompleted: today,
          currentStreak: newStreak,
          bestStreak: Math.max(newStreak, h.bestStreak),
        };
      } else {
        return {
          ...h,
          completedToday: false,
          currentStreak: Math.max(0, h.currentStreak - 1),
        };
      }
    }));
  };

  const completedCount = habits.filter(h => h.completedToday).length;
  const progress = (completedCount / habits.length) * 100;

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <Fire size={24} weight="fill" className="text-warning streak-fire" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">Daily Habits</h3>
            <p className="text-xs text-text-muted">{completedCount}/{habits.length} completed</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar h-2 mb-5">
        <div 
          className="progress-fill bg-gradient-to-r from-success via-primary to-xp"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-3 gap-3">
        {habits.map((habit) => {
          const IconComponent = iconMap[habit.icon] || Drop;
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`interactive flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all ${
                habit.completedToday
                  ? 'bg-success/20 border-success glow-success'
                  : 'bg-bg-elevated border-bg-elevated hover:border-primary'
              }`}
            >
              <IconComponent 
                size={28} 
                weight={habit.completedToday ? 'fill' : 'duotone'} 
                className={habit.completedToday ? 'text-success' : 'text-text-muted'}
              />
              <span className={`text-xs font-semibold mt-2 ${
                habit.completedToday ? 'text-success' : 'text-text-muted'
              }`}>
                {habit.name}
              </span>
              {habit.currentStreak > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Fire size={10} weight="fill" className="text-warning" />
                  <span className="text-[10px] font-bold text-warning">{habit.currentStreak}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
