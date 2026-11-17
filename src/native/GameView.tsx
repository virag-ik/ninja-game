import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HiddenAudio, AudioRef } from './HiddenAudio';
import { MenuScreen } from './screens/MenuScreen';
import { LevelsScreen } from './screens/LevelsScreen';
import { UpgradesScreen } from './screens/UpgradesScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { LevelClearScreen } from './screens/LevelClearScreen';
import { PlayScreen } from './screens/PlayScreen';

export function GameView() {
  const [activeScene, setActiveScene] = useState<'menu' | 'levels' | 'upgrades' | 'play' | 'gameover' | 'clear'>('menu');
  const [gold, setGold] = useState(0);
  const [levelUnlocked, setLevelUnlocked] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxHealth, setMaxHealth] = useState(3);
  const [dashCooldownMax, setDashCooldownMax] = useState(120);
  const [shurikenLevel, setShurikenLevel] = useState(1);
  const [meleeLevel, setMeleeLevel] = useState(1);

  const audioRef = useRef<AudioRef>(null);

  // Load fresh statistics from AsyncStorage
  const loadStats = async () => {
    try {
      const g = await AsyncStorage.getItem('arashi_gold');
      const l = await AsyncStorage.getItem('arashi_level');
      const maxH = await AsyncStorage.getItem('arashi_maxHealth');
      const cd = await AsyncStorage.getItem('arashi_dashCooldownMax');
      const sL = await AsyncStorage.getItem('arashi_shurikenLevel');
      const mL = await AsyncStorage.getItem('arashi_meleeLevel');

      if (g !== null) setGold(parseInt(g, 10));
      if (l !== null) setLevelUnlocked(parseInt(l, 10));
      if (maxH !== null) setMaxHealth(parseInt(maxH, 10));
      if (cd !== null) setDashCooldownMax(parseInt(cd, 10));
      if (sL !== null) setShurikenLevel(parseInt(sL, 10));
      if (mL !== null) setMeleeLevel(parseInt(mL, 10));
    } catch (e) {
      console.warn('Load stats error', e);
    }
  };

  useEffect(() => {
    loadStats();
  }, [activeScene]);

  const playSound = (soundName: string) => {
    audioRef.current?.play(soundName);
  };

  const handleSyncState = (newGold: number, newLevelUnlocked: number) => {
    setGold(newGold);
    setLevelUnlocked(newLevelUnlocked);
  };

  const handleUpgrade = async (type: 'health' | 'dash' | 'shuriken' | 'melee', cost: number) => {
    if (gold >= cost) {
      const nextGold = gold - cost;
      setGold(nextGold);
      playSound('scroll');

      try {
        await AsyncStorage.setItem('arashi_gold', nextGold.toString());
        if (type === 'health') {
          const nextMaxHealth = Math.min(5, maxHealth + 1);
          setMaxHealth(nextMaxHealth);
          await AsyncStorage.setItem('arashi_maxHealth', nextMaxHealth.toString());
        } else if (type === 'dash') {
          const nextDashCooldownMax = Math.max(60, dashCooldownMax - 20);
          setDashCooldownMax(nextDashCooldownMax);
          await AsyncStorage.setItem('arashi_dashCooldownMax', nextDashCooldownMax.toString());
        } else if (type === 'shuriken') {
          const nextShurikenLevel = Math.min(3, shurikenLevel + 1);
          setShurikenLevel(nextShurikenLevel);
          await AsyncStorage.setItem('arashi_shurikenLevel', nextShurikenLevel.toString());
        } else if (type === 'melee') {
          const nextMeleeLevel = Math.min(3, meleeLevel + 1);
          setMeleeLevel(nextMeleeLevel);
          await AsyncStorage.setItem('arashi_meleeLevel', nextMeleeLevel.toString());
        }
      } catch (e) {
        console.warn('Save upgrade error', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      {/* Hidden Web Audio Synth Player WebView is persisted at root */}
      <HiddenAudio ref={audioRef} />

      {activeScene === 'menu' && (
        <MenuScreen
          onSelectLevel={() => setActiveScene('levels')}
          onGoUpgrades={() => setActiveScene('upgrades')}
        />
      )}

      {activeScene === 'levels' && (
        <LevelsScreen
          levelUnlocked={levelUnlocked}
          gold={gold}
          onBack={() => setActiveScene('menu')}
          onPlayLevel={(levelIdx) => {
            setCurrentLevel(levelIdx);
            setActiveScene('play');
          }}
        />
      )}

      {activeScene === 'upgrades' && (
        <UpgradesScreen
          gold={gold}
          maxHealth={maxHealth}
          dashCooldownMax={dashCooldownMax}
          shurikenLevel={shurikenLevel}
          meleeLevel={meleeLevel}
          onUpgrade={handleUpgrade}
          onBack={() => setActiveScene('menu')}
        />
      )}

      {activeScene === 'gameover' && (
        <GameOverScreen
          onRetry={() => {
            playSound('scroll');
            setActiveScene('play');
          }}
          onBackToMenu={() => {
            playSound('scroll');
            setActiveScene('menu');
          }}
        />
      )}

      {activeScene === 'clear' && (
        <LevelClearScreen
          onBackToMenu={() => {
            playSound('scroll');
            setActiveScene('menu');
          }}
          onGoUpgrades={() => {
            playSound('scroll');
            setActiveScene('upgrades');
          }}
        />
      )}

      {activeScene === 'play' && (
        <PlayScreen
          currentLevel={currentLevel}
          playSound={playSound}
          onGameOver={() => setActiveScene('gameover')}
          onLevelClear={() => setActiveScene('clear')}
          onSyncState={handleSyncState}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
});
