'use client';

import { useState } from 'react';
import { CalendarCheck, Sun, Target, Warning, Check, ArrowRight } from '@phosphor-icons/react';
import { Task } from '@/hooks/useLocalStorage';

interface MorningWizardProps {
  tasks: Task[];
  onComplete: () => void;
}

export default function MorningWizard({ tasks, onComplete }: MorningWizardProps) {
  const [step, setStep] = useState(0);
  const [dailyFocus, setDailyFocus] = useState('');
  
  const incompleteTasks = tasks.filter(t => !t.completed);
  const totalEstimatedTime = incompleteTasks.length * 30; // Estimate 30 min per task
  const availableHours = 8; // Assume 8 working hours
  const isOverloaded = totalEstimatedTime > availableHours * 60;

  const steps = [
    {
      title: 'Good Morning! ☀️',
      subtitle: 'Let\'s plan your day',
      content: (
        <div className="text-center py-8">
          <Sun size={64} className="text-warning mx-auto mb-4" />
          <p className="text-text-muted">Take a deep breath. We&apos;ll make today manageable.</p>
        </div>
      ),
    },
    {
      title: 'Your Quest Log',
      subtitle: `${incompleteTasks.length} tasks waiting`,
      content: (
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {incompleteTasks.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Check size={48} className="mx-auto mb-2 text-success" />
              <p>All caught up! Add tasks in the Hub.</p>
            </div>
          ) : (
            incompleteTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-text">{task.title}</span>
              </div>
            ))
          )}
          {incompleteTasks.length > 5 && (
            <p className="text-xs text-text-muted text-center">+{incompleteTasks.length - 5} more</p>
          )}
        </div>
      ),
    },
    {
      title: 'Reality Check',
      subtitle: 'Is this realistic?',
      content: (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl ${isOverloaded ? 'bg-danger/20 border border-danger' : 'bg-success/20 border border-success'}`}>
            {isOverloaded ? (
              <div className="flex items-start gap-3">
                <Warning size={24} className="text-danger flex-shrink-0" />
                <div>
                  <p className="font-semibold text-danger">Heads up!</p>
                  <p className="text-sm text-text-muted">
                    {incompleteTasks.length} tasks might be too much. Consider moving some to tomorrow.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Check size={24} className="text-success flex-shrink-0" />
                <div>
                  <p className="font-semibold text-success">Looks good!</p>
                  <p className="text-sm text-text-muted">
                    Your task load seems manageable today.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Set Your North Star',
      subtitle: 'ONE main goal for today',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-bg-elevated rounded-xl">
            <Target size={24} className="text-warning" />
            <input
              type="text"
              value={dailyFocus}
              onChange={(e) => setDailyFocus(e.target.value)}
              placeholder="If I only do ONE thing today..."
              className="flex-1 bg-transparent text-text placeholder:text-text-muted outline-none"
            />
          </div>
          <p className="text-xs text-text-muted text-center">
            This is your anchor. Everything else is bonus.
          </p>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warning to-danger flex items-center justify-center">
          <CalendarCheck size={32} weight="duotone" className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text">{currentStep.title}</h2>
          <p className="text-text-muted">{currentStep.subtitle}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-bg-elevated'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="bg-bg-card rounded-2xl p-6 border border-bg-elevated min-h-[200px]">
        {currentStep.content}
      </div>

      {/* Navigation */}
      <button
        onClick={nextStep}
        className="interactive w-full py-4 bg-primary rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
      >
        {isLastStep ? 'Start My Day' : 'Continue'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
