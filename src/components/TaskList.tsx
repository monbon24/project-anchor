'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash, Sparkle } from '@phosphor-icons/react';
import { Task, PlayerStats } from '@/hooks/useLocalStorage';
import confetti from 'canvas-confetti';

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  playerStats: PlayerStats;
  setPlayerStats: (stats: PlayerStats | ((prev: PlayerStats) => PlayerStats)) => void;
}

export default function TaskList({ tasks, setTasks, playerStats, setPlayerStats }: TaskListProps) {
  const [newTask, setNewTask] = useState('');

  const triggerReward = (xp: number, gold: number) => {
    // Confetti burst
    confetti({
      particleCount: 50 + xp,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A855F7', '#6366F1', '#22C55E', '#EAB308'],
    });

    // Update player stats
    setPlayerStats((prev: PlayerStats) => ({
      ...prev,
      xp: prev.xp + xp,
      gold: prev.gold + gold,
    }));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        xpReward: 15 + Math.floor(Math.random() * 10),
        goldReward: 5 + Math.floor(Math.random() * 5),
        createdAt: new Date().toISOString(),
      };
      setTasks((prev: Task[]) => [...prev, task]);
      setNewTask('');
    }
  };

  const completeTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      triggerReward(task.xpReward, task.goldReward);
      setTasks((prev: Task[]) => prev.map(t => 
        t.id === id ? { ...t, completed: true } : t
      ));
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <CheckCircle size={24} weight="duotone" className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Quest Log</h3>
          <p className="text-xs text-text-muted">{incompleteTasks.length} active quests</p>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new quest..."
          className="flex-1 bg-bg-elevated rounded-xl px-4 py-3 text-text placeholder:text-text-muted outline-none border border-transparent focus:border-primary transition-colors"
        />
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="interactive w-12 h-12 bg-primary rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={24} weight="bold" className="text-white" />
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {incompleteTasks.map((task) => (
          <div
            key={task.id}
            className="interactive flex items-center gap-3 bg-bg-elevated rounded-xl p-3 group"
          >
            <button
              onClick={() => completeTask(task.id)}
              className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <Circle size={16} weight="regular" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="flex-1 text-text font-medium">{task.title}</span>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="text-xp">+{task.xpReward} XP</span>
              <span className="text-gold">+{task.goldReward} G</span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-danger/20 transition-all"
            >
              <Trash size={14} className="text-danger" />
            </button>
          </div>
        ))}

        {incompleteTasks.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <Sparkle size={32} weight="duotone" className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active quests. Add one above!</p>
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-bg-elevated">
          <p className="text-xs text-text-muted mb-2">Completed ({completedTasks.length})</p>
          <div className="space-y-1">
            {completedTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 opacity-50"
              >
                <CheckCircle size={18} weight="fill" className="text-success" />
                <span className="text-sm text-text-muted line-through">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
