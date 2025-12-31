'use client';

import { useState } from 'react';
import { Anchor, Target, Sparkle } from '@phosphor-icons/react';
import { useLocalStorage, PlayerStats as PlayerStatsType, Task, Habit, calculateLevel } from '@/hooks/useLocalStorage';
import PlayerStats from '@/components/PlayerStats';
import TaskList from '@/components/TaskList';
import HabitTracker, { defaultHabits } from '@/components/HabitTracker';
import QuickCapture from '@/components/QuickCapture';
import Navigation from '@/components/Navigation';
import CaptureModule from '@/components/CaptureModule';
import NorthStarGoals from '@/components/NorthStarGoals';
import SentimentFilter from '@/components/SentimentFilter';
import RewardShop from '@/components/RewardShop';
import FocusTunnel from '@/components/FocusTunnel';
import MorningWizard from '@/components/MorningWizard';

const initialPlayerStats: PlayerStatsType = {
  xp: 0,
  hp: 100,
  maxHp: 100,
  gold: 0,
  level: 1,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('hub');
  const [playerStats, setPlayerStats] = useLocalStorage<PlayerStatsType>('player-stats', initialPlayerStats);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', defaultHabits);
  const [showMorningWizard, setShowMorningWizard] = useState(false);
  const [dailyFocus, setDailyFocus] = useLocalStorage<string>('daily-focus', '');

  const { level } = calculateLevel(playerStats.xp);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-bg-dark/80 backdrop-blur-lg border-b border-bg-elevated z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-xp flex items-center justify-center glow-primary">
                <Anchor size={24} weight="bold" className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text">Project Anchor</h1>
                <p className="text-xs text-text-muted">Level {level} • Your Command Center</p>
              </div>
            </div>
            
            {/* Daily Focus Widget */}
            <button
              onClick={() => setShowMorningWizard(true)}
              className="interactive flex items-center gap-2 px-3 py-2 bg-bg-card rounded-xl border border-bg-elevated hover:border-warning transition-colors"
            >
              <Target size={16} className="text-warning" />
              <span className="text-xs font-medium text-text-muted max-w-[120px] truncate">
                {dailyFocus || 'Set focus...'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Morning Wizard Modal */}
      {showMorningWizard && (
        <div className="fixed inset-0 bg-bg-dark/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <MorningWizard 
              tasks={tasks} 
              onComplete={() => setShowMorningWizard(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'hub' && (
          <div className="space-y-6">
            {/* North Star Goals */}
            <NorthStarGoals />

            {/* Top Row - Stats + Quick Capture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PlayerStats stats={playerStats} />
              <QuickCapture />
            </div>

            {/* Middle Row - Tasks + Habits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskList 
                tasks={tasks} 
                setTasks={setTasks}
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
              />
              <HabitTracker 
                habits={habits}
                setHabits={setHabits}
                playerStats={playerStats}
                setPlayerStats={setPlayerStats}
              />
            </div>

            {/* Sentiment Filter */}
            <SentimentFilter />
          </div>
        )}

        {activeTab === 'capture' && (
          <CaptureModule 
            onTasksCreated={(newTasks) => {
              setTasks((prev: Task[]) => [...prev, ...newTasks]);
            }}
          />
        )}

        {activeTab === 'tactician' && (
          <MorningWizard 
            tasks={tasks} 
            onComplete={() => setActiveTab('hub')} 
          />
        )}

        {activeTab === 'arena' && (
          <RewardShop 
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
          />
        )}

        {activeTab === 'tunnel' && (
          <FocusTunnel 
            playerStats={playerStats}
            setPlayerStats={setPlayerStats}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
