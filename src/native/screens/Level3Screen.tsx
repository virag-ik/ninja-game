import React from 'react';
import { GameplayScreenTemplate } from './GameplayScreenTemplate';

interface LevelScreenProps {
  playSound: (soundName: string) => void;
  onGameOver: () => void;
  onLevelClear: () => void;
  onSyncState: (gold: number, levelUnlocked: number) => void;
}

export function Level3Screen(props: LevelScreenProps) {
  return (
    <GameplayScreenTemplate
      levelNumber={3}
      gradientColors={['#120202', '#2e0b0b', '#57180d']}
      {...props}
    />
  );
}
