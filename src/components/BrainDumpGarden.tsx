'use client';

import { useState } from 'react';
import { Plant, PaperPlaneRight } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface LogEntry {
  id: string;
  text: string;
  timestamp: string;
}

export default function BrainDumpGarden() {
  const [entries, setEntries] = useLocalStorage<LogEntry[]>('brain-dump-entries', []);
  const [newEntry, setNewEntry] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${formatTime(date)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formatTime(date)}`;
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const addEntry = () => {
    if (newEntry.trim()) {
      const entry: LogEntry = {
        id: Date.now().toString(),
        text: newEntry.trim(),
        timestamp: new Date().toISOString(),
      };
      setEntries([entry, ...entries]);
      setNewEntry('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry();
    }
  };

  const clearAll = () => {
    if (entries.length > 0 && confirm('Clear all entries? This cannot be undone.')) {
      setEntries([]);
    }
  };

  return (
    <div className="cloud-shadow bg-gradient-to-br from-sage/60 via-sage/40 to-lavender/20 rounded-3xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage flex items-center justify-center">
            <Plant size={24} weight="duotone" className="text-charcoal" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Brain Dump</h3>
            <p className="text-sm text-charcoal-light">Clear your mental RAM</p>
          </div>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-charcoal-light hover:text-charcoal transition-colors underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind? Press Enter to log..."
            rows={2}
            className="paper-texture w-full rounded-2xl px-5 py-3 text-charcoal font-medium outline-none border-2 border-transparent focus:border-sage-dark placeholder:text-charcoal-light/60 transition-colors resize-none"
          />
        </div>
        <button
          onClick={addEntry}
          disabled={!newEntry.trim()}
          className="squishy self-end w-12 h-12 bg-sage rounded-2xl flex items-center justify-center hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperPlaneRight size={22} weight="fill" className="text-charcoal" />
        </button>
      </div>

      {/* Entries Log */}
      <div className="flex-1 overflow-y-auto space-y-3 min-h-0 max-h-64">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/60 rounded-xl p-4 border-l-4 border-sage"
          >
            <p className="text-charcoal font-medium leading-relaxed whitespace-pre-wrap">
              {entry.text}
            </p>
            <p className="text-xs text-charcoal-light mt-2 font-medium">
              {formatDate(entry.timestamp)}
            </p>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-8 text-charcoal-light">
            <Plant size={40} weight="duotone" className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">Your garden is empty</p>
            <p className="text-sm">Plant some thoughts to grow</p>
          </div>
        )}
      </div>
    </div>
  );
}
