import React from 'react';
import { GameplayScreenTemplate } from './GameplayScreenTemplate';

interface LevelScreenProps {
  playSound: (soundName: string) => void;
  onGameOver: () => void;
  onLevelClear: () => void;
  onSyncState: (gold: number, levelUnlocked: number) => void;
}

export function Level1Screen(props: LevelScreenProps) {
  return (
    <GameplayScreenTemplate
      levelNumber={1}
      gradientColors={['#10061e', '#3a1132', '#6c2230']}
      {...props}
    />
  );
}
