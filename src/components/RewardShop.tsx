'use client';

import { useState } from 'react';
import { Storefront, Coins, Star, Gift, Trophy, ShoppingCart, Check } from '@phosphor-icons/react';
import { PlayerStats } from '@/hooks/useLocalStorage';
import confetti from 'canvas-confetti';

interface RewardShopProps {
  playerStats: PlayerStats;
  setPlayerStats: (stats: PlayerStats | ((prev: PlayerStats) => PlayerStats)) => void;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: 'star' | 'gift' | 'trophy';
  purchased: boolean;
}

const defaultRewards: Reward[] = [
  { id: '1', name: '15 min break', description: 'Guilt-free scroll time', cost: 20, icon: 'star', purchased: false },
  { id: '2', name: 'Favorite snack', description: 'Treat yourself!', cost: 35, icon: 'gift', purchased: false },
  { id: '3', name: '1 episode', description: 'Watch something fun', cost: 50, icon: 'star', purchased: false },
  { id: '4', name: 'Skip a chore', description: 'Tomorrow problem', cost: 75, icon: 'trophy', purchased: false },
  { id: '5', name: 'Special outing', description: 'Go somewhere nice', cost: 150, icon: 'gift', purchased: false },
  { id: '6', name: 'Big reward', description: 'Define your own!', cost: 300, icon: 'trophy', purchased: false },
];

const iconMap = {
  star: Star,
  gift: Gift,
  trophy: Trophy,
};

export default function RewardShop({ playerStats, setPlayerStats }: RewardShopProps) {
  const [rewards, setRewards] = useState<Reward[]>(defaultRewards);
  const [purchasedHistory, setPurchasedHistory] = useState<string[]>([]);

  const purchaseReward = (reward: Reward) => {
    if (playerStats.gold >= reward.cost) {
      // Deduct gold
      setPlayerStats((prev: PlayerStats) => ({
        ...prev,
        gold: prev.gold - reward.cost,
      }));

      // Mark as purchased
      setPurchasedHistory([...purchasedHistory, `${reward.name} - ${new Date().toLocaleDateString()}`]);

      // Celebration
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#EAB308', '#A855F7', '#22C55E'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-warning flex items-center justify-center glow-gold">
          <Storefront size={32} weight="duotone" className="text-bg-dark" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text">Reward Shop</h2>
          <p className="text-text-muted">Spend your hard-earned gold</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-bg-card rounded-xl border border-gold">
          <Coins size={20} weight="fill" className="text-gold" />
          <span className="text-lg font-bold text-gold">{playerStats.gold}</span>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const IconComponent = iconMap[reward.icon];
          const canAfford = playerStats.gold >= reward.cost;
          
          return (
            <button
              key={reward.id}
              onClick={() => canAfford && purchaseReward(reward)}
              disabled={!canAfford}
              className={`interactive p-4 rounded-2xl border-2 text-left transition-all ${
                canAfford
                  ? 'bg-bg-card border-bg-elevated hover:border-gold hover:glow-gold'
                  : 'bg-bg-card/50 border-bg-elevated opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                  <IconComponent size={24} weight="duotone" className="text-gold" />
                </div>
                <div className="flex items-center gap-1">
                  <Coins size={14} className="text-gold" />
                  <span className="text-sm font-bold text-gold">{reward.cost}</span>
                </div>
              </div>
              <h4 className="font-semibold text-text">{reward.name}</h4>
              <p className="text-xs text-text-muted">{reward.description}</p>
            </button>
          );
        })}
      </div>

      {/* Purchase History */}
      {purchasedHistory.length > 0 && (
        <div className="bg-bg-card rounded-xl p-4 border border-bg-elevated">
          <h4 className="text-sm font-semibold text-text-muted mb-3 flex items-center gap-2">
            <ShoppingCart size={16} />
            Recent Rewards
          </h4>
          <div className="space-y-2">
            {purchasedHistory.slice(-3).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Check size={14} className="text-success" />
                <span className="text-text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
