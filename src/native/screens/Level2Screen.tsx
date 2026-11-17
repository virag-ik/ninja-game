import React from 'react';
import { GameplayScreenTemplate } from './GameplayScreenTemplate';

interface LevelScreenProps {
  playSound: (soundName: string) => void;
  onGameOver: () => void;
  onLevelClear: () => void;
  onSyncState: (gold: number, levelUnlocked: number) => void;
}

export function Level2Screen(props: LevelScreenProps) {
  return (
    <GameplayScreenTemplate
      levelNumber={2}
      gradientColors={['#02000f', '#080d33', '#15215e']}
      {...props}
    />
  );
}
