'use client';

import { useState } from 'react';
import { Brain, Sparkle, Lightbulb } from '@phosphor-icons/react';
import VoiceRecorder from '@/components/VoiceRecorder';
import TaskDecomposer from '@/components/TaskDecomposer';
import { Task } from '@/hooks/useLocalStorage';

interface CaptureModuleProps {
  onTasksCreated: (tasks: Task[]) => void;
}

export default function CaptureModule({ onTasksCreated }: CaptureModuleProps) {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscript = (text: string) => {
    setTranscript(text);
    setIsProcessing(false);
  };

  const handleTasksCreated = (tasks: Task[]) => {
    onTasksCreated(tasks);
    setTranscript(null);
  };

  const handleClear = () => {
    setTranscript(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-danger flex items-center justify-center glow-primary">
          <Brain size={32} weight="duotone" className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text">Brain Dump</h2>
          <p className="text-text-muted">Speak freely, let AI organize</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-bg-card/50 rounded-xl p-4 border border-bg-elevated">
        <div className="flex items-start gap-3">
          <Lightbulb size={20} className="text-warning mt-0.5" />
          <div>
            <p className="text-sm text-text-muted">
              <span className="font-semibold text-text">Pro tip:</span> Just ramble! Say everything on your mind. 
              The AI will extract action items and break down overwhelming tasks into tiny, doable steps.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Recorder or Task Decomposer */}
      {transcript ? (
        <TaskDecomposer
          transcript={transcript}
          onTasksCreated={handleTasksCreated}
          onClear={handleClear}
        />
      ) : (
        <VoiceRecorder
          onTranscript={handleTranscript}
          isProcessing={isProcessing}
        />
      )}

      {/* Alternative: Text Input */}
      {!transcript && (
        <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
          <h4 className="text-sm font-semibold text-text-muted mb-3 flex items-center gap-2">
            <Sparkle size={14} />
            Or type your thoughts:
          </h4>
          <textarea
            placeholder="I need to do laundry but it feels like so much work. Also have to call the dentist and finish that project..."
            rows={3}
            className="w-full bg-bg-elevated rounded-xl px-4 py-3 text-text placeholder:text-text-muted outline-none border border-transparent focus:border-warning transition-colors resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const target = e.target as HTMLTextAreaElement;
                if (target.value.trim()) {
                  setTranscript(target.value.trim());
                  target.value = '';
                }
              }
            }}
          />
          <p className="text-xs text-text-muted mt-2">Press Enter to process</p>
        </div>
      )}
    </div>
  );
}
