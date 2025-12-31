'use client';

import { Anchor, House, Brain, CalendarCheck, GameController, Timer } from '@phosphor-icons/react';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'hub', name: 'Hub', icon: <House size={24} weight="duotone" /> },
  { id: 'capture', name: 'Capture', icon: <Brain size={24} weight="duotone" /> },
  { id: 'tactician', name: 'Plan', icon: <CalendarCheck size={24} weight="duotone" /> },
  { id: 'arena', name: 'Arena', icon: <GameController size={24} weight="duotone" /> },
  { id: 'tunnel', name: 'Focus', icon: <Timer size={24} weight="duotone" /> },
];

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-bg-elevated z-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-text-muted hover:text-text hover:bg-bg-elevated'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold mt-1">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
