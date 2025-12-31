'use client';

import { Sword, Heart, Coins, Lightning } from '@phosphor-icons/react';
import { PlayerStats as Stats, calculateLevel } from '@/hooks/useLocalStorage';

interface PlayerStatsProps {
  stats: Stats;
}

export default function PlayerStats({ stats }: PlayerStatsProps) {
  const { level, currentXp, xpForNext } = calculateLevel(stats.xp);
  const xpProgress = (currentXp / xpForNext) * 100;
  const hpProgress = (stats.hp / stats.maxHp) * 100;

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
      {/* Avatar & Level */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-xp flex items-center justify-center glow-primary">
            <Sword size={32} weight="duotone" className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-xp flex items-center justify-center text-xs font-bold text-white border-2 border-bg-card">
            {level}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text">Adventurer</h3>
          <p className="text-sm text-text-muted">Level {level} Hero</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Lightning size={16} weight="fill" className="text-xp" />
            <span className="text-xs font-semibold text-xp">XP</span>
          </div>
          <span className="text-xs text-text-muted">{currentXp} / {xpForNext}</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-fill xp-gradient"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* HP Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Heart size={16} weight="fill" className="text-danger" />
            <span className="text-xs font-semibold text-danger">HP</span>
          </div>
          <span className="text-xs text-text-muted">{stats.hp} / {stats.maxHp}</span>
        </div>
        <div className="progress-bar h-3">
          <div 
            className="progress-fill hp-gradient"
            style={{ width: `${hpProgress}%` }}
          />
        </div>
      </div>

      {/* Gold */}
      <div className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
        <div className="flex items-center gap-2">
          <Coins size={20} weight="fill" className="text-gold" />
          <span className="text-sm font-semibold text-gold">Gold</span>
        </div>
        <span className="text-lg font-bold text-gold">{stats.gold}</span>
      </div>
    </div>
  );
}
