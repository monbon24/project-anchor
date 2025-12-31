'use client';

import { useState } from 'react';
import { Star, PencilSimple, Check } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Goal {
  id: number;
  text: string;
}

export default function NorthStarGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('northstar-goals', [
    { id: 1, text: 'Set your first annual goal' },
    { id: 2, text: 'Set your second annual goal' },
    { id: 3, text: 'Set your third annual goal' },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = () => {
    if (editingId !== null && editText.trim()) {
      setGoals(goals.map(g => 
        g.id === editingId ? { ...g, text: editText.trim() } : g
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-xp/20 via-primary/20 to-warning/20 rounded-2xl p-5 border border-xp/30 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Star size={24} weight="fill" className="text-warning" />
        <h3 className="text-lg font-bold text-text">North Star Goals</h3>
        <span className="text-xs text-text-muted">Your annual compass</span>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            onClick={() => !editingId && startEditing(goal)}
            className="interactive bg-bg-card/80 backdrop-blur rounded-xl p-4 border border-bg-elevated hover:border-warning/50 cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center text-xs font-bold text-warning">
                {index + 1}
              </span>
              {editingId !== goal.id && (
                <PencilSimple size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {editingId === goal.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-bg-elevated rounded-lg px-3 py-2 text-sm text-text outline-none border border-warning"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                  className="w-8 h-8 bg-success rounded-lg flex items-center justify-center"
                >
                  <Check size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-text font-medium">{goal.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
