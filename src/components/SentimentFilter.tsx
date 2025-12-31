'use client';

import { useState } from 'react';
import { PencilSimple, MagicWand, Copy, Check, Sparkle } from '@phosphor-icons/react';

// Simulated tone adjustment (in production, use GPT-4o)
const adjustTone = async (text: string, targetTone: 'professional' | 'friendly' | 'assertive'): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Demo transformations
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('angry') || lowercaseText.includes('frustrated') || lowercaseText.includes('hate')) {
    switch (targetTone) {
      case 'professional':
        return "I wanted to bring to your attention some concerns I have regarding this matter. I believe we can find a constructive path forward if we discuss this further.";
      case 'friendly':
        return "Hey! I've been thinking about this and I wanted to share some thoughts. Maybe we can chat about it when you have a moment?";
      case 'assertive':
        return "I need to address this directly. This situation isn't working for me, and I'd like to discuss how we can resolve it.";
    }
  }
  
  if (lowercaseText.includes('quit') || lowercaseText.includes('done') || lowercaseText.includes('give up')) {
    switch (targetTone) {
      case 'professional':
        return "After careful consideration, I've decided to explore new opportunities. I'm grateful for the experiences here and am committed to ensuring a smooth transition.";
      case 'friendly':
        return "I've been doing a lot of thinking, and I feel like it's time for me to try something new. I really appreciate everything!";
      case 'assertive':
        return "I've made the decision to move on. I want to handle this professionally and discuss the next steps.";
    }
  }
  
  // Default: just clean up the text
  return text.charAt(0).toUpperCase() + text.slice(1).trim() + (text.endsWith('.') ? '' : '.');
};

export default function SentimentFilter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'assertive'>('professional');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTransform = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    const result = await adjustTone(input, tone);
    setOutput(result);
    setIsProcessing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-bg-elevated">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-xp/20 flex items-center justify-center">
          <PencilSimple size={24} weight="duotone" className="text-xp" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">Tone Filter</h3>
          <p className="text-xs text-text-muted">Rewrite impulsive messages</p>
        </div>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your angry email draft here..."
        rows={3}
        className="w-full bg-bg-elevated rounded-xl px-4 py-3 text-text placeholder:text-text-muted outline-none border border-transparent focus:border-xp transition-colors resize-none mb-4"
      />

      {/* Tone Selector */}
      <div className="flex gap-2 mb-4">
        {(['professional', 'friendly', 'assertive'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              tone === t
                ? 'bg-xp text-bg-dark'
                : 'bg-bg-elevated text-text-muted hover:bg-bg-elevated/80'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Transform Button */}
      <button
        onClick={handleTransform}
        disabled={!input.trim() || isProcessing}
        className="interactive w-full py-3 bg-gradient-to-r from-xp to-primary rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Sparkle size={20} className="animate-spin" />
            Thinking...
          </>
        ) : (
          <>
            <MagicWand size={20} weight="fill" />
            Make It Nice
          </>
        )}
      </button>

      {/* Output */}
      {output && (
        <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-xl">
          <div className="flex items-start justify-between gap-2">
            <p className="text-text flex-1">{output}</p>
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg bg-bg-elevated hover:bg-success/20 transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-success" />
              ) : (
                <Copy size={16} className="text-text-muted" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
