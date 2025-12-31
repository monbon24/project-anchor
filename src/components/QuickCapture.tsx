'use client';

import { useState } from 'react';
import { Microphone, PaperPlaneRight, Brain, Clock } from '@phosphor-icons/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CaptureEntry {
  id: string;
  text: string;
  timestamp: string;
}

export default function QuickCapture() {
  const [entries, setEntries] = useLocalStorage<CaptureEntry[]>('quick-captures', []);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const addEntry = () => {
    if (input.trim()) {
      const entry: CaptureEntry = {
        id: Date.now().toString(),
        text: input.trim(),
        timestamp: new Date().toISOString(),
      };
      setEntries((prev: CaptureEntry[]) => [entry, ...prev]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
          <Brain size={24} weight="duotone" className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Quick Capture</h3>
          <p className="text-xs text-text-muted">Dump thoughts, clear your mind</p>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`interactive w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isRecording ? 'bg-danger animate-pulse' : 'bg-bg-elevated hover:bg-primary/20'
          }`}
        >
          <Microphone size={22} weight={isRecording ? 'fill' : 'duotone'} className={isRecording ? 'text-white' : 'text-text-muted'} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          className="flex-1 bg-bg-elevated rounded-xl px-4 py-3 text-text placeholder:text-text-muted outline-none border border-transparent focus:border-warning transition-colors"
        />
        <button
          onClick={addEntry}
          disabled={!input.trim()}
          className="interactive w-12 h-12 bg-warning rounded-xl flex items-center justify-center hover:bg-warning/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperPlaneRight size={22} weight="fill" className="text-bg-dark" />
        </button>
      </div>

      {/* Recent Captures */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {entries.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-3 p-3 bg-bg-elevated rounded-lg"
          >
            <Clock size={14} className="text-text-muted mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text">{entry.text}</p>
              <p className="text-xs text-text-muted mt-1">{formatTime(entry.timestamp)}</p>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center py-6 text-text-muted">
            <Brain size={28} weight="duotone" className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Empty mind = ready for focus</p>
          </div>
        )}
      </div>
    </div>
  );
}
