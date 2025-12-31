'use client';

import { useState } from 'react';
import { MagicWand, Plus, Sparkle, ArrowRight, CaretDown, CaretUp } from '@phosphor-icons/react';
import { Task } from '@/hooks/useLocalStorage';

interface TaskDecomposerProps {
  transcript: string;
  onTasksCreated: (tasks: Task[]) => void;
  onClear: () => void;
}

// Spiciness levels - how granular to break down tasks
const spicyLevels = [
  { level: 1, name: 'Light', description: 'High-level steps' },
  { level: 2, name: 'Medium', description: 'Balanced breakdown' },
  { level: 3, name: 'Hot', description: 'Detailed steps' },
  { level: 4, name: 'Extra Hot', description: 'Very granular' },
  { level: 5, name: '🔥 Inferno', description: 'Absurdly tiny steps' },
];

export default function TaskDecomposer({ transcript, onTasksCreated, onClear }: TaskDecomposerProps) {
  const [spiciness, setSpiciness] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decomposedTasks, setDecomposedTasks] = useState<string[]>([]);
  const [showSpiciness, setShowSpiciness] = useState(false);

  const decomposeWithAI = async () => {
    setIsProcessing(true);
    
    // Simulate AI processing (in production, call GPT-4o API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo: Generate mock decomposed tasks based on spiciness
    const mockDecomposition = generateMockTasks(transcript, spiciness);
    setDecomposedTasks(mockDecomposition);
    setIsProcessing(false);
  };

  const generateMockTasks = (text: string, level: number): string[] => {
    // Simulate AI task decomposition
    const baseTasks = [
      'Clean the kitchen',
      'Call mom',
      'Finish work report',
      'Drink water',
      'Take a walk',
      'Respond to emails',
      'Do laundry',
      'Schedule dentist appointment',
    ];

    // Filter relevant tasks based on transcript keywords
    let relevantTasks = baseTasks.filter(task => {
      const keywords = task.toLowerCase().split(' ');
      return keywords.some(kw => text.toLowerCase().includes(kw.slice(0, 4)));
    });

    if (relevantTasks.length === 0) {
      relevantTasks = baseTasks.slice(0, 3);
    }

    // Break down based on spiciness
    if (level >= 3) {
      const detailed: string[] = [];
      relevantTasks.forEach(task => {
        if (task.includes('kitchen')) {
          detailed.push('Pick up any trash from counters');
          detailed.push('Load dishes into dishwasher');
          detailed.push('Wipe down counters');
          if (level >= 4) {
            detailed.push('Take out trash bag');
            detailed.push('Put in new trash bag');
          }
          if (level >= 5) {
            detailed.push('Stand up from chair');
            detailed.push('Walk to kitchen');
            detailed.push('Open trash cabinet');
          }
        } else if (task.includes('Call')) {
          detailed.push('Find phone');
          detailed.push('Open contacts');
          detailed.push('Call mom');
          if (level >= 4) {
            detailed.push('Say hello');
            detailed.push('Ask how she is doing');
          }
        } else {
          detailed.push(task);
        }
      });
      return detailed.slice(0, 8);
    }

    return relevantTasks;
  };

  const addAllTasks = () => {
    const newTasks: Task[] = decomposedTasks.map((title, i) => ({
      id: `${Date.now()}-${i}`,
      title,
      completed: false,
      xpReward: 10 + Math.floor(Math.random() * 15),
      goldReward: 3 + Math.floor(Math.random() * 7),
      createdAt: new Date().toISOString(),
    }));
    onTasksCreated(newTasks);
    setDecomposedTasks([]);
    onClear();
  };

  return (
    <div className="bg-bg-card rounded-2xl p-6 border border-bg-elevated">
      {/* Transcript Display */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-muted mb-2">Your Brain Dump:</h3>
        <p className="text-text bg-bg-elevated rounded-xl p-4 italic">
          &ldquo;{transcript}&rdquo;
        </p>
      </div>

      {/* Spiciness Control */}
      <div className="mb-6">
        <button
          onClick={() => setShowSpiciness(!showSpiciness)}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
        >
          <MagicWand size={16} />
          <span>Breakdown Level: {spicyLevels[spiciness - 1].name}</span>
          {showSpiciness ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
        
        {showSpiciness && (
          <div className="mt-3 p-4 bg-bg-elevated rounded-xl">
            <input
              type="range"
              min={1}
              max={5}
              value={spiciness}
              onChange={(e) => setSpiciness(Number(e.target.value))}
              className="w-full accent-warning"
            />
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>Light</span>
              <span>🔥 Inferno</span>
            </div>
            <p className="text-xs text-text-muted mt-2 text-center">
              {spicyLevels[spiciness - 1].description}
            </p>
          </div>
        )}
      </div>

      {/* Magic Button */}
      {decomposedTasks.length === 0 && (
        <button
          onClick={decomposeWithAI}
          disabled={isProcessing}
          className="interactive w-full py-4 px-6 bg-gradient-to-r from-xp to-primary rounded-xl flex items-center justify-center gap-3 text-white font-semibold glow-xp disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Sparkle size={24} className="animate-spin" />
              <span>AI is thinking...</span>
            </>
          ) : (
            <>
              <MagicWand size={24} weight="fill" />
              <span>Break It Down!</span>
            </>
          )}
        </button>
      )}

      {/* Decomposed Tasks */}
      {decomposedTasks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-success flex items-center gap-2">
            <Sparkle size={16} weight="fill" />
            Action Items Extracted:
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {decomposedTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <span className="text-text flex-1">{task}</span>
              </div>
            ))}
          </div>

          <button
            onClick={addAllTasks}
            className="interactive w-full py-3 px-6 bg-success rounded-xl flex items-center justify-center gap-2 text-white font-semibold hover:bg-success-dark transition-colors"
          >
            <Plus size={20} weight="bold" />
            <span>Add All to Quest Log</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={onClear}
            className="w-full py-2 text-sm text-text-muted hover:text-text transition-colors"
          >
            Clear & Start Over
          </button>
        </div>
      )}
    </div>
  );
}
