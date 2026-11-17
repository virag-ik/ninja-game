import React from 'react';
import { Level1Screen } from './Level1Screen';
import { Level2Screen } from './Level2Screen';
import { Level3Screen } from './Level3Screen';
import { GameplayScreenTemplate } from './GameplayScreenTemplate';

interface PlayScreenProps {
  currentLevel: number;
  playSound: (soundName: string) => void;
  onGameOver: () => void;
  onLevelClear: () => void;
  onSyncState: (gold: number, levelUnlocked: number) => void;
}

const LEVEL_GRADIENTS: Record<number, [string, string, ...string[]]> = {
  1: ['#10061e', '#3a1132', '#6c2230'], // dusk / cherry
  2: ['#02000f', '#080d33', '#15215e'], // midnight / navy
  3: ['#120202', '#2e0b0b', '#57180d'], // volcanic / ash
  4: ['#051c0d', '#020d06', '#000000'], // poison forest
  5: ['#1a0c00', '#3a1a00', '#5e2a00'], // copper cave
  6: ['#001a1a', '#003333', '#004d4d'], // deep ocean / teal
  7: ['#14001a', '#2d003a', '#4c005e'], // amethyst crypt
  8: ['#1e1e06', '#323211', '#4d4d1d'], // sandy dune / gold
  9: ['#0f050d', '#230a1f', '#3c1135'], // twilight orchid
  10: ['#020b14', '#071b30', '#0f2c4d'], // glacier peak
  11: ['#14020b', '#30071a', '#4d0f2a'], // crimson rose
  12: ['#091402', '#1a3007', '#2a4d0f'], // mossy swamp
  13: ['#140c02', '#301d07', '#4d300f'], // bronze fortress
  14: ['#021414', '#073030', '#0f4d4d'], // spectral jade
  15: ['#1c0303', '#3d0707', '#6e0f0f']  // blood red boss chamber
};

export function PlayScreen({ currentLevel, ...props }: PlayScreenProps) {
  if (currentLevel === 1) {
    return <Level1Screen {...props} />;
  } else if (currentLevel === 2) {
    return <Level2Screen {...props} />;
  } else if (currentLevel === 3) {
    return <Level3Screen {...props} />;
  } else {
    const gradient = LEVEL_GRADIENTS[currentLevel] || ['#0d0d0d', '#1a1a1a', '#2a2a2a'];
    return (
      <GameplayScreenTemplate
        levelNumber={currentLevel}
        gradientColors={gradient}
        {...props}
      />
    );
  }
}
