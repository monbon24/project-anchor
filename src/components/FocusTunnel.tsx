'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Play, Pause, SkipForward, Check, ArrowClockwise } from '@phosphor-icons/react';
import { PlayerStats } from '@/hooks/useLocalStorage';
import confetti from 'canvas-confetti';

interface RoutineStep {
  id: string;
  name: string;
  durationSeconds: number;
}

interface FocusTunnelProps {
  playerStats: PlayerStats;
  setPlayerStats: (stats: PlayerStats | ((prev: PlayerStats) => PlayerStats)) => void;
}

const defaultRoutines = {
  morning: [
    { id: '1', name: 'Make bed', durationSeconds: 60 },
    { id: '2', name: 'Brush teeth', durationSeconds: 120 },
    { id: '3', name: 'Wash face', durationSeconds: 60 },
    { id: '4', name: 'Get dressed', durationSeconds: 180 },
    { id: '5', name: 'Drink water', durationSeconds: 30 },
  ],
  focus: [
    { id: '1', name: 'Clear desk', durationSeconds: 60 },
    { id: '2', name: 'Set intention', durationSeconds: 30 },
    { id: '3', name: 'Deep work', durationSeconds: 1500 }, // 25 min pomodoro
    { id: '4', name: 'Short break', durationSeconds: 300 },
  ],
  evening: [
    { id: '1', name: 'Review day', durationSeconds: 120 },
    { id: '2', name: 'Prep tomorrow', durationSeconds: 180 },
    { id: '3', name: 'Wind down', durationSeconds: 600 },
  ],
};

export default function FocusTunnel({ playerStats, setPlayerStats }: FocusTunnelProps) {
  const [selectedRoutine, setSelectedRoutine] = useState<'morning' | 'focus' | 'evening' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = selectedRoutine ? defaultRoutines[selectedRoutine] : [];
  const currentStep = steps[currentStepIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRoutine = (routine: 'morning' | 'focus' | 'evening') => {
    setSelectedRoutine(routine);
    setCurrentStepIndex(0);
    setTimeRemaining(defaultRoutines[routine][0].durationSeconds);
    setIsRunning(false);
    setIsComplete(false);
  };

  const completeStep = useCallback(() => {
    // Award XP for completing step
    setPlayerStats((prev: PlayerStats) => ({
      ...prev,
      xp: prev.xp + 5,
      gold: prev.gold + 2,
    }));

    if (currentStepIndex < steps.length - 1) {
      // Move to next step
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeRemaining(steps[nextIndex].durationSeconds);
      setIsRunning(true);
    } else {
      // Routine complete!
      setIsComplete(true);
      setIsRunning(false);
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#22C55E', '#A855F7', '#6366F1', '#EAB308'],
      });
      setPlayerStats((prev: PlayerStats) => ({
        ...prev,
        xp: prev.xp + 50,
        gold: prev.gold + 20,
      }));
    }
  }, [currentStepIndex, steps, setPlayerStats]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-advance
            completeStep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeRemaining, completeStep]);

  const togglePause = () => setIsRunning(!isRunning);
  const skipStep = () => completeStep();
  const resetRoutine = () => {
    setSelectedRoutine(null);
    setIsComplete(false);
  };

  // Routine selection screen
  if (!selectedRoutine) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-xp flex items-center justify-center glow-primary">
            <Timer size={32} weight="duotone" className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Focus Tunnel</h2>
            <p className="text-text-muted">Pick a routine, enter the zone</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(defaultRoutines).map(([key, routine]) => (
            <button
              key={key}
              onClick={() => startRoutine(key as 'morning' | 'focus' | 'evening')}
              className="interactive w-full p-5 bg-bg-card rounded-2xl border border-bg-elevated hover:border-primary text-left transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text capitalize">{key} Routine</h3>
                  <p className="text-sm text-text-muted">{routine.length} steps • {Math.ceil(routine.reduce((acc, s) => acc + s.durationSeconds, 0) / 60)} min</p>
                </div>
                <Play size={24} className="text-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6 glow-success">
          <Check size={48} weight="bold" className="text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text mb-2">Routine Complete! 🎉</h2>
        <p className="text-text-muted mb-6">+50 XP, +20 Gold earned</p>
        <button
          onClick={resetRoutine}
          className="interactive px-6 py-3 bg-primary rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <ArrowClockwise size={20} />
          Do Another
        </button>
      </div>
    );
  }

  // Active routine screen
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col items-center py-8">
      {/* Progress */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-xs text-text-muted mb-2">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill bg-gradient-to-r from-primary to-xp" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Current Step */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text mb-2">{currentStep?.name}</h2>
        <div className={`text-6xl font-mono font-bold ${timeRemaining < 10 ? 'text-danger' : 'text-primary'}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePause}
          className="interactive w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-primary"
        >
          {isRunning ? (
            <Pause size={32} weight="fill" className="text-white" />
          ) : (
            <Play size={32} weight="fill" className="text-white" />
          )}
        </button>
        <button
          onClick={skipStep}
          className="interactive w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-primary/20"
        >
          <SkipForward size={24} className="text-text-muted" />
        </button>
      </div>

      {/* Cancel */}
      <button onClick={resetRoutine} className="mt-8 text-sm text-text-muted hover:text-text">
        Exit Routine
      </button>
    </div>
  );
}
