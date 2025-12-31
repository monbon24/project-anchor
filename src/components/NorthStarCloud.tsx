'use client';

import { useState } from 'react';
import { Cloud, PencilSimple, Check } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Goal {
  id: number;
  text: string;
}

export default function NorthStarCloud() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('northstar-goals', [
    { id: 1, text: 'Click to set your first annual goal' },
    { id: 2, text: 'Click to set your second annual goal' },
    { id: 3, text: 'Click to set your third annual goal' },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      setGoals(goals.map(g => 
        g.id === editingId ? { ...g, text: editText } : g
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="cloud-shadow float-animation bg-gradient-to-br from-lavender/60 via-lavender/40 to-blush/30 rounded-[40px] p-8 mb-8">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Cloud size={32} weight="duotone" className="text-lavender-dark" />
        <h2 className="text-2xl font-bold text-charcoal tracking-wide">
          North Star Goals
        </h2>
        <Cloud size={32} weight="duotone" className="text-lavender-dark" />
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className="squishy bg-white/70 backdrop-blur-sm rounded-3xl p-5 border-2 border-white/50 hover:border-lavender transition-all cursor-pointer group"
            onClick={() => !editingId && startEditing(goal)}
          >
            {/* Goal Number Badge */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender to-blush flex items-center justify-center text-charcoal font-bold text-sm">
                {index + 1}
              </span>
              <span className="text-xs uppercase tracking-widest text-charcoal-light font-semibold">
                Annual Goal
              </span>
            </div>

            {/* Goal Text */}
            {editingId === goal.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-white/80 rounded-xl px-4 py-2 text-charcoal font-medium outline-none border-2 border-lavender focus:border-lavender-dark"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                  className="squishy w-10 h-10 bg-sage rounded-xl flex items-center justify-center hover:bg-sage-dark transition-colors"
                >
                  <Check size={20} weight="bold" className="text-charcoal" />
                </button>
              </div>
            ) : (
              <p className="text-charcoal font-medium leading-relaxed group-hover:text-charcoal-light transition-colors flex items-center gap-2">
                {goal.text}
                <PencilSimple size={16} weight="duotone" className="opacity-0 group-hover:opacity-100 transition-opacity text-lavender-dark" />
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
