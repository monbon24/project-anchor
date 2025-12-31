'use client';

import { useState, useCallback } from 'react';
import { Target, Plus, Trash, Sparkle } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function BigThree() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('big-three-tasks', []);
  const [newTask, setNewTask] = useState('');

  const triggerConfetti = useCallback(() => {
    // Pastel-colored confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E2F0CB', '#E0BBE4', '#FFDFD3', '#FFE5EC', '#D4E4FF'],
      shapes: ['star', 'circle'],
    });
  }, []);

  const addTask = () => {
    if (newTask.trim() && tasks.length < 3) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id && !task.completed) {
        triggerConfetti();
        return { ...task, completed: true };
      }
      return task.id === id ? { ...task, completed: !task.completed } : task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const remainingSlots = 3 - tasks.length;

  return (
    <div className="cloud-shadow bg-gradient-to-br from-blush/60 via-blush/40 to-lavender/30 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blush flex items-center justify-center">
          <Target size={24} weight="duotone" className="text-charcoal" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-charcoal">The Big Three</h3>
          <p className="text-sm text-charcoal-light">Today&apos;s critical focus</p>
        </div>
        <Sparkle size={20} weight="fill" className="text-blush-dark ml-auto animate-pulse" />
      </div>

      {/* Task Input */}
      {remainingSlots > 0 && (
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add critical task (${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} left)`}
            className="flex-1 bg-white/80 rounded-2xl px-5 py-3 text-charcoal font-medium outline-none border-2 border-transparent focus:border-blush-dark placeholder:text-charcoal-light/60 transition-colors"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="squishy w-12 h-12 bg-blush rounded-2xl flex items-center justify-center hover:bg-blush-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={24} weight="bold" className="text-charcoal" />
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`squishy flex items-center gap-4 bg-white/70 rounded-2xl p-4 border-2 transition-all ${
              task.completed 
                ? 'border-sage bg-sage/20' 
                : 'border-white/50 hover:border-blush'
            }`}
          >
            {/* Custom Checkbox */}
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-7 h-7 rounded-xl border-3 flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-sage border-sage-dark'
                  : 'bg-white border-blush-dark hover:bg-blush/30'
              }`}
            >
              {task.completed && (
                <span className="text-charcoal font-bold text-sm">✓</span>
              )}
            </button>

            {/* Task Text */}
            <span className={`flex-1 font-medium transition-all ${
              task.completed 
                ? 'text-charcoal-light line-through' 
                : 'text-charcoal'
            }`}>
              {task.text}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => deleteTask(task.id)}
              className="squishy w-8 h-8 rounded-xl bg-blush/50 flex items-center justify-center hover:bg-blush transition-colors opacity-50 hover:opacity-100"
            >
              <Trash size={16} weight="duotone" className="text-charcoal" />
            </button>
          </div>
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-charcoal-light">
            <Target size={40} weight="duotone" className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No tasks yet</p>
            <p className="text-sm">Add up to 3 critical tasks for today</p>
          </div>
        )}
      </div>
    </div>
  );
}
