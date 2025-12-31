'use client';

import { Drop, Sun, BookOpen, Moon, Heart, Coffee } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Habit {
  id: string;
  name: string;
  icon: 'water' | 'sun' | 'book' | 'sleep' | 'exercise' | 'coffee';
  color: 'sage' | 'lavender' | 'blush';
  completed: boolean;
}

const defaultHabits: Habit[] = [
  { id: '1', name: 'Hydrate', icon: 'water', color: 'lavender', completed: false },
  { id: '2', name: 'Sunlight', icon: 'sun', color: 'blush', completed: false },
  { id: '3', name: 'Reading', icon: 'book', color: 'sage', completed: false },
  { id: '4', name: 'Sleep', icon: 'sleep', color: 'lavender', completed: false },
  { id: '5', name: 'Exercise', icon: 'exercise', color: 'blush', completed: false },
  { id: '6', name: 'Coffee', icon: 'coffee', color: 'sage', completed: false },
];

const iconMap = {
  water: Drop,
  sun: Sun,
  book: BookOpen,
  sleep: Moon,
  exercise: Heart,
  coffee: Coffee,
};

const glowClasses = {
  sage: 'glow-sage',
  lavender: 'glow-lavender',
  blush: 'glow-blush',
};

const bgClasses = {
  sage: 'bg-sage',
  lavender: 'bg-lavender',
  blush: 'bg-blush',
};

export default function MoodTracker() {
  const todayKey = new Date().toISOString().split('T')[0];
  const [habits, setHabits] = useLocalStorage<Habit[]>(`habits-${todayKey}`, defaultHabits);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = (completedCount / habits.length) * 100;

  return (
    <div className="cloud-shadow bg-gradient-to-br from-lavender/50 via-blush/30 to-sage/30 rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center">
            <Heart size={24} weight="duotone" className="text-charcoal" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Daily Habits</h3>
            <p className="text-sm text-charcoal-light">{completedCount} of {habits.length} complete</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/50 rounded-full mb-5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sage via-lavender to-blush rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Habit Icons Grid */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        {habits.map((habit) => {
          const IconComponent = iconMap[habit.icon];
          return (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`squishy flex flex-col items-center justify-center py-4 px-3 rounded-2xl border-2 transition-all duration-300 ${
                habit.completed
                  ? `${bgClasses[habit.color]} ${glowClasses[habit.color]} border-transparent`
                  : 'bg-white/60 border-white/50 hover:border-lavender'
              }`}
            >
              <IconComponent 
                size={32} 
                weight={habit.completed ? 'fill' : 'duotone'} 
                className={`transition-all duration-300 ${
                  habit.completed ? 'text-charcoal scale-110' : 'text-charcoal-light'
                }`}
              />
              <span className={`text-xs font-semibold mt-2 transition-colors ${
                habit.completed ? 'text-charcoal' : 'text-charcoal-light'
              }`}>
                {habit.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
